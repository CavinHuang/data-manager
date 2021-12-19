// @ts-ignore
const callbacks: any = {}

/**
 * 加载一个远程脚本
 * @param {String} src 一个远程脚本
 * @param {Function} callback 回调
 */
function loadScript (src: string, callback: () => void) {
  const existingScript = document.getElementById(src)
  const cb = callback || (() => {
  })
  if (!existingScript) {
    callbacks[src] = []
    const $script = document.createElement('script')
    $script.src = src
    $script.id = src
    $script.async = true
    document.body.appendChild($script)
    const onEnd = 'onload' in $script ? stdOnEnd.bind($script) : ieOnEnd.bind($script)
    onEnd($script)
  }

  callbacks[src].push(cb)

  function stdOnEnd (script: HTMLScriptElement) {
    script.onload = () => {
      // @ts-ignore
      this.onerror = this.onload = null
      callbacks[src].forEach((item: any) => {
        item(null, script)
      })
      delete callbacks[src]
    }
    script.onerror = () => {
      // @ts-ignore
      this.onerror = this.onload = null
      // @ts-ignore
      cb(new Error(`Failed to load ${src}`), script)
    }
  }

  function ieOnEnd (script: HTMLScriptElement) {
    (script as any).onreadystatechange = () => {
      // @ts-ignore
      if ((this as any).readyState !== 'complete' && this.readyState !== 'loaded') return
      // @ts-ignore
      this.onreadystatechange = null
      callbacks[src].forEach((item: any) => {
        item(null, script)
      })
      delete callbacks[src]
    }
  }
}

/**
 * 顺序加载一组远程脚本
 * @param {Array} list 一组远程脚本
 * @param {Function} cb 回调
 */
export function loadScriptQueue (list: any[], cb: () => void) {
  const first = list.shift()
  list.length ? loadScript(first, () => loadScriptQueue(list, cb)) : loadScript(first, cb)
}

export default loadScript
