import { Document } from 'mongoose'

export interface IKey {
  pk: string
}

export interface IWeather {
  date: Date
  weather: WEATHERTYPE
  hourlyTemps: Array<number>
}

export interface IWeatherQuery extends IKey {
  date: string
}

export interface ICity {
  city: string
  country: string
}

export enum WEATHERTYPE {
  SUNNY = 'Sun',
  CLOUDY = 'Clouds',
  RAINY = 'Rain',
  STORMY = 'Storm'
}

export interface ILoginData {
  email: string
  password: string
}

export interface IUserData extends ILoginData {
  name: string
  birthdate?: Date
}

export interface ICityDto extends IKey, ICity {}

export interface ICityDB extends Document, ICityDto {}

export interface IWeatherDto extends IKey, IWeather {}

export interface IWeatherDB extends Document, IWeatherDto {}

export interface IUserDB extends Document, IUserData {}
