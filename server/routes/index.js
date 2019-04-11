const routes = require('express').Router()

routes.user('/users', require('./users'))

module.exports = routes