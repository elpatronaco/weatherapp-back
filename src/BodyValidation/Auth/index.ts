import Joi from 'joi'
import { ILoginData, IUserData } from '../../models'
import { IBodyValidation, PromiseResult } from './models'

const UserValidation = (): IBodyValidation => {
  const UserValidator = {
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(8),
    name: Joi.string(),
    birthdate: Joi.date()
  }

  return {
    toLogin: (body: ILoginData) =>
      new Promise<PromiseResult>(async (resolve, reject) => {
        try {
          await Joi.object({
            email: UserValidator.email.required(),
            password: UserValidator.password.required()
          }).validateAsync(body)

          resolve('OK')
        } catch (err) {
          reject(err)
        }
      }),
    toRegister: (body: IUserData) =>
      new Promise<PromiseResult>(async (resolve, reject) => {
        try {
          await Joi.object({
            email: UserValidator.email.required(),
            password: UserValidator.password.required(),
            name: UserValidator.name.required(),
            birthdate: UserValidator.birthdate.required()
          }).validateAsync(body)

          resolve('OK')
        } catch (err) {
          reject(err)
        }
      })
  }
}

export default UserValidation
