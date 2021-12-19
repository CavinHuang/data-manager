/**
 * 通用类型
 */

/**
 * 分页返回
 */
export type TPageResult<T = any> = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  data: T[]
}

export type TPageParams = {
  page?: number
  page_size?: number
}
