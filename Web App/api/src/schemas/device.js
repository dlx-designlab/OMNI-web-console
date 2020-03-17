// MIT License
// Copyright (C) 2019-Present Takram

import gql from 'graphql-tag'
import { delegateToSchema } from 'graphql-tools'

import schema from '../schema'

export const typeDefs = gql`
  extend type Query {
    devices: [Device]!
    device(id: ID!): Device
  }

  type Device {
    id: ID!
    key: String!
    name: String!

    messages(
      from: Date
      to: Date
      orderBy: Order
      page: Int = 0
      perPage: Int = 100
    ): [Message]!

    messageFeed(first: Int, after: String): MessageFeed!
  }
`

export const resolvers = {
  Query: {
    devices (parent, args, context, info) {
      return context.devices
    },

    device (parent, { id }, context, info) {
      return context.devices.find(device => device.id === id)
    }
  },

  Device: {
    messages ({ id }, args, context, info) {
      return delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'messages',
        args: { ...args, deviceId: id },
        context,
        info
      })
    },

    messageFeed ({ id }, args, context, info) {
      return delegateToSchema({
        schema,
        operation: 'query',
        fieldName: 'messageFeed',
        args: { ...args, deviceId: id },
        context,
        info
      })
    }
  }
}
