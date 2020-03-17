// MIT License
// Copyright (C) 2019-Present Takram

import Sequelize from 'sequelize'

import { getMessageFeed, makeCursor, parseCursor } from './queryFunctions'

describe('queryFunctions', () => {
  describe('getMessages', () => {})

  describe('makeCursor', () => {
    test('works', () => {
      expect(() => makeCursor()).toThrow()
      expect(() => makeCursor(0)).toThrow()
      expect(() => makeCursor('')).toThrow()
      expect(makeCursor(new Date())).toMatch(
        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
      )
    })
  })

  describe('parseCursor', () => {
    test('works', () => {
      expect(() => parseCursor()).toThrow()
      expect(() => parseCursor(0)).toThrow()
      expect(() => parseCursor('')).toThrow()
      const date = new Date()
      expect(+parseCursor(makeCursor(date))).toBe(+date)
    })
  })

  describe('getMessageFeed', () => {
    let database
    const data = [
      { date: new Date(2009, 0) },
      { date: new Date(2008, 0) },
      { date: new Date(2007, 0) },
      { date: new Date(2006, 0) },
      { date: new Date(2005, 0) },
      { date: new Date(2004, 0) },
      { date: new Date(2003, 0) },
      { date: new Date(2002, 0) },
      { date: new Date(2001, 0) },
      { date: new Date(2000, 0) }
    ]

    beforeEach(async () => {
      database = new Sequelize('', '', '', {
        dialect: 'sqlite',
        logging: false
      })
      const model = database.define('message', {
        date: { type: Sequelize.DATE }
      })
      await database.sync()
      await Promise.all(data.map(data => model.upsert(data)))
    })

    test('with no options', async () => {
      const response = await getMessageFeed(database)
      expect(response.totalCount).toBe(10)
      expect(response.edges.length).toBe(10)
      response.edges.forEach((edge, index) => {
        expect(+edge.node.date).toBe(+data[index].date)
        expect(edge.cursor).toBe(makeCursor(data[index].date))
      })
      expect(response.pageInfo).toStrictEqual({
        endCursor: makeCursor(data[9].date),
        hasNextPage: false
      })
    })

    test('with first', async () => {
      const response = await getMessageFeed(database, { first: 5 })
      expect(response.totalCount).toBe(10)
      expect(response.edges.length).toBe(5)
      response.edges.forEach((edge, index) => {
        expect(+edge.node.date).toBe(+data[index].date)
        expect(edge.cursor).toBe(makeCursor(data[index].date))
      })
      expect(response.pageInfo).toStrictEqual({
        endCursor: makeCursor(data[4].date),
        hasNextPage: true
      })
    })

    test('with first over total count', async () => {
      const response = await getMessageFeed(database, { first: 20 })
      expect(response.totalCount).toBe(10)
      expect(response.edges.length).toBe(10)
      response.edges.forEach((edge, index) => {
        expect(+edge.node.date).toBe(+data[index].date)
        expect(edge.cursor).toBe(makeCursor(data[index].date))
      })
      expect(response.pageInfo).toStrictEqual({
        endCursor: makeCursor(data[9].date),
        hasNextPage: false
      })
    })

    test('with zero first', async () => {
      const response = await getMessageFeed(database, { first: 0 })
      expect(response.totalCount).toBe(10)
      expect(response.edges.length).toBe(0)
      expect(response.pageInfo).toStrictEqual({
        hasNextPage: true
      })
    })

    test('throws error with negative first', async () => {
      await expect(getMessageFeed(database, { first: -1 })).rejects.toThrow()
    })

    test('with after', async () => {
      const response = await getMessageFeed(database, {
        after: makeCursor(data[4].date)
      })
      expect(response.totalCount).toBe(10)
      expect(response.edges.length).toBe(5)
      response.edges.forEach((edge, index) => {
        expect(+edge.node.date).toBe(+data[index + 5].date)
        expect(edge.cursor).toBe(makeCursor(data[index + 5].date))
      })
      expect(response.pageInfo).toStrictEqual({
        endCursor: makeCursor(data[9].date),
        hasNextPage: false
      })
    })

    test('throws error with invalid after', async () => {
      await expect(getMessageFeed(database, { after: 'no' })).rejects.toThrow()
    })

    test('with first and after', async () => {
      const response = await getMessageFeed(database, {
        first: 2,
        after: makeCursor(data[4].date)
      })
      expect(response.totalCount).toBe(10)
      expect(response.edges.length).toBe(2)
      response.edges.forEach((edge, index) => {
        expect(+edge.node.date).toBe(+data[index + 5].date)
        expect(edge.cursor).toBe(makeCursor(data[index + 5].date))
      })
      expect(response.pageInfo).toStrictEqual({
        endCursor: makeCursor(data[6].date),
        hasNextPage: true
      })
    })
  })
})
