'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_API_URL: '"http://192.168.0.220:5840"'
  // VUE_APP_API_URL: '"http://husend.free.idcfengye.com"'
})
