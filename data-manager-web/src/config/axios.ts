/**
 * axios 配置文件
 * @version 1.0.0
*/
import { BASE_URL } from './consts'

export default {
  baseURL: BASE_URL, // Api Host,
  url: '',
  data: {},
  method: 'POST',
  responseType: 'json', // 响应数据类型
  withCredentials: true, // 携带cookie
  timeout: 1000 * 60 * 5, // 超时时间
  sourceType: 'web' // 用来标记请求应用， 自定义
}
