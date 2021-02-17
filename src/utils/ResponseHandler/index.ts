import { Response } from 'express'
import { IResponseHandler } from './models'

const ResponseHandler = (): IResponseHandler => {
  const _errorHandler = (res: Response, error: Error) => {
    // if validation error return error message
    if (error.name === 'ValidationError')
      return responses.fail.badRequest(res, error.message)
    else {
      // else treat it as internal error
      console.error(error)
      return responses.fail.internalError(res)
    }
  }

  const _success = (res: Response, body?: any) =>
    res.status(200).send(body ?? 'OK')

  const _created = (res: Response, body?: any) =>
    res.status(201).send(body ?? 'Created element/s')

  const _badRequest = (res: Response, body?: any) =>
    res.status(400).send(body ?? 'Bad request')

  const _unauthorized = (res: Response, body?: any) =>
    res.status(401).send(body ?? 'Unauthorized')

  const _notfound = (res: Response, body?: any) =>
    res.status(404).send(body ?? 'Not found')

  const _internalError = (res: Response, body?: any) =>
    res.status(500).send(body ?? 'Internal server error')

  const responses: IResponseHandler = {
    fail: {
      handle: _errorHandler,
      internalError: _internalError,
      notfound: _notfound,
      badRequest: _badRequest,
      unauthorized: _unauthorized
    },
    success: {
      done: _success,
      created: _created
    }
  }

  return responses
}

export default ResponseHandler
