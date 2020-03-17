// MIT License
// Copyright (C) 2019-Present Takram

import { readFile } from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(readFile)

export default async function loadDevices () {
  const file = path.resolve(__dirname, '../devices.json')
  return JSON.parse(await readFileAsync(file, 'utf8'))
}
