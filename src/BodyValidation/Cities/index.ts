import Joi from 'joi'
import { ICity, WEATHERTYPE } from '../../models'
import { IBodyValidation, PromiseResult } from './models'

const CityValidation = (): IBodyValidation => {
  const CityValidator = {
    pk: Joi.string().lowercase(),
    city: Joi.string(),
    country: Joi.string()
  }

  return {
    toCreate: (body: ICity) =>
      new Promise<PromiseResult>(async (resolve, reject) => {
        try {
          await Joi.object({
            city: CityValidator.city.required(),
            country: CityValidator.country.required()
          }).validateAsync(body)

          resolve('OK')
        } catch (err) {
          reject(err)
        }
      })
  }
}

export default CityValidation
