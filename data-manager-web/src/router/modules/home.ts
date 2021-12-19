/*
 * @Author: your name
 * @Date: 2021-08-25 17:55:12
 * @LastEditTime: 2021-09-05 15:41:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ias-h5\src\router\modules\home.ts
 */
import Layout from '@/views/layout/default'

export default [
  {
    path: '/home',
    name: 'Home',
    component: Layout,
    redirect: '/home/index',
    meta: {
      title: '首页',
      icon: 'icon-app'
    },
    children: [
      {
        path: 'index',
        name: 'HomeIndex',
        meta: { title: '首页', keepAlive: true, noLogin: true },
        component: () => import('@/views/home')
      },
      {
        path: 'user',
        name: 'HomeUser',
        meta: { title: '首页', keepAlive: true },
        component: () => import('@/views/home/user')
      },
      {
        path: 'start',
        name: 'HomeStart',
        meta: { title: '【新建】查询/采集', keepAlive: true },
        component: () => import('@/views/home/start')
      },
      {
        path: 'query',
        name: 'HomeQuery',
        meta: { title: '【新建】查询/采集', keepAlive: true },
        component: () => import('@/views/home/query')
      },
      {
        path: 'queryList',
        name: 'HomeQueryList',
        meta: { title: '查询/采集列表', keepAlive: true },
        component: () => import('@/views/home/queryList')
      },
      {
        path: 'collection',
        name: 'HomeCollection',
        meta: { title: '【新建】查询/采集', keepAlive: true },
        component: () => import('@/views/home/collection')
      },
      {
        path: 'collection/list',
        name: 'CollectionList',
        meta: { title: '信息采集列表', keepAlive: true },
        component: () => import('@/views/collections/list')
      },
      {
        path: 'collection/detail',
        name: 'CollectionDetail',
        meta: { title: '信息采集列表', keepAlive: true },
        component: () => import('@/views/collections/detail')
      },
      {
        path: 'result',
        name: 'HomeResult',
        meta: { title: '【新建】查询/采集', keepAlive: true },
        component: () => import('@/views/home/result')
      }
    ]
  }
]
