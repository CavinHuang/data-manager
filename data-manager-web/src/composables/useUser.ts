/**
 * 用户信息钩子
 */
import { computed } from 'vue'
import { TUserInfo } from "@/apis/types/user"
import { store } from "@/utils"
import { toRefs } from "vue"
import { USER_INFO } from './../config/consts'
import { Router, useRouter } from 'vue-router'

export function useUser (router?: Router) {
  const user = store.get(USER_INFO) as TUserInfo | null
  const isLogin = computed(() => Boolean(user))
  const routerInstance = router ? router : useRouter()
  const logOut = () => {
    store.remove(USER_INFO);
    routerInstance.push({
      path: '/account/login'
    })
  }
  return {
    user,
    isLogin,
    logOut
  }
}
