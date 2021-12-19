/**
 * api写法demo
 * @author liwenkai <liwankai@cmhk.com> 2021/03/22
 * @version 1.0.0
*/
import { ApiResponseResultType } from '@/apis/types/response'
import { CustomerAxiosOptionsInterface } from '@/types/axios'
import { AxiosResponse } from 'axios'
import { get, post, upload, request } from '../request'
import { GetDemo, PostDemo, requestDemo, GoodsListType } from '../types/test'

/**
   * get demo 注意此处options是可选参数，通常我们是不用的，只有需要特殊混入axios options时才需要
   * @param params
   * @param options
  * @returns {Promise<AxiosResponse>}
   */
export const getTest = (params: GetDemo, options: CustomerAxiosOptionsInterface): Promise<AxiosResponse> => {
  return get('/api/xxxx', params, options)
}
/**
   * get demo 注意此处options是可选参数，通常我们是不用的，只有需要特殊混入axios options时才需要
   * @param data
   * @param options
   * @returns {Promise<AxiosResponse>}
   */
export const postTest = (data: PostDemo, options: CustomerAxiosOptionsInterface): Promise<AxiosResponse> => {
  return post('/api/xxxx', data, options)
}
/**
   * 上传demo 注意此处options是可选参数，通常我们是不用的，只有需要特殊混入axios options时才需要
   * @param file {File} 需要上传的file
   * @param options
   * @returns {Promise<AxiosResponse>}
   */
export const Upload = (file: File, options: CustomerAxiosOptionsInterface): Promise<AxiosResponse> => {
  // 构建formdata
  const form = new FormData()
  form.append('file', file)
  const axiosRequestConfig = {
    data: form
  }
  return upload('/api/xxxxx', axiosRequestConfig, options)
}
/**
   * request 使用demo 注意此处options是可选参数，通常我们是不用的，只有需要特殊混入axios options时才需要
   * @param {requestDemo} data
   * @param {CustomerAxiosOptionsInterface} options
   * @returns {Promise<AxiosResponse>}
   */
export const demoRequest = (data: requestDemo, options: CustomerAxiosOptionsInterface): Promise<AxiosResponse> => {
  return request({
    url: '/api/xxxx',
    method: 'PUT',
    data,
    baseUrl: 'http://localhost:9000/cmsk'
  }, options)
}

// =============================== 用于伪造首页数据  =======================================================
export const getGoodsList = () => {
  return new Promise<ApiResponseResultType<GoodsListType[]>>(resolve => {
    // =============================== 伪造测试数据  =======================================================
    const goodsListData = []
    const tags = ['包邮', '特价', '七天无理由退换', '优选']
    function randomTags(arr: any, count: number) {
      const shuffled = arr.slice(0)
      let i = arr.length
      const min = i - count
      let temp
      let index
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    }
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
    for (let i = 0; i < 10; i++) {
      goodsListData.push({
        title: '第' + i + '个商品',
        desc: '第' + i + '个商品的描述信息',
        tags: randomTags(tags, random(0, tags.length - 1)),
        num: random(1, i + 1),
        price: random(1, i + 1)
      })
    }
    // =============================== 伪造测试数据  =======================================================
    resolve({
      code: 0,
      message: '查询成功',
      data: goodsListData
    })
  })
}
interface resType {
  currentPage: number
  pageSize: number
  list: Array<any>
  total: number
}
export const activeList = (data: any) => {
  return post<resType>('/activity/pageList', data)
}
