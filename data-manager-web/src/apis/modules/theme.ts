import { get, post } from '../request';
import { TListParams, ThemeType, SaveThemeParam, ThemeItem } from './../types/theme';
/**
 * theme config
 */

/**
 * 列表
 * @param data
 * @returns
 */
export function themeLists(data: TListParams) {
  return get<ThemeType[]>('/theme/lists', data)
}

/**
 * 保存主题
 * @param data
 * @returns
 */
export function saveTheme(data: SaveThemeParam) {
  return post<boolean>('/theme/save', data)
}

/**
 * 获取单个theme
 * @param key
 * @returns
 */
export function themeDetail(key: string) {
  return get<ThemeItem>('/theme/detail', { key })
}
