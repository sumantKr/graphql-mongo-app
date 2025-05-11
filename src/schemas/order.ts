import { gql } from "apollo-server-express";

export const orderTypeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    description: String
    price: Float!
    category: String
    stock: Int
    createdAt: String
    updatedAt: String
  }
  type OrderProduct {
    product: Product
    quantity: Int
    priceAtPurchase: Float
  }

  type OrderCustomer {
    _id: ID!
    name: String!
    email: String!
    age: Int
    location: String
    gender: String
    createdAt: String
    updatedAt: String
  }

  type Order {
    _id: ID!
    customer: OrderCustomer!
    products: [OrderProduct!]!
    totalAmount: Float!
    status: String
    createdAt: String
    updatedAt: String
  }

  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String
  }

  type TopProduct {
    _id: ID!
    totalSold: Int!
    totalRevenue: Float!
    product: Product
  }
  type CategoryRevenue {
    category: String!
    revenue: Float!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryRevenue!]!
  }

  input CreateOrderInput {
    customerId: ID!
    productIds: ID!
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
    getCustomerSpending(customerId: ID!): CustomerSpending!
    getTopSellingProducts: [TopProduct!]!
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics!
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
  }
`;
