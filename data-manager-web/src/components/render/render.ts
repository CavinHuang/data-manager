import { deepClone } from '@/utils/index'
import { h, resolveComponent, VNode } from 'vue'

const componentChild: any = {}
/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const slotsFiles = require.context('./slots', false, /\.tsx$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
    const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = slotsFiles(key).default
    componentChild[tag] = value
})

// const slotsFiles = require.context('./slots', false, /\.js$/)
// const keys = slotsFiles.keys() || []
// keys.forEach(key => {
//   const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = slotsFiles(key).default
//   componentChild[tag] = value
// })

function vModel (dataObject: any, defaultValue: any) {
  dataObject.value = defaultValue
}

function mountSlotFiles (h: any, confClone: any) {
  let children
  let childObjs = componentChild[confClone.__config__.tag]
  if (typeof childObjs === 'function') {
    children = childObjs(h, confClone)
  } else if (childObjs) {
    Object.keys(childObjs).forEach(key => {
      const childFunc = childObjs[key]
      children = childFunc(h, confClone)
    })
  }

  return children
}

function emitEvents (confClone: any) {
  ['on', 'nativeOn'].forEach(attr => {
    const eventKeyList = Object.keys(confClone[attr] || {})
    eventKeyList.forEach(key => {
      const val = confClone[attr][key]
      if (typeof val === 'string') {
        // @ts-ignore
        confClone[attr][key] = (event: any) => this.$emit(val, event)
      }
    })
  })
}

function buildDataObject (confClone: any, dataObject: any) {
  Object.keys(confClone).forEach(key => {
    const val = confClone[key]
    if (key === '__vModel__') {

      // vModel.call(this, dataObject, confClone.__config__.defaultValue)
    } else if (dataObject[key] !== undefined) {
      if (dataObject[key] === null ||
        dataObject[key] instanceof RegExp ||
        ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
        dataObject[key] = val
      } else if (Array.isArray(dataObject[key])) {
        dataObject[key] = [...dataObject[key], ...val]
      } else {
        dataObject[key] = { ...dataObject[key], ...val }
      }
    } else {
      dataObject.attrs[key] = val
    }
  })

  // 清理属性
  clearAttrs(dataObject)
}

function clearAttrs (dataObject: any) {
  delete dataObject.attrs.__config__
  delete dataObject.attrs.__slot__
  delete dataObject.attrs.__methods__
}
const ignoreProps = ['dId', 'sort', 'regList', 'formItemId']
function makeDataObject (dataObject: any, confClone: any) {
  Object.keys(confClone).forEach(key => {
    if (!ignoreProps.includes(key)) {
      if (key === '__vModel__') {
        // vModel.call(this, dataObject, confClone.__config__.defaultValue)
        // dataObject["v-model"] = confClone.__config__.defaultValue;
        // @ts-ignore
        dataObject['model-value'] = this.conf.__config__.defaultValue
        dataObject['onUpdate:modelValue'] = (value: any) => {
          // @ts-ignore
          this.conf.__config__.defaultValue = value
          // @ts-ignore
          console.log('111111', value)
          // @ts-ignore
          this.onInput && this.onInput(value)
        }
      } else if (key.substr(0, 2) !== '__') {
        const val = confClone[key]

        dataObject[key] = val
      }
    }
  })
  // dataObject['value'] = confClone.__config__.defaultValue;

  // dataObject['__slot__'] = confClone.__slot__;
  // console.log(dataObject);
  // 深入数据对象：
  // https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
  // return {
  //   class: [],
  //   style: []
  //   // attrs: {},
  //   // props: {},
  //   // domProps: {},
  //   // nativeOn: {},
  //   // on: {},
  //   // style: {},
  //   // directives: [],
  //   // scopedSlots: {},
  //   // slot: null,
  //   // key: null,
  //   // ref: null,
  //   // refInFor: true
  // }
}

export default {
  name: 'Render',
  props: {
    conf: {
      type: Object,
      required: true
    },
    onInput: {
      type: Function,
      default: null
    }
  },
  render(): VNode {
    // const dataObject = makeDataObject()
    const confClone = deepClone((this as any).conf)

    // 如果slots文件夹存在与当前tag同名的文件，则执行文件中的代码
    const children = mountSlotFiles.call(this, h, confClone)

    // 将字符串类型的事件，发送为消息
    emitEvents.call(this, confClone)

    const dataObject = {

    }

    makeDataObject.call(this, dataObject, confClone)

    // console.log(dataObject, '--------++dataObject+++----------', children, componentChild)

    // 将json表单配置转化为vue render可以识别的 “数据对象（dataObject）”
    // buildDataObject.call(this, confClone, dataObject)
    // console.log(dataObject)
    // @ts-ignore
    return h(resolveComponent((this as any).conf.__config__.tag), dataObject, children)
  }
}
