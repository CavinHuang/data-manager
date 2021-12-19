import { CustomerAxiosOptionsInterface } from './../../types/axios';
/**
 * 封装axios 请求拦截和响应拦截
 */
import Axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosPromise } from 'axios'
import { AxiosRequestConfigInterface, PendingType } from '@/types/axios'
import { ElMessage, ILoadingInstance } from 'element-plus'
import Config from '@/config/axios'
import { responseStatusError } from './axiosErrorHandler'
import { ApiResponseResultType } from '../types/response'
import { store } from '@/utils'
import { TOKEN_NAME } from '@/config/consts'
import { useLoading } from '@/composables/useLoading'

// 取消重复请求
const pending: Array<PendingType> = []
const CancelToken = Axios.CancelToken
const RETRY_DELAY = 1000
let RETRY_COUNT = 0

let loading: ILoadingInstance

// 移除重复请求
const removePending = (config: AxiosRequestConfigInterface) => {
  for (const key in pending) {
    const item: number = +key
    const list: PendingType = pending[key]
    // 当前请求在数组中存在时执行函数体 判断条件是所有的参数、方法、地址都一样，如果加了随机参数，此处无作用
    if (list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      list.cancel('操作太频繁，请稍后再试')
      // 从数组中移除记录
      pending.splice(item, 1)
    }
  }
}

/**
 * axios 请求拦截
 * @param axiosRequestConfig
 */
const axiosRequestInterceptor = (axiosRequestConfig: AxiosRequestConfigInterface): AxiosRequestConfigInterface => {
  // 此处可以添加全局的loading
  // Toast.loading({
  //   duration: 0, // 持续展示 toast
  //   forbidClick: true,
  //   message: '加载中...'
  // })
  if (axiosRequestConfig.loading !== false) {
    const { loading: loadingService } = useLoading()
    loading = loadingService
  }

  removePending(axiosRequestConfig)
  axiosRequestConfig.cancelToken = new CancelToken((c) => {
    pending.push({ url: axiosRequestConfig.url, method: axiosRequestConfig.method, params: axiosRequestConfig.params, data: axiosRequestConfig.data, cancel: c })
  })

  const token: string = store.get(TOKEN_NAME) || ''

  // 携带登录信息
  if (token) {
    axiosRequestConfig.headers[TOKEN_NAME] = token
  }

  axiosRequestConfig.headers.sourceType = Config.sourceType

  return axiosRequestConfig
}

/**
 * axios 响应拦截
 * @param axiosResponse
 */
const axiosResponseInterceptor = (axiosResponse: AxiosResponse<ApiResponseResultType>): (AxiosResponse | Promise<AxiosResponse>) => {
  return new Promise((resolve, reject) => {
    // 清除全局提示
    // Toast.clear()

    const { data, config } = axiosResponse
    const code = data.code
    const requestConfig: AxiosRequestConfigInterface = config as AxiosRequestConfigInterface

    // 移除等待的请求
    removePending(requestConfig)

    // if (requestConfig.showMessage) Toast.success(data.message)
    // 状态码验证
    if (!data || code === undefined) {
      // TODO 业务范围异常状态处理
      // requestConfig.showMessage && Toast.success(data.message)
      reject(axiosResponse)
      return false
    }

    // 异常错误码处理 2: 非法token  3: token过期  4: refreshToken失效
    // 处理异常情况
    if (+code !== 200) {
      ElMessage.error({
        message: data.msg,
        type: 'error',
      })
    }

    // 更新TOKEN
    // if (axiosResponse.headers && axiosResponse.headers[TOKEN_NAME]) {
    //   Cookies.set(TOKEN_NAME, axiosResponse.headers[TOKEN_NAME])
    // }
    //  ElMessage.success({
    //     message: data.msg,
    //     type: 'success',
    //   })
    loading.close()
    // 重试次数
    RETRY_COUNT = 0
    // 返回数据
    return resolve(data.data)
  })
}

/**
 * axios response错误处理
 * @param error
 * @param axiosInstance
 */
const axiosResponseErrorHandler = async function axiosResponseErrorHandler(error: AxiosError, axiosInstance: AxiosInstance): (Promise<AxiosResponse | AxiosError>) {
  // Toast.clear()
  const response = error.response
  // 超时重新请求
  const config: AxiosRequestConfigInterface = error.config as AxiosRequestConfigInterface
  // 全局的请求次数,请求的间隙
  // const [RETRY_COUNT, RETRY_DELAY] = [5, 1000]

  if (error) {
    // 检查是否已经把重试的总数用完
    if (RETRY_COUNT <= 0) {
      // return Promise.reject(response || { message: error.message })
      return responseStatusError(error)
    }
    // 增加重试计数
    RETRY_COUNT--
    // 创造新的Promise来处理指数后退
    const backoff = (): Promise<AxiosResponse | boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, RETRY_DELAY || 1)
      })
    }
    // instance重试请求的Promise
    return backoff().then((): AxiosPromise => {
      return axiosInstance(config)
    });
  }

  // 根据返回的http状态码做不同的处理
  return responseStatusError(error)
}

/**
 * axios 请求和响应拦截
 * @param AxiosInstance
 */
export const axiosInterceptor = (AxiosInstance: AxiosInstance): AxiosInstance => {
  // http request 拦截器
  AxiosInstance.interceptors.request.use(config => {
    const conf: AxiosRequestConfigInterface = config as AxiosRequestConfigInterface
    return axiosRequestInterceptor(conf)
  }, error => {
    // TODO 此处需要对错误返回统一处理
    return Promise.reject(error)
  })

  // 添加响应拦截器
  AxiosInstance.interceptors.response.use(axiosResponseInterceptor, error => axiosResponseErrorHandler(error, AxiosInstance))
  return AxiosInstance
}
