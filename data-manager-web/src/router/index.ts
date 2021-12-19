/*
 * @Author: your name
 * @Date: 2021-09-05 15:10:38
 * @LastEditTime: 2021-09-14 23:10:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\router\index.ts
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layout/default'
import NProgress from '@/utils/nprogress' // progress bar
import { useRouterPermission } from '@/composables/usePermission'
// import { isLogin } from '@utils/login'
// import Cookie from 'js-cookie'
// import consts from '@config/const'

NProgress.configure({ showSpinner: false })

/**
 * 读取./modules下的所有js文件并注册模块
 */
const requireModule = require.context('./modules', false, /\.js|\.ts$/)
const modules: any = []
requireModule.keys().forEach(fileName => {
  modules.push(...requireModule(fileName).default)
})

/**
 * 菜单顺序排序，优先sort排序，未设置则按路由模块名ASCII码排序
 * 规则：
 *  若 a 小于 b，在排序后的数组中 a 应该出现在 b 之前，则返回一个小于 0 的值。
 *  若 a 等于 b，则返回 0。
 *  若 a 大于 b，则返回一个大于 0 的值。
 */
modules.sort((val1: any, val2: any) => {
  const a = val1.sort || val1.path.charCodeAt()
  const b = val2.sort || val1.path.charCodeAt()
  return a - b
})

const keppAliveRoutesName:string[] = []
for (let i = 0; i < modules.length; i++) {
  const children = modules[i].children || []

  for (let j = 0; j < children.length; j++) {
    if (children[j].meta.keepAlive) {
      keppAliveRoutesName.push(children[j].name || '__default' + i + j)
    }
  }
}
export {
  keppAliveRoutesName
}
const routes = [
  { path: '/', component: Layout, redirect: '/home', hidden: true },
  // {
  //   path: '/uislogin',
  //   name: 'uislogin',
  //   component: () => import('@/views/login/uislogin')
  // },
  {
    path: '/redirect',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/redirect/404')
  }
]

export const CustomerRouter = modules

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...routes,
    ...modules,
    // { path: '/:catchAll(.*)', redirect: '/404', hidden: true }
  ]
})
/**
 * 路由拦截器
 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  const { loginPermission } = useRouterPermission(router, to, from)

  if (!loginPermission) {
    router.push({
      path: '/account/login',
      query: {
        to: encodeURIComponent(to.fullPath)
      }
    })
  }
  // 保存当前URI
  // Cookie.set(consts.CURRENT_URI, to.fullPath)
  // if (to.name !== 'uislogin') {
  //   isLogin(to.fullPath)
  // }
  document.title = to.meta.title as string || process.env.VUE_APP_TITLE!
  next()
})

router.afterEach(() => {
  NProgress.done()
  window.scrollTo(0, 0)
})

export default router
