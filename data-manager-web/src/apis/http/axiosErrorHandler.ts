import { AxiosError } from 'axios'
// import { Toast } from 'vant'

// http 错误
interface CodeMessageInterface {
  message: string;
  handler?: any;
}

/**
 * http 状态码
 */
interface HttpCodeInterface {
  [propName: number]: CodeMessageInterface;
}

/**
 * 定义http 状态码错误信息
 */
export const httpCodeError: HttpCodeInterface = {
  400: {
    message: '请求错误'
  },
  401: {
    message: '未授权，请登录',
    handler: function() {
      // Toast.fail(this.message)
    }
  },
  403: {
    message: '拒绝访问'
  },
  404: {
    message: `请求地址出错`
  },
  405: {
    message: '请求方法不被允许'
  },
  408: {
    message: '请求超时'
  },
  500: {
    message: '服务器内部错误'
  },
  501: {
    message: '服务未实现'
  },
  502: {
    message: '网关错误'
  },
  503: {
    message: '服务不可用'
  },
  504: {
    message: '网关超时'
  },
  505: {
    message: 'HTTP版本不受支持'
  }
}

/**
 * 处理 http status 错误
 * @param error
 */
export const responseStatusError = function(error: AxiosError): Promise<AxiosError> {
  if (error && error.response) {
    const response = error.response
    const { status } = response
    const codeItem: CodeMessageInterface = httpCodeError[status]
    console.log(error)
    if (codeItem) {
      error.message = codeItem.message
      codeItem.handler && codeItem.handler()
    } else {
      error.message = '未知错误'
    }
  } else {
    error.message = error.message === 'Network Error' ? '网络错误' : error.message
  }
  // TODO 统一处理其他错误
  // Toast.fail(error.message)
  return Promise.reject(error)
}
