// MIT License
// Copyright (C) 2019-Present Takram

import { LoggingWinston } from '@google-cloud/logging-winston'
import expressWinston from 'express-winston'
import * as winston from 'winston'

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(info => {
    return `${info.level}: ${info.message}`
  })
)

export const requestLogger = expressWinston.logger({
  transports: [
    ...(process.env.NODE_ENV === 'production' ? [new LoggingWinston()] : []),
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  meta: false,
  colorize: process.env.NODE_ENV !== 'production'
})

export const errorLogger = expressWinston.errorLogger({
  transports: [
    ...(process.env.NODE_ENV === 'production' ? [new LoggingWinston()] : []),
    new winston.transports.Console({
      format: consoleFormat
    })
  ],
  meta: false,
  colorize: process.env.NODE_ENV !== 'production'
})
