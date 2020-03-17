// MIT License
// Copyright (C) 2019-Present Takram

import { RedisCache } from 'apollo-server-cache-redis'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import createDebug from './createDebug'
import connectDatabase from './models/connectDatabase'
import loadDevices from './models/loadDevices'
import createClient from './mqtt/createClient'
import parseMessage from './mqtt/parseMessage'
import schema from './schema'
import { errorLogger, requestLogger } from './winstonLoggers'

const debug = createDebug('createApp')

export default async function createApp () {
  const database = connectDatabase({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dialect: process.env.DATABASE_DIALECT,
    storage: process.env.DATABASE_STORAGE
  })

  // Initial synchronization
  try {
    await database.sync({ force: false, alter: true })
  } catch (error) {
    await database.sync({ force: true })
  }

  const devices = await loadDevices()
  const client = await createClient(devices)
  const server = new ApolloServer({
    schema,
    cache: new RedisCache({
      host: process.env.CACHE_REDIS_HOST,
      port: process.env.CACHE_REDIS_PORT
    }),
    context: { devices, database },
    engine: { apiKey: process.env.ENGINE_API_KEY },
    tracing: true,
    introspection: true,
    playground: true
  })

  client.on('message', async (topic, message) => {
    const data = parseMessage(message)
    debug(data)
    await database.models.message.upsert(data)
  })

  const app = express()
  app.set('trust proxy', true)
  app.use(helmet())
  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  // Respond to health checks.
  app.get('/ping', (req, res) => {
    res.sendStatus(200)
  })

  // Log everything after this.
  app.use(requestLogger)

  // Any error handlers should go after this.
  app.use(errorLogger)

  // GraphQL
  server.applyMiddleware({ app, path: '/' })

  // Basic 404 handler
  app.use((req, res) => {
    res.sendStatus(404)
  })

  // Basic error handler
  app.use((error, req, res, next) => {
    debug(error)
    res.sendStatus(500)
  })

  return app
}
