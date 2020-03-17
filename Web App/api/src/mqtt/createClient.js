// MIT License
// Copyright (C) 2019-Present Takram

import mqtt from 'mqtt'

import createDebug from '../createDebug'

const debug = createDebug('createClient')

const eventTypes = [
  'connect',
  'reconnect',
  'close',
  'disconnect',
  'offline',
  'error',
  'end',
  'message',
  'packetsend',
  'packetreceive'
]

export default async function createClient (devices) {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(process.env.MQTT_HOST, {
      port: process.env.MQTT_PORT,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD
    })
    eventTypes.forEach(eventType => {
      client.on(eventType, (...args) => debug(`Event: ${eventType}`, ...args))
    })
    const topics = devices.map(({ id }) => `lora/ttyymmt/${id}/rx`)
    client.subscribe(topics)
    client.once('connect', () => {
      resolve(client)
    })
  })
}
