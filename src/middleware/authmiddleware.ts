import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import UserSchema from '../schema/users.model'
import { getReqToken } from '../utils'
import ResponseHandler from '../utils/ResponseHandler'
import { IUserDB } from '../models'

const response = ResponseHandler()

module.exports = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.SIGNKEY) throw Error('SIGNKEY secret not found')
    const authToken: string | null = getReqToken(req)
    if (!authToken) return response.fail.unauthorized(res, 'Missing token')
    jwt.verify(
      authToken,
      process.env.SIGNKEY,
      async (err: VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
          console.error(err)
          return response.fail.unauthorized
        }
        console.log(decoded)
        const user: IUserDB | null = await UserSchema.findOne({
          email: (decoded as IUserDB).email
        })
        console.log(user)
        if (!user) return response.fail.unauthorized(res)
        console.log(user)
        res.locals.user = user.email
        next()
      }
    )
  } catch (err) {
    console.error(err)
    return response.fail.internalError(res)
  }
}
