import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schemas/**/*.ts",
  generates: {
    "./src/types/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers"
      ],
      config: {
        contextType: "../context/context#IDataSourceContext",
        useIndexSignature: true,
        mappers:{
            Order: "../controllers/order/order.model#IOrderModel",
            Product: "../controllers/product/product.model#IProductModel",
            Customer: "../controllers/customer/customers.model#ICustomerModel",
        }
    },
      
    }
  }
};

export default config;