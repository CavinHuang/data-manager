import loadScript from '@/utils/loadScript'
import { ElLoading } from 'element-plus'

let tinymceObj: any

export default function loadTinymce (cb: any) {
  if (tinymceObj) {
    cb(tinymceObj)
    return
  }

  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '富文本资源加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })

  loadScript('//lib.baomitu.com/tinymce/5.8.2/tinymce.min.js', () => {
    loading.close()
    // eslint-disable-next-line no-undef
    // @ts-ignore
    tinymceObj = tinymce as any
    cb(tinymceObj)
  })
}
