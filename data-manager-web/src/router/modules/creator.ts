/*
 * @Author: your name
 * @Date: 2021-09-14 22:47:57
 * @LastEditTime: 2021-10-23 22:32:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\router\modules\front.ts
 */

import Layout from '@/views/layout/default'

export default [
  {
    path: '/creator',
    name: 'Creator',
    component: Layout,
    redirect: '/creator/index',
    meta: {
      title: '首页',
      icon: 'icon-app'
    },
    children: [
      {
        path: '/creator/index',
        name: 'CreatorIndex',
        meta: { title: '创建收集表单', keepAlive: true },
        component: () => import('@/views/collections/creator'),
        redirect: '/creator/form',
        children: [
          {
            path: '/creator/form',
            name: 'CreatorIndex',
            meta: { title: '创建收集表单', keepAlive: true },
            component: () => import('@/views/collections/creator/form')
          },
          {
            path: '/creator/theme',
            name: 'CreatorTheme',
            meta: { title: '配置主题', keepAlive: true },
            component: () => import('@/views/collections/theme')
          },
          {
            path: '/creator/setting',
            name: 'CreatorSetting',
            meta: { title: '设置', keepAlive: true },
            component: () => import('@/views/collections/setting')
          },
          {
            path: '/creator/publish',
            name: 'CreatorPublish',
            meta: { title: '发布', keepAlive: true },
            component: () => import('@/views/collections/publish')
          }
        ]
      }
    ]
  }
]
