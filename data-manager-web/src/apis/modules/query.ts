/*
 * @Author: your name
 * @Date: 2021-09-12 16:16:30
 * @LastEditTime: 2021-12-19 11:16:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\apis\modules\query.ts
 */
/**
 * 查询模块相关功能
 */

import { get, post } from '../request'
import { TPageParams, TPageResult } from '../types/common'
import { TQueryItem, TQueryConfig as TBaseQueryConfig } from '../types/query'
import { CustomerAxiosOptionsInterface } from './../../types/axios'

export const submit = (params: any, options?: CustomerAxiosOptionsInterface) => {
  return post('/query/create', params, options)
}

export const queryLists = (params: TPageParams) => {
  return get<TPageResult<TQueryItem>>('/query/lists', params)
}

export const update = (id: number, updateData: Partial<TQueryItem>) => {
  return post('/query/update', { query_id: id, ...updateData })
}

export const getQuery = (data:{ id?: number, key?: string }) => {
  return get<TQueryItem>('/query/get', data)
}

export const getResult = (params: { config: TBaseQueryConfig[], query_id: number}) => {
  return post('/query/getResult', params)
}

export const deleteRow = (id: number) => {
  return get('/query/delete_row', { id })
}
