import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import mongoose from "mongoose";
import { CustomerModel } from "../controllers/customer/customers.model";
import { ProductModel } from "../controllers/product/product.model";
import { OrderModel } from "../controllers/order/order.model";
import { DB_PATH } from "../constants/constants";

async function seedData() {
  try {
    await mongoose.connect("mongodb://localhost:27017/graphql-data");

    console.log("Starting the seeding process...");
    // Seed Customers
    const customersFilePath = path.join(__dirname, "./customers.csv");
    const customers = await parseCSV(customersFilePath);
    await CustomerModel.insertMany(customers);
    console.log("Customers seeded successfully!");

    // Seed Products
    const productsFilePath = path.join(__dirname, "./products.csv");
    const products = await parseCSV(productsFilePath);
    await ProductModel.insertMany(products);
    console.log("Products seeded successfully!");

    // Seed Orders
    const ordersFilePath = path.join(__dirname, "./orders.csv");
    const orders = await parseCSV(ordersFilePath);

    const parsedOrders = orders.map((order) => {
      return {
        ...order,
        customerId: order.customerId as string,
        products: JSON.parse(order.products.replace(/'/g, '"')).map(
          (product: any) => ({
            productId: product.productId as string,
            quantity: Number(product.quantity),
            priceAtPurchase: Number(product.priceAtPurchase),
          })
        ),
        totalAmount: Number(order.totalAmount),
        orderDate: new Date(order.orderDate),
      };
    });
    await OrderModel.insertMany(parsedOrders);
    console.log("Orders seeded successfully!");

    console.log("Seeding process completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

seedData();
