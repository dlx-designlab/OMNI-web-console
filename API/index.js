// MIT License
// Copyright (C) 2019-Present Takram

process.env.TZ = 'UTC'

// Activate Google Cloud Trace and Debug in production
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start()
  require('@google-cloud/debug-agent').start()
}

require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
  require('./lib/index.js')
} else {
  require('./dest/index.js')
}
