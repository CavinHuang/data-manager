import { Setting } from './../types/setting';
import { get, post } from '../request';
import { TListParams } from './../types/theme';
/**
 * theme config
 */

/**
 * 列表
 * @param data
 * @returns
 */
export function settingDetail(key: string) {
  return get<Setting>('/setting/detail', { key })
}

/**
 * 列表
 * @param data
 * @returns
 */
export function saveSetting (data: Setting) {
  return post<boolean>('/setting/save_setting', data)
}
