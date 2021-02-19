import { Router, Request, Response, NextFunction } from 'express'
import ResponseHandler from '../../../utils/ResponseHandler'
import WeatherValidation from '../../../BodyValidation/Weather'
import { ICityDB, IWeather, IWeatherDB, IWeatherQuery } from '../../../models'
import WeatherModel from '../../../schema/weather.model'
import { getDate, addDays } from '../../../utils'

const authMiddleware = require('../../../middleware/authmiddleware')
const router = Router()
const response = ResponseHandler()
const validate = WeatherValidation()

router
  .get('/', async (req: Request, res: Response) => {
    try {
      const doc = await WeatherModel.findOne({})
      return response.success.done(res, doc)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })
  .get('/:pk', async (req: Request, res: Response) => {
    try {
      if (!req.params.pk)
        return response.fail.badRequest(res, "'pk' param is missing")

      /* if (req.query) {
        const query: any = { ...req.query }
        await validate.toQuery(query)
      } */

      const initialDate: Date = getDate(
        req.query.date ? req.query.date.toString() : new Date().toISOString()
      )

      const nextWeek = addDays(initialDate, 7)

      const docs: IWeatherDB[] | null = await WeatherModel.find({
        pk: req.params.pk,
        date: {
          $gte: initialDate,
          $lt: nextWeek
        }
      })

      return docs
        ? response.success.done(res, docs ? docs.map(d => d.toJSON()) : null)
        : response.fail.notfound(res)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })
  /**
   * Crear/actualizar ciudad
   * @method GET/api/cities/:pk
   *
   * @param {string} pk - PK del usuari
   * @body {object} - Datos
   * @return {string} Bearer token de validació
   *
   */
  .put('/:pk', async (req: Request, res: Response) => {
    try {
      if (!req.params.pk)
        return response.fail.badRequest(res, "'pk' param is missing")

      await validate.toCreate(req.body)

      const date: Date = getDate(req.body.date.toString())

      const doc: IWeatherDB | null = await WeatherModel.findOne({
        pk: req.params.pk,
        date: date
      })

      const finalDoc = doc
        ? await doc.updateOne({ ...req.body })
        : await WeatherModel.create({
            ...req.body,
            pk: req.params.pk,
            date: date
          })

      return finalDoc
        ? response.success.created(res)
        : response.fail.notfound(res)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })
  .delete('/', authMiddleware, (req: Request, res: Response) => {
    try {
      WeatherModel.deleteMany({}, {}).exec(err => {
        return !err ? response.success.done(res) : response.fail.notfound(res)
      })
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })
  .delete('/:pk', authMiddleware, async (req: Request, res: Response) => {
    try {
      if (!req.params.pk)
        return response.fail.badRequest(res, 'Missing param pk')

      if (!req.query.date)
        return response.fail.badRequest(res, 'Missing query date')

      const date = new Date(req.query.date.toString())

      const doc: IWeatherDB | null = await WeatherModel.findOne({
        pk: req.params.pk,
        date: date
      })

      if (doc) {
        doc.remove()
        return response.success.done(res)
      } else return response.fail.notfound(res)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })

module.exports = router
