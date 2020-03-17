// MIT License
// Copyright (C) 2019-Present Takram

import moment from 'moment'
import { Op } from 'sequelize'

export function getMessages (
  database,
  { deviceId, from, to, orderBy: { field, direction } = {}, page, perPage } = {}
) {
  const options = {
    where: {},
    offset: page * perPage,
    limit: perPage
  }
  if (deviceId != null) {
    options.where.deviceId = deviceId
  }
  if (from != null || to != null) {
    options.where.date = {}
    if (from != null) {
      options.where.date[Op.gte] = from
    }
    if (to != null) {
      options.where.date[Op.lte] = to
    }
  }
  if (field != null) {
    options.order = [[field, direction]]
  }
  return database.models.message.findAll(options)
}

export function makeCursor (date) {
  if (!(date instanceof Date)) {
    throw new Error()
  }
  return Buffer.from(`${+date}`).toString('base64')
}

export function parseCursor (cursor) {
  const value = Buffer.from(cursor, 'base64').toString('ascii')
  if (!/^(0|[1-9][0-9]*)$/.test(value)) {
    throw new Error()
  }
  return moment(+value).toDate()
}

export async function getMessageFeed (
  database,
  { deviceId, first, after } = {}
) {
  if (first < 0) {
    throw new Error()
  }
  const options = {
    where: {}
  }
  if (deviceId != null) {
    options.where.deviceId = deviceId
  }
  const totalCount = await database.models.message.count(options)
  if (after != null) {
    options.where.date = { [Op.lt]: parseCursor(after) }
  }
  const length = first != null ? first : totalCount
  const nodes = await database.models.message.findAll({
    ...options,
    order: [['date', 'DESC']],
    limit: length + 1
  })
  const edges = nodes.slice(0, length).map(node => ({
    node,
    cursor: makeCursor(node.date)
  }))
  const pageInfo = {
    ...(edges.length > 0
      ? {
        endCursor: edges[edges.length - 1].cursor
      }
      : {}),
    hasNextPage: nodes.length > length
  }
  return {
    totalCount,
    edges,
    pageInfo
  }
}
