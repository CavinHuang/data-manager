/*
 * 环境运行时配置
 * @Author: cavinhuang
 * @Date: 2021-08-27 09:33:52
 * @LastEditTime: 2021-08-27 09:35:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ias-h5\src\config\env.ts
 */

type TEnvType = 'prod' | 'sit' | 'dev'

const currentEnv: TEnvType = (window as any).env as TEnvType || 'dev'

export interface IEnvConfig {
  env?: TEnvType
  apiHost?: string
  tokenName?: string
  uisLoginUrl?: string
  uisModuleCode?: string
  tfJumpUrl?: string
}

export interface IEnv {
  dev: IEnvConfig,
  sit: IEnvConfig,
  prod: IEnvConfig
}

// api 地址切换
const getApiHost = () => currentEnv === 'dev' ? 'http://data.local.com/api' : (currentEnv === 'sit' ? 'https://cmsk-ias-sit.saas.cmsk1979.com' : '/')

const common: IEnvConfig = {
  env: currentEnv,
  apiHost: getApiHost(),
  tokenName: 'Authorization'
}

const config: IEnv = {
  dev: {
    uisLoginUrl: 'https://uis-sit.cmsk1979.com/login.html',
    uisModuleCode: 'CMSK_IAS_DEV_H5',
    tfJumpUrl: 'https://idss-sit.saas.cmsk1979.com'
  },
  sit: {
    uisLoginUrl: 'https://uis-sit.cmsk1979.com/login.html',
    uisModuleCode: 'CMSK_IAS',
    tfJumpUrl: 'https://idss-sit.saas.cmsk1979.com'
  },
  prod: {
    uisLoginUrl: 'https://uis.cmsk1979.com/login.html',
    uisModuleCode: 'CMSK_IAS',
    tfJumpUrl: 'https://idss.saas.cmsk1979.com'
  }
}

export default Object.assign(common, config[currentEnv]) as IEnvConfig
