export default function (h: any, conf: any) {
  const slot: any = {}
  for (let k in conf.__slot__) {
    if (conf.__slot__[k]) {
      slot[k] = () => {
        return conf.__slot__[k]
      }
    }
  }
  return slot
}
