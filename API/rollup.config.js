// MIT License
// Copyright (C) 2019-Present Takram

import builtinModules from 'builtin-modules'
import babel from 'rollup-plugin-babel'

import pkg from './package.json'

const external = id => {
  const [key] = id.startsWith('@')
    ? id.match(/^.+?\/.+?(?=\/|$)/)
    : id.split('/')
  return (
    (pkg.dependencies || {})[key] ||
    (pkg.peerDependencies || {})[key] ||
    builtinModules.indexOf(key) !== -1
  )
}

export default [
  {
    input: 'src/index.js',
    output: {
      file:
        process.env.BUILD === 'production' ? 'lib/index.js' : 'dest/index.js',
      format: 'cjs',
      sourcemap: true
    },
    external,
    plugins: [babel()]
  }
]
