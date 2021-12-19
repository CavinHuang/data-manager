/**
 * loading service
 */
import { ElLoading, ILoadingOptions } from 'element-plus'

export function useLoading(message = '加载中...', duration: number = 0, option: ILoadingOptions = {}) {
  const loading = ElLoading.service({
    lock: true,
    text: message,
    background: 'rgba(0, 0, 0, 0.7)'
  })

  if (duration) {
    setTimeout(() => {
      loading.close()
    }, duration * 1000)
  }
  return {
    loading
  }
}
