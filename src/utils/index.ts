import { Request } from 'express'
import { IUserDB } from '../models'
import jwt from 'jsonwebtoken'

export const cleanObj = <T>(obj: T, keys: keyof T | Array<keyof T>) => {
  if (typeof keys === 'string') {
    if (obj[keys]) delete obj[keys]
  } else if (Array.isArray(keys)) {
    keys.forEach(key => {
      if (obj[key]) delete obj[key]
    })
  }
}

export const getDate = (date: string): Date =>
  new Date(new Date(date.toString()).toISOString().split('T', 1)[0])

export const addDays = (date: Date, amount: number): Date => {
  var tzOff = date.getTimezoneOffset() * 60 * 1000,
    t = date.getTime(),
    d = new Date(),
    tzOff2

  t += 1000 * 60 * 60 * 24 * amount
  d.setTime(t)

  tzOff2 = d.getTimezoneOffset() * 60 * 1000
  if (tzOff != tzOff2) {
    var diff = tzOff2 - tzOff
    t += diff
    d.setTime(t)
  }

  return d
}

export const getReqToken = (req: Request): string | null => {
  if (!req.headers.authorization) return null
  const token = req.headers.authorization.split(' ')
  return token &&
    token.length === 2 &&
    (token[0].includes('Bearer') || token[0].includes('Token'))
    ? token[1]
    : null
}

export const createToken = (val: IUserDB | string): string | Error => {
  if (!process.env.SIGNKEY) return Error('No signkey secret found')
  return jwt.sign(
    typeof val === 'string' ? val : val.toJSON(),
    process.env.SIGNKEY,
    {
      expiresIn: '8h'
    }
  )
}
