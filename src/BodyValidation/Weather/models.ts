import { ICity, IWeather, IWeatherQuery } from '../../models'

export type PromiseResult = 'OK' | string

export interface IBodyValidation {
  toCreate(body: IWeather): Promise<PromiseResult>
  toQuery(query: IWeatherQuery): Promise<PromiseResult>
}
