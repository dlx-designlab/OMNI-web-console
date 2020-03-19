// MIT License
// Copyright (C) 2019-Present Takram

import gql from 'graphql-tag'

import { getMessageFeed, getMessages } from '../models/queryFunctions'
import parseData from '../mqtt/parseData'

export const typeDefs = gql`
  extend type Query {
    messages(
      deviceId: ID
      from: Date
      to: Date
      orderBy: Order
      page: Int = 0
      perPage: Int = 100
    ): [Message]!

    messageFeed(deviceId: ID, first: Int, after: String): MessageFeed!
  }

  type Message {
    date: Date!
    rssi: Float!
    snr: Float!
    gatewayId: String!
    frequency: Float!
    counter: Int!
    data: MessageData!
    type: String!
    deviceId: String!
    dataRate: String!
    port: Int!
    device: Device!
  }

  type MessageData {
    latitude: Float!
    longitude: Float!
    altitude: Float!
    temperature1: Float!
    temperature2: Float!
    temperature3: Float!
    salinity: Float!
    satellite: Float!
  }

  type MessageFeed {
    totalCount: Int!
    edges: [MessageEdge]!
    pageInfo: MessagePageInfo!
  }

  type MessageEdge {
    node: Message!
    cursor: String!
  }

  type MessagePageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
`

export const resolvers = {
  Query: {
    async messages (parent, args, context, info) {
      return getMessages(context.database, args)
    },

    messageFeed (parent, args, context, info) {
      return getMessageFeed(context.database, args)
    }
  },

  Message: {
    device ({ deviceId }, args, context, info) {
      return context.devices.find(device => device.id === deviceId)
    },

    data ({ data }, args, context, info) {
      if (typeof data === 'string') {
        return parseData(data)
      }
      return data
    }
  }
}
