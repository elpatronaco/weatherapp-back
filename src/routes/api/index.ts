import { Router } from 'express'

const router = Router()

router.use('/cities', require('./cities')).use('/weather', require('./weather'))

module.exports = router
