import { ILoginData, IUserData } from '../../models'

export type PromiseResult = 'OK' | string

export interface IBodyValidation {
  toLogin({ email, password }: ILoginData): Promise<PromiseResult>
  toRegister({ email, password }: IUserData): Promise<PromiseResult>
}
