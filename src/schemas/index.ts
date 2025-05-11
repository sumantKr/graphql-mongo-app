import { mergeTypeDefs } from "@graphql-tools/merge";
import { customerTypeDefs } from "./customer";
import { productTypeDefs } from "./product";
import { orderTypeDefs } from "./order";

export const typeDefs = mergeTypeDefs([
  customerTypeDefs,
  productTypeDefs,
  orderTypeDefs,
]);
