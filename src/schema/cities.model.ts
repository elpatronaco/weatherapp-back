import { Schema, model } from 'mongoose'
import { ICityDB, WEATHERTYPE } from '../models'
import { cleanObj } from '../utils'

const CitiesSchema = new Schema(
  {
    pk: String,
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform: (doc, ret) => cleanObj<ICityDB>(ret, ['_id', '__v'])
    },
    _id: false
  }
)

CitiesSchema.index({ city: 1, country: 1 }, { unique: true })

const CitiesModel = model<ICityDB>('cities', CitiesSchema)

export default CitiesModel
