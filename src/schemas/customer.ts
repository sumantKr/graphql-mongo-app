import { gql } from "apollo-server-express";

export const customerTypeDefs = gql`
  type Customer {
    _id: ID!
    name: String!
    email: String!
    age: Int
    location: String
    gender: String
    createdAt: String
    updatedAt: String
  }

  input CreateCustomerInput {
    name: String!
    email: String!
    age: Int
    location: String
    gender: String
  }


  type Query {
    customers: [Customer!]!
    customer(id: ID!): Customer
  }

  type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer!
  }
`;