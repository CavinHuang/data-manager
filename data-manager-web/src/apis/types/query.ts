/**
 * query type
 */

/**
 * query row
 */
export type TQueryItem = {
  createtime: number
  description: string
  excel_fields: string
  excel_fields_config: string
  id: number
  is_deleted: number
  limit_number: number
  result_tips: string
  source_id: number
  status: number
  title: string
  updatetime: number
  user_id: number
}

export type TQueryConfig = {
  field: string
  title: string
  value: string
  show: boolean
  label: string
}
