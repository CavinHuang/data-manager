import { resolveComponent, VNode } from 'vue'

export default function (h: any, conf: any) {
  const list: VNode[] = []
  conf.__slot__.options.forEach((item: any) => {
  const attrs: { label: string, border?: string } = { label: item.value }
  if (conf.__config__.optionType === 'button') {
    list.push(h(resolveComponent('el-radio-button'), attrs, { default: () => item.label }))
  } else {
    attrs['border'] = conf.border;
    list.push(h(resolveComponent('el-radio'), attrs, { default: () => item.label }))
  }
})
  return { default: () => list}
}
