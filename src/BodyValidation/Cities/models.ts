import { ICity } from '../../models'

export type PromiseResult = 'OK' | string

export interface IBodyValidation {
  toCreate(body: ICity): Promise<PromiseResult>
}
