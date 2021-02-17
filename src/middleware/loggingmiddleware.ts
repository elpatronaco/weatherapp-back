import { Request, Response, NextFunction } from 'express'

module.exports = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Request received from ${req.ip} to endpoint ${req.url}`)
  next()
}
