// MIT License
// Copyright (C) 2019-Present Takram

import { GraphQLScalarType, Kind } from 'graphql'
import gql from 'graphql-tag'
import moment from 'moment'

export const typeDefs = gql`
  scalar Date
`

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',

    serialize (value) {
      return moment(value).toISOString()
    },

    parseValue (value) {
      return moment(value).toDate()
    },

    parseLiteral ({ kind, value }) {
      if (kind === Kind.STRING) {
        return moment(value).toDate()
      }
      return null
    }
  })
}
