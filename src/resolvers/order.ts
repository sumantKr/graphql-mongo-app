export const orderResolvers = {
  Query: {
    orders: async (_parent: any, _args: any, context: any) => {
      return await context.dataSources.orderService.getAllOrders();
    },
    order: async (_: any, { id }: { id: string }, context: any) => {
      return await context.dataSources.orderService.getOrderById(id);
    },

    getCustomerSpending: async (_: any, { customerId }: any, context: any) => {
      return await context.dataSources.orderService.getCustomerSpending(
        customerId
      );
    },
    getTopSellingProducts: async (_: any, __: any, context: any) => {
      return await context.dataSources.orderService.getTopSellingProducts();
    },
    getSalesAnalytics: async (
      _: any,
      { startDate, endDate }: any,
      context: any
    ) => {
      return await context.dataSources.orderService.getSalesAnalytics(
        startDate,
        endDate
      );
    },
  },
  Mutation: {
    createOrder: async (_: any, { input }: any, context: any) => {
      return await context.dataSources.orderService.createOrder(
        input.customerId,
        input.productIds
      );
    },
  },
  Order: {
    customer: async (order: any, _: any, context: any) => {
      return await context.dataSources.customerService.getCustomerById(
        order.customerId
      );
    },
    products: async (order: any, _: any, context: any) => {
      const enrichedProducts = await Promise.all(
        order.products.map(async (op: any) => {
          const product =
            await context.dataSources.productService.getProductById(
              op.productId
            );
          return {
            product,
            quantity: op.quantity,
            priceAtPurchase: op.priceAtPurchase,
          };
        })
      );
      return enrichedProducts;
    },
  },
};
