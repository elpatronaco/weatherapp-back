import express from 'express'
import UserSchema from '../schema/users.model'
import bcrypt from 'bcrypt'
import querystring from 'querystring'
import { ILoginData, IUserData, IUserDB } from '../models'
import ResponseHandler from '../utils/ResponseHandler'
import UserValidation from '../BodyValidation/Auth'
import { createToken } from '../utils'

const router = express.Router()
const response = ResponseHandler()
const validation = UserValidation()

router
  /**
   * Autoritza a un usuari
   * @method GET/auth/login
   *
   * @param {string} email - PK del usuari
   * @param {string} password - Contrasenya del usuari
   * @return {string} Bearer token de validació
   *
   */
  .post('/login', async (req: express.Request, res: express.Response) => {
    try {
      const loginData: ILoginData = req.body

      await validation.toLogin({ ...loginData })

      const user: IUserDB | null = await UserSchema.findOne({
        email: loginData.email
      })

      if (!user) return response.fail.unauthorized(res, "L'usuari no existeix")

      const arePasswordsSame: boolean = await bcrypt.compare(
        loginData.password,
        user.password
      )

      if (!arePasswordsSame)
        return response.fail.unauthorized(res, 'Password is wrong')

      return response.success.done(res, `Bearer ${createToken(user)}`)
    } catch (error) {
      return response.fail.handle(res, error)
    }
  })
  /**
   * Registra un usuari
   * @method GET/auth/register
   *
   * @param {string} email - PK del usuari
   * @param {string} password - Contrasenya del usuari
   * @param {string} name - Nom del usuari
   * @return {string} Bearer token de validació
   *
   */
  .post('/register', async (req: express.Request, res: express.Response) => {
    try {
      await validation.toRegister(req.body)

      const body: IUserData = req.body

      const user: IUserDB | null = await UserSchema.findOne({
        email: body.email
      })

      if (user) return res.status(401).send('El usuari ja existeix')

      const saltRounds: number = process.env.SALT_ROUNDS
        ? parseInt(process.env.SALT_ROUNDS)
        : 12
      const encryptedPass = await bcrypt.hash(body.password, saltRounds)
      const registeredUser = await UserSchema.create({
        ...body,
        password: encryptedPass
      })

      return res.status(200).send(`Bearer ${createToken(registeredUser)}`)
    } catch (error) {
      return response.fail.handle(res, error)
    }
  })
  .get('/', async (req: express.Request, res: express.Response) => {
    try {
      const LIMIT = req.query.limit ? parseInt(req.query.limit.toString()) : 10
      const LASTKEY = req.query.lastkey
        ? req.query.lastkey.toString()
        : undefined
      const DOCS = await UserSchema.find(
        LASTKEY ? { _id: { $gt: LASTKEY } } : {}
      )
        .sort({ _id: 'asc' })
        .limit(LIMIT)
      const COUNT = await UserSchema.countDocuments()
      const PREVIOUS = LASTKEY
        ? `${req.hostname}${req.baseUrl}/?${querystring.stringify({
            limit: LIMIT
          })}`
        : undefined
      let lastCode = DOCS[DOCS.length - 1].id
      const NEXTDOCS = await UserSchema.find({ _id: { $gt: lastCode } })
        .sort({ _id: 'asc' })
        .limit(LIMIT)
      const NEXT =
        DOCS && DOCS.length > 0 && NEXTDOCS && NEXTDOCS.length > 0
          ? `${req.hostname}${req.baseUrl}/?${querystring.stringify({
              limit: LIMIT,
              lastkey: lastCode
            })}`
          : undefined
      res.status(200).send({
        pages: Math.ceil(COUNT / LIMIT),
        limit: LIMIT,
        previous: PREVIOUS,
        next: NEXT,
        results: DOCS.map(doc => doc.toJSON())
      })
    } catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  })

module.exports = router
