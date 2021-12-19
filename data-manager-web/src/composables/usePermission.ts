/**
 * 权限控制
 */
import { RouteLocationNormalized, Router } from 'vue-router'
import { useUser } from '@/composables/useUser'

export function useRouterPermission(router: Router, to: RouteLocationNormalized, from: RouteLocationNormalized) {
  const meta = to.meta
  const loginPermission = useLoginPermission(router, to)
  return {
    loginPermission
  }
}

export function useLoginPermission(router: Router, route: RouteLocationNormalized) {
  const meta = route.meta
  if (meta.noLogin) return true
  const { isLogin } = useUser(router)

  return isLogin.value
}
