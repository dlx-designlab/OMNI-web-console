// MIT License
// Copyright (C) 2019-Present Takram

import cluster from 'cluster'
import debug from 'debug'

export default function createDebug (...args) {
  const result = cluster.isWorker
    ? debug(`app:worker${cluster.worker.id}`)
    : debug('app:master')
  return args.length > 0 ? result.extend(...args) : result
}
