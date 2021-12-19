/**
 * theme type
 */

export type TListParams = {
  color: string
  style: string
}

export type ThemeType = {
  createTime: number
  updateTime: number
  id: number
  name: string
  style: string[]
  headImgUrl: string
  btnsColor: string
  color: string[]
}


export type SaveThemeParam = {
  backgroundColor: string
  backgroundImg: string
  logoImg: string
  logoPosition: string
  projectKey: string
  showDescribe: boolean
  showNumber: boolean
  showTitle: boolean
  submitBtnText: string
  themeId: number
}

export type ThemeItem = SaveThemeParam & { id: number }
