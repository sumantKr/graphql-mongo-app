export const productResolvers = {
  Query: {
    products: async (_parent: any, _args: any, context: any) => {
      return await context.dataSources.productService.getAllProducts();
    },
    product: async (_: any, { id }: { id: string }, context: any) => {
      return await context.dataSources.productService.getProductById(id);
    },
  },
  Mutation: {
    createProduct: async (_: any, { input }: any, context: any) => {
      return await context.dataSources.productService.createProduct(input);
    },
  },
};
