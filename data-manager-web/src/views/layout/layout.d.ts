/*
 * @Author: your name
 * @Date: 2021-09-05 15:36:43
 * @LastEditTime: 2021-09-05 15:36:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\layout\layout.d.ts
 */

import { Component } from 'vue'

export interface RouterSlot {
 (param: { Component: Component }): Component
}
