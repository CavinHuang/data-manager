const DRAWING_ITEMS = 'drawingItems'
const DRAWING_ITEMS_VERSION = '1.2'
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION'
const DRAWING_ID = 'idGlobal'
const TREE_NODE_ID = 'treeNodeId'
const FORM_CONF = 'formConf'
const CHECKED_COLUMNS = 'checkedColumns'

export function getDrawingList (key: any) {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY)
  if (version !== DRAWING_ITEMS_VERSION) {
    localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION)
    saveDrawingList([])
    return null
  }

  const str = localStorage.getItem(`${DRAWING_ITEMS}:${key}`)
  if (str) return JSON.parse(str)
  return null
}

export function saveDrawingList (list: any, key?: any) {
  if (key) localStorage.setItem(`${DRAWING_ITEMS}:${key}`, JSON.stringify(list))
}

export function getIdGlobal (key: any) {
  const str = localStorage.getItem(`${DRAWING_ID}:${key}`)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveIdGlobal (id: any, key: any) {
  if (key) localStorage.setItem(`${DRAWING_ID}:${key}`, `${id}`)
}

export function getTreeNodeId () {
  const str = localStorage.getItem(TREE_NODE_ID)
  if (str) return parseInt(str, 10)
  return 100
}

export function saveTreeNodeId (id: any) {
  localStorage.setItem(TREE_NODE_ID, `${id}`)
}

export function getFormConf (key: any) {
  const str = localStorage.getItem(`${FORM_CONF}:${key}` + key)
  if (str) return JSON.parse(str)
  return null
}

export function saveFormConf (obj: any, key: any) {
  if (key) localStorage.setItem(`${FORM_CONF}:${key}`, JSON.stringify(obj))
}

export function saveCheckedColumn (key: any, obj: any) {
  if (key) localStorage.setItem(`${CHECKED_COLUMNS}:${key}`, JSON.stringify(obj))
}

export function getCheckedColumn (key: any) {
  const str = localStorage.getItem(`${CHECKED_COLUMNS}:${key}`)
  if (str) return JSON.parse(str)
  return null
}
