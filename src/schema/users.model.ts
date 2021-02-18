import { model, Schema } from 'mongoose'
import Joi from 'joi'
import { IUserDB } from '../models'
import { cleanObj } from '../utils'

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    password: { type: String, minlength: 8, required: true },
    name: { type: String, required: true },
    birthdate: { type: Date, required: false }
  },
  {
    toJSON: {
      transform: (doc, ret) =>
        cleanObj<IUserDB>(ret, ['_id', 'password', '__v'])
    }
  }
)

export default model<IUserDB>('users', UserSchema)
