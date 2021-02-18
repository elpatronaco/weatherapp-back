import express, { Router, json } from 'express'
import cors from 'cors'

const router = Router()

const notfoundMiddleware = require('../middleware/notfound')
const logMiddleware = require('../middleware/loggingmiddleware')

const apiRoutes = require('./api')
const authRoutes = require('./auth')

router
  .use(json())
  .use(cors())
  .use(logMiddleware)
  .use('/auth', authRoutes)
  .use('/api', apiRoutes)
  .use(notfoundMiddleware)

module.exports = router
