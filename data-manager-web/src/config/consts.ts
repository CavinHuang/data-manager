/**
 * 常量定义
 * @author liwenkai <liwankai@cmhk.com> 2021/03/22
 * @version 1.0.0
*/
import env from './env'

// 接口请求baseURL
export const BASE_URL = env.apiHost!

// token名称
export const TOKEN_NAME = {
  dev: 'Authorization',
  sit: 'Authorization',
  uat: 'Authorization',
  prod: 'Authorization'
}[env.env!]

// UIS 登录地址
export const VUE_APP_UIS_HOST = env.uisLoginUrl!

// UIS系统指定的应用code
export const VUE_APP_UIS_MODULE_CODE = env.uisModuleCode!

export const CURRENT_URI = 'current_uri'

export const USER_INFO = 'user_info'
