/*
 * 跳转刷新
 * @Author: cavinHuang
 * @Date: 2021-09-05 15:30:37
 * @LastEditTime: 2021-09-05 15:50:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\redirect\index.tsx
 */

import { defineComponent } from 'vue'

export default defineComponent({
  beforeCreate () {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  }
})
