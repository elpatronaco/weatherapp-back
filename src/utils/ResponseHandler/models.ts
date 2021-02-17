import { Response } from 'express'

export interface IResponseHandler {
  fail: {
    handle(res: Response, error: any): any
    internalError(res: Response, body?: any): Response<any, Record<string, any>>
    notfound(res: Response, body?: any): any
    badRequest: (res: Response, body?: any) => any
    unauthorized: (res: Response, body?: any) => any
  }
  success: {
    done: (res: Response, body?: any) => any
    created: (res: Response, body?: any) => any
  }
}
