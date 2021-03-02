import { Router, Request, Response, NextFunction } from 'express'
import ResponseHandler from '../../../utils/ResponseHandler'
import CitiesModel from '../../../schema/cities.model'
import CityValidation from '../../../BodyValidation/Cities'
import { ICityDB } from '../../../models'

const router = Router()
const response = ResponseHandler()
const validate = CityValidation()

router
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
      await validate.toCreate(req.body)

      const doc: ICityDB | null = await CitiesModel.updateOne(
        { pk: req.params.pk },
        { pk: req.params.pk, ...req.body },
        {
          setDefaultsOnInsert: true,
          upsert: true,
          new: true,
          returnOriginal: false
        }
      ).exec()

      return doc ? response.success.done(res) : response.fail.notfound(res)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })
  .get('/', async (req: Request, res: Response) => {
    try {
      const docs = await CitiesModel.find({})

      const finalDocs =
        docs && docs.length > 0 ? docs.map(doc => doc.toJSON()) : []

      return response.success.done(res, finalDocs)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })
  .get('/:pk', async (req: Request, res: Response) => {
    try {
      const doc: ICityDB | null = await CitiesModel.findOne({
        pk: req.params.pk
      })

      return doc
        ? response.success.done(res, doc.toJSON())
        : response.fail.notfound(res)
    } catch (err) {
      return response.fail.handle(res, err)
    }
  })

module.exports = router
