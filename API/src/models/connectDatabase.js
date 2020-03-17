// MIT License
// Copyright (C) 2019-Present Takram

import cls from 'cls-hooked'
import { truncate } from 'lodash'
import Sequelize from 'sequelize'

import createDebug from '../createDebug'
import defineMessageModel from './defineMessageModel'

const debug = createDebug('connectDatabase')
const namespace = cls.createNamespace('omni')

Sequelize.useCLS(namespace)

const MESSAGE_PATTERN = /^Executing \(([a-z0-9]+)[^)]*\)/

function log (message) {
  if (debug.enabled) {
    debug(truncate(message.replace(MESSAGE_PATTERN, '$1'), { length: 100 }))
  }
}

export default function connectDatabase (options = {}) {
  const database = new Sequelize({ logging: log, ...options })
  defineMessageModel(database)
  return database
}
