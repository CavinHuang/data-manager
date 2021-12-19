import { resolveComponent,VNode } from 'vue'

export default function (h: any,conf: any) {
  return (props: any) => {
    return <span>{props.node.label}</span>
  }
}
