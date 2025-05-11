import { mergeResolvers } from "@graphql-tools/merge";
import { orderResolvers } from "./order";
import { productResolvers } from "./product";
import { customerResolvers } from "./customer";

export const resolvers = mergeResolvers([
  orderResolvers,
  productResolvers,
  customerResolvers,
]);
