import mongoose from "mongoose";
import { OrderModel } from "./order.model";
import { ProductModel } from "../product/product.model";
import { redisClient } from "../../utils/redis-connect";

class OrderService {
  private orderModel = OrderModel;
  private productModel = ProductModel;
  async createOrder(customerId: string, productIds: string) {
    // Split the comma-separated product IDs
    const productIdArray = productIds.split(",").map((id) => id.trim());

    const products = await Promise.all(
      productIdArray.map(async (productId) => {
        const product = await this.productModel.findById(productId);
        // add checks for product existence and availability, also decrease the amount from the stock
        if (!product) {return }
          return {
            productId: product._id,
            quantity: 1,
            priceAtPurchase: product.price,
          };
      })
    );

    const totalAmount = products.reduce(
      (sum, p) => sum + p!.quantity * p!.priceAtPurchase,
      0
    );

    const order = new this.orderModel({
      customerId,
      products,
      totalAmount,
      status: "pending",
      orderDate: new Date(),
    });

    return await order.save();
  }

  async getAllOrders() {
    return await this.orderModel.find();
  }

  async getOrderById(id: string) {
    return await this.orderModel.findById(id);
  }

  async getCustomerSpending(customerId: string) {
    const result = await this.orderModel.aggregate([
      { $match: { customerId: new mongoose.Types.UUID(customerId) } },
      {
        $group: {
          _id: "$customerId",
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          lastOrderDate: { $max: "$orderDate" },
        },
      },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          totalSpent: 1,
          averageOrderValue: 1,
          lastOrderDate: 1,
        },
      },
    ]);

    if (result.length === 0) {
      return {
        customerId,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null,
      };
    }

    return result[0];
  }

  async getTopSellingProducts() {
    const result = await this.orderModel.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$products.quantity", "$products.priceAtPurchase"],
            },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);
    return result;
  }

  async getSalesAnalytics(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const key =  `salesAnalytics:${startDate}:${endDate}`;
    const analyticsData = await redisClient.get(key)
    if (analyticsData) {
      return JSON.parse(analyticsData);
    }
    const result = await this.orderModel.aggregate([
      {
        $match: {
          orderDate: {
            $gte: start,
            $lte: end,
          },
        },
      },
      { $unwind: "$products" },

      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      { $unwind: "$productDetails" },

      {
        $match: {
          status: "completed",
        },
      },

      {
        $addFields: {
          productRevenue: {
            $multiply: ["$products.quantity", "$products.priceAtPurchase"],
          },
          category: "$productDetails.category",
        },
      },

      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$productRevenue" },
          completedOrders: { $addToSet: "$_id" },
          categoryMap: {
            $push: {
              category: "$category",
              revenue: "$productRevenue",
            },
          },
        },
      },

      {
        $unwind: "$categoryMap",
      },
      {
        $group: {
          _id: {
            totalRevenue: "$totalRevenue",
            completedOrders: "$completedOrders",
          },
          categoryBreakdown: {
            $push: {
              category: "$categoryMap.category",
              revenue: "$categoryMap.revenue",
            },
          },
        },
      },

      {
        $unwind: "$categoryBreakdown",
      },
      {
        $group: {
          _id: {
            totalRevenue: "$_id.totalRevenue",
            completedOrders: "$_id.completedOrders",
          },
          categoryRevenueMap: {
            $push: {
              k: "$categoryBreakdown.category",
              v: "$categoryBreakdown.revenue",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: "$_id.totalRevenue",
          completedOrders: {
            $size: "$_id.completedOrders",
          },
          categoryBreakdown: {
            $map: {
              input: {
                $reduce: {
                  input: "$categoryRevenueMap",
                  initialValue: [],
                  in: {
                    $cond: [
                      {
                        $in: ["$$this.k", "$$value.k"],
                      },
                      "$$value",
                      {
                        $concatArrays: [
                          "$$value",
                          [{ k: "$$this.k", v: "$$this.v" }],
                        ],
                      },
                    ],
                  },
                },
              },
              as: "entry",
              in: {
                category: "$$entry.k",
                revenue: "$$entry.v",
              },
            },
          },
        },
      },
    ]);
    await redisClient.set(key, JSON.stringify(result[0]), {
      EX: 60 * 60,
    });
    return (
      result[0] || {
        totalRevenue: 0,
        completedOrders: 0,
        categoryBreakdown: [],
      }
    );
  }
}

export default OrderService;
