import { Request, Response } from 'express'

module.exports = (req: Request, res: Response) =>
  res
    .status(404)
    .send(
      `Endpoint ${req.url} does not exist or you aren't using the right method`
    )
