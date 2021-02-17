import { Schema, model } from 'mongoose'
import { ICityDB, IWeatherDB, WEATHERTYPE } from '../models'
import { cleanObj } from '../utils'

const WeatherSchema = new Schema(
  {
    pk: String,
    date: Date,
    weather: {
      type: String,
      enum: WEATHERTYPE
    },
    hourlyTemps: [
      {
        type: Number,
        length: 24
      }
    ]
  },
  {
    toJSON: {
      transform: (doc, ret) => cleanObj<ICityDB>(ret, ['_id', '__v'])
    }
  }
)

const WeatherModel = model<IWeatherDB>('weather', WeatherSchema)

export default WeatherModel
