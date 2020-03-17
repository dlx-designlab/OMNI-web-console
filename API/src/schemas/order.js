// MIT License
// Copyright (C) 2019-Present Takram

import gql from 'graphql-tag'

export const typeDefs = gql`
  enum OrderDirection {
    ASC
    DESC
  }

  input Order {
    field: String!
    direction: OrderDirection = DESC
  }
`

export const resolvers = {
  OrderDirection: {
    ASC: 'ASC',
    DESC: 'DESC'
  }
}
