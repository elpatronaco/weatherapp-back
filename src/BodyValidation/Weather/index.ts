import Joi from 'joi'
import { ICity, IWeather, IWeatherQuery, WEATHERTYPE } from '../../models'
import { IBodyValidation, PromiseResult } from './models'

const CityValidation = (): IBodyValidation => {
  const WeatherDate = {
    pk: Joi.string(),
    date: Joi.string().isoDate(),
    weather: Joi.string().valid(...Object.values(WEATHERTYPE)),
    hourlyTemps: Joi.array().length(24).items(Joi.number())
  }

  return {
    toCreate: (body: IWeather) =>
      new Promise<PromiseResult>(async (resolve, reject) => {
        try {
          await Joi.object({
            date: WeatherDate.date.required(),
            weather: WeatherDate.weather.required(),
            hourlyTemps: WeatherDate.hourlyTemps.required()
          }).validateAsync(body)

          resolve('OK')
        } catch (err) {
          reject(err)
        }
      }),
    toQuery: (query: IWeatherQuery) =>
      new Promise<PromiseResult>(async (resolve, reject) => {
        try {
          await Joi.object({
            date: WeatherDate.date.required()
          }).validateAsync(query)

          resolve('OK')
        } catch (err) {
          reject(err)
        }
      })
  }
}

export default CityValidation
