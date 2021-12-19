/**
 * 问卷相关的接口
 */
import { get, post } from '../request';
import { TCreateQuestionItemRes, TCreateParams, TQuestion } from './../types/question';
import { TPageResult, TPageParams } from '../types/common';
import { TSortParams, TQuestionItem } from './../types/question';
/**
 * 创建收集问卷
 * @param data
 * @returns
 */
export function createQuestionService(data: TCreateParams) {
  return post<TQuestion>('/question/create', data)
}

/**
 * 获取单个项目信息
 * @param key
 * @returns
 */
export function getQuestion(key: string) {
  return get<TQuestion>('/question/getQuestion', { key });
}

/**
 * 发布
 * @param key
 * @returns
 */
export function publish (key: string) {
  return get<TQuestion>('/question/publish', { key })
}

/**
 * 发布
 * @param key
 * @returns
 */
export function stopPublish (key: string) {
  return get<TQuestion>('/question/stop_publish', { key })
}


/**
 * 获取单个项目信息
 * @param key
 * @returns
 */
export function getQuestionDetail (key: string) {
  return get<TQuestion>('/question/detail', { key })
}


/**
 * 添加单项
 * @param data
 * @returns
 */
export function createQuestionItem(data: any) {
  return post<TCreateQuestionItemRes>('/question/create_item', data)
}

/**
 * 获取最大的formId
 * @param key
 * @returns
 */
export function getMaxFormItemId(key: string) {
  return get<number>('/question/max_form_id', { key })
}

/**
 * 更新
 * @param data
 * @returns
 */
export function updateItem(data: any) {
  return post('/question/update_item', data)
}

/**
 * 删除项
 * @param ids
 * @returns
 */
export function deleteQuestionItem(ids: string[]) {
  return post<boolean>('/question/delete_item', { ids })
}

/**
 * 排序
 * @param data
 * @returns
 */
export function sortItem(data: TSortParams) {
  return post<TCreateQuestionItemRes>('/question/sort', data)
}

/**
 * 获取所有的表单项
 * @param projectKey
 * @param displayType
 * @returns
 */
export function itemLists(projectKey: string, displayType = false) {
  return get<TQuestionItem[]>('/question/item_lists', { projectKey, displayType })
}


/**
 * 信息列表
 * @param data
 * @returns
 */
export function questionList(data: TPageParams) {
  return get<TPageResult<TQuestion>>('/question/lists', data)
}

/**
 * 保存结果
 * @param data
 * @returns
 */
export function saveResult(data: any) {
  return post<boolean>('/question/result_create', data)
}

export function resultList(data: any) {
  return post('/question/result_list', data)
}
