/**
 * 文件操作
 */
import { get, upload as uploadApi } from '../request'
import { TFileInfo } from './../types/file';

export const upload = (file: File, name = 'file') => {
  const form = new FormData()
  if (Array.isArray(file)) {
    file.forEach((file: File, index) => {
      form.append(name + index, file)
    })
  } else {
    form.append(name, file)
  }
  return uploadApi<TFileInfo>('/file/upload', { data: form })
}

export const getExcelInfo = (attach_id: number) => {
  return get<{ fields: Array<{ field: string, label: string }> }>('/excel/excuseFields', { attach_id })
}
