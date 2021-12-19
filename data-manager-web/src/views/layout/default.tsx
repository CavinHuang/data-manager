/*
 * @Author: your name
 * @Date: 2021-09-05 15:34:40
 * @LastEditTime: 2021-09-05 15:53:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\layout\default.tsx
 */

import { defineComponent } from 'vue'
import css from './default.module.scss'
import { KeepAlive } from '@vue/runtime-core'
import { keppAliveRoutesName } from '@/router'
import { RouterSlot } from './layout'

export default defineComponent({
  name: 'Layout',
  setup () {
    const routerSlot: RouterSlot = ({ Component }) => (
      <KeepAlive include={keppAliveRoutesName}>
        {Component}
      </KeepAlive>
    )
    const keepalive = () => {
      return (
        <router-view v-slots={
          {
            default: routerSlot
          }
        }
        />
      )
    }
    return () => (
      <div class={css['page-container']}>
        {keepalive()}
      </div>
    )
  }
})
