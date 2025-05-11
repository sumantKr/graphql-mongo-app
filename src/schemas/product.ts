import { gql } from "apollo-server-express";

export const productTypeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    price: Float!
    category: String
    stock: Int
    createdAt: String
    updatedAt: String
  }

  input CreateProductInput {
    name: String!
    price: Float!
    category: String
    stock: Int
  }



  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
  }
`;