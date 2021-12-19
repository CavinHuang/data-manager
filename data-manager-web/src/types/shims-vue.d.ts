declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.scss' {
  const res: any
  export default res
}
declare module '*.css' {
  const res: any
  export default res
}
declare module '*.less' {
  const res: any
  export default res
}

declare module 'clipboard/dist/clipboard.min.js' {
  const clipboard: any
  export default clipboard
}

