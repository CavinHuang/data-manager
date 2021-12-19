/*
 * @Author: your name
 * @Date: 2021-09-14 22:47:57
 * @LastEditTime: 2021-09-14 23:12:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\router\modules\front.ts
 */

import Layout from '@/views/layout/default'

export default [
  {
    path: '/front',
    name: 'Front',
    component: Layout,
    redirect: '/front/query',
    meta: {
      title: '首页',
      icon: 'icon-app'
    },
    children: [
      {
        path: 'query',
        name: 'FrontIndex',
        meta: { title: '查询', keepAlive: true },
        component: () => import('@/views/front/query')
      },
      {
        path: 'question',
        name: 'QuestionIndex',
        meta: { title: '信息系统', keepAlive: true },
        component: () => import('@/views/collections/preview/ProjectForm')
      }
    ]
  },
  {
    path: '/account/login',
    name: 'Login',
    meta: { title: '登录', keepAlive: true, noLogin: true },
    component: () => import('@/views/account/login')
  },
  {
    path: '/q/:key',
    name: 'FrontIndex',
    meta: { title: '查询', keepAlive: true },
    component: () => import('@/views/front/query')
  },
  {
    path: '/s/:key',
    name: 'FrontQuestion',
    meta: { requireLogin: false, title: '详情', noLogin: true },
    component: () => import('@/views/front/collections')
  },
  {
    path: '/project/write',
    name: 'FrontQuestionwrite',
    meta: { requireLogin: false, title: '详情', noLogin: true },
    component: () => import('@/views/front/collections')
  }
]
