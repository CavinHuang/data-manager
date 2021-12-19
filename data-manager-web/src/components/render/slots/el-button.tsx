export default {
  default(h: any,conf: any,key: any) {
    return conf.__slot__[key]
  }
}
