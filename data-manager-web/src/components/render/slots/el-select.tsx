import { resolveComponent, VNode } from 'vue'

export default function (h: any, conf: any) {
  const list: VNode[] = []
  conf.__slot__.options.forEach((item: any) => {
    const props = { label: item.label, value: item.value, disabled: item.disabled || false }
    list.push(h(resolveComponent("el-option"), props, { default: () => item.label }));
  })
  return { default: () => list }
}
