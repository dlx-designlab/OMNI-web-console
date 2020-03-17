// MIT License
// Copyright (C) 2019-Present Takram

import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'

import {
  resolvers as dateResolvers,
  typeDefs as dateTypeDefs
} from './schemas/date'
import {
  resolvers as deviceResolvers,
  typeDefs as deviceTypeDefs
} from './schemas/device'
import {
  resolvers as messageResolvers,
  typeDefs as messageTypeDefs
} from './schemas/message'
import {
  resolvers as orderResolvers,
  typeDefs as orderTypeDefs
} from './schemas/order'

const query = 'type Query { _: String }'

export default makeExecutableSchema({
  typeDefs: [
    query,
    dateTypeDefs,
    deviceTypeDefs,
    messageTypeDefs,
    orderTypeDefs
  ],
  resolvers: merge(
    dateResolvers,
    deviceResolvers,
    messageResolvers,
    orderResolvers
  )
})
