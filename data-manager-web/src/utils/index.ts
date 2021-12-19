/**
 * 工具函数
 */

export const store = {
  prifixKey: 'dataManager_',
  set: function(key: string, value: any) {
    return window.localStorage.setItem(key + this.prifixKey, JSON.stringify(value))
  },
  get: function(key: string) {
    return JSON.parse(window.localStorage.getItem(key + this.prifixKey) as string)
  },
  remove: function(key: string) {
    return window.localStorage.removeItem(key + this.prifixKey)
  },
  clear: function() {
    return window.localStorage.clear()
  }
}

// 深拷贝对象
export function deepClone(obj: any) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
      return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
      return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
      return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
      const flags = []
      if (obj.global) {
          flags.push('g')
      }
      if (obj.multiline) {
          flags.push('m')
      }
      if (obj.ignoreCase) {
          flags.push('i')
      }

      return new RegExp(obj.source, flags.join(''))
  }

  const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (const key in obj) {
      result[key] = deepClone(obj[key])
  }

  return result
}


export function isNumberStr(str: string) {
    return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}
