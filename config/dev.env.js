'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_SERVER: '"http://poisotlab.biol.umontreal.ca"',
  BASE_URL: '"/api/v2"'
})
