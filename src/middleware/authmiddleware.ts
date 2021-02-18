import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import UserSchema from '../schema/users.model'
import { getReqToken } from '../utils'
import ResponseHandler from '../utils/ResponseHandler'
import { IUserDB } from '../models'

const response = ResponseHandler()

module.exports = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.SIGNKEY) throw Error('No es troba el secret SIGNKEY')
    const authToken: string | null = getReqToken(req)
    if (!authToken) return res.status(400).send('Falta el Bearer Token')
    jwt.verify(
      authToken,
      process.env.SIGNKEY,
      async (err: VerifyErrors | null, decoded: object | undefined) => {
        if (err) {
          console.error(err)
          return res.status(401).send('Token no verificat')
        }
        const user: IUserDB | null = await UserSchema.findById(
          (decoded as IUserDB)._id
        )
        if (!user) return res.status(401).send('Usuari no autoritzat')
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
