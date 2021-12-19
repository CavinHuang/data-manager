import { resolveComponent, VNode } from 'vue'

export default function (h: any, conf: any) {
  const opt=(props: any) => {
    const list: VNode[]  = []
    conf.__slot__.options.forEach((item: any) => {
      const props = { label: item.label, border: conf.border }
      if (conf.__config__.optionType === 'button') {
        list.push(h(resolveComponent("el-checkbox-button"), props, item.label));
      } else {
        list.push(h(resolveComponent("el-checkbox"), props, item.label));
      }
    });

    return list
  }

  return { default: opt }
}
