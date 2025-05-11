export const customerResolvers = {
  Query: {
    customers: async (_parent: any, _args: any, context: any) => {
        return await context.dataSources.customerService.getAllCustomers();
    },
    customer: async (_parent: any, { id }: any, context: any) => {
      return await context.dataSources.customerService.getCustomerById(id);
    },
  },
  Mutation: {
    createCustomer: async (_parent: any, { input }: any, context: any) => {
      return await context.dataSources.customerService.createCustomer(input);
    },
  },
};
