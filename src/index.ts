import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

// config db connection
require('./db')

const routes = require('./routes')
const APP = express()
const PORT = process.env.PORT ?? 4000

APP.use(routes)

APP.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
