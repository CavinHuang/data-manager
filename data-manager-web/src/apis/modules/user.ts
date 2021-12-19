/**
 * 用户相关的接口
 */
import { post } from '../request'
import { TRegisterParams, TLoginRes } from '../types/user'

/**
 * 登录
 * @param params
 * @returns
 */
export const regsiter = (params: TRegisterParams) => {
  return post('/user/registerWithNoCode', params)
}

/**
 * 登录
 * @param params
 * @returns
 */
export const login = (params: { phone: string, password: string }) => {
  return post<TLoginRes>('/user/login', params)
}
