import express, { Router, json } from 'express'
import cors from 'cors'

const router = Router()

const notfoundMiddleware = require('../middleware/notfound')
const logMiddleware = require('../middleware/loggingmiddleware')

const apiRoutes = require('./api')

router
  .use(json())
  .use(cors())
  .use(logMiddleware)
  .use('/api', apiRoutes)
  .use(notfoundMiddleware)

module.exports = router
