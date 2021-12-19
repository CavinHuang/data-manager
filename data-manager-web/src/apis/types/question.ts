/**
 * 问卷类型
 */

/**
 * 问卷
 */
export type TQuestion = {
  id: number
  key: string
  name: string
  describe: string
  is_deleted: number
  items: TQuestionItem[]
  status: number
  user_id: number
  createTime: string
  updateTime: string
  theme?: any
}

/**
 * 单项
 */
export type TQuestionItem = {
  id: number
  questionKey: string
  formItemId: number
  type: string
  label: string
  isDisplayType: string
  showLabel: string
  defaultValue: string
  required: boolean
  placeholder: string
  sort: number
  span: number
  expand: string
  regList: string
}

export type TCreateQuestionItemRes = {
  sort: number
  itemDataId: number
  operateSuccess: boolean
}

/**
 * 创建参数
 */
export type TCreateParams = Pick<TQuestion, 'name' | 'describe'>

export type TSortParams = {
  afterPosition: number
  beforePosition: number
  formItemId: number
  projectKey: string
}
