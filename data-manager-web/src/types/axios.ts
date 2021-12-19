/**
 * axios 接口
 */

import { AxiosRequestConfig } from 'axios'

/**
 * 定义可以使用的请求方法
 */
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * 定义允许返回的response类型
 */
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

/**
 * 定义请求参数接口
 */
export interface RequestInterface {
  baseUrl?: string;
  url?: string;
  data?: any;
  params?: any;
  method?: Method;
  headers?: any;
  timeout?: number;
  responseType?: ResponseType;
}

/**
 * 定义返回内容接口
 */
export interface ResponseInterface {
  data?: any;
  headers: any;
  request?: any;
  status: number;
  statusText: string;
  config: RequestInterface;
}

/**
 * 定义待取消的请求接口
 */
export interface PendingType {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  cancel: (text: string) => void;
}

/**
 * 自定义axios请求接口
 */
export interface CustomerAxiosOptionsInterface {
  showMessage?: boolean;
  loading?: boolean
  RETRY_COUNT?: number; // 用于重新请求的次数统计，不参与业务
  RETRY_DELAY?: number; // 请求错误时重新发起请求的时间间隔
  contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'; // 手动定义header的content-type
}

/**
 * 合并axios请求接口
 */
export interface AxiosRequestConfigInterface extends AxiosRequestConfig, CustomerAxiosOptionsInterface {
  method?: Method; // 重写method，只支持自定义的方法
  responseType?: ResponseType; // 自定义response type
}
