import { defineComponent,nextTick,onMounted,reactive,ref,computed, watch } from 'vue'
import style from '../style.module.scss'
import { leftComponents,formConf as baseFromConf } from '../config'
import drawingDefalut from '../config/drawingDefalut'
import { dbDataConvertForItemJson, formItemConvertData } from '../utils/convert'
import draggable from 'vuedraggable'
import { debounce } from 'throttle-debounce'
import Tinymce from '@/components/tinymce'
import DraggableItem from '../DraggableItem'
import RightPannel from '../rightPannel'
import { eventBus } from '@/utils/eventBus'
import { cloneDeep } from 'lodash-es'
import { useRoute } from 'vue-router'
import { createQuestionItem, deleteQuestionItem, getMaxFormItemId, getQuestion, sortItem, updateItem } from '@/apis/modules/question'

type TState = {
  drawingList: any[],
  [key: string]: any
}

let idGlobal = 0
let oldActiveId = 0
let tempActiveData: any
export default defineComponent({
  name: 'CreatorForm',
  components: {
    draggable,
    DraggableItem
  },
  props: {

  },
  setup() {
    const route = useRoute()
    const formConf = ref<any>(baseFromConf)
    const state = reactive<TState>({
      drawingList: drawingDefalut,
      activeData: drawingDefalut ? drawingDefalut[0] : null,
      activeId: drawingDefalut.length != 0 ? (drawingDefalut[0] as any).formId : 0,
      projectKey: route.query.key as string
    })

    getQuestion(state.projectKey).then(res => {
      console.log(res)
      formConf.value.title = res.name
      formConf.value.description = res.describe
      state.drawingList = res.items.map(item => dbDataConvertForItemJson(item))
    })

    getMaxFormItemId(state.projectKey).then(res => {
      idGlobal = res ? res : 100
    })

    const createIdAndKey = (item: any) => {
      const config = item.__config__
      config.formId = ++idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${idGlobal}`
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${idGlobal}`
        !Array.isArray(config.children) && (config.children = [])
        delete config.label // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem: any) => createIdAndKey(childItem))
      }
      return item
    }

    const cloneComponent = (origin: any) => {
      const clone = cloneDeep(origin)
      const config = clone.__config__
      config.span = formConf.value.span // 生成代码时，会根据span做精简判断
      createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder += config.label)
      tempActiveData = clone
      console.log('============================', tempActiveData)
      return tempActiveData
    }

    const addComponent = (item: any) => {
      const clone = cloneComponent(item)
      saveProjectItemInfo(clone)
      state.drawingList.push(clone)
      activeFormItem(clone)
    }

    const activeFormItem = (currentItem: any) => {
      state.activeData = currentItem
      state.activeId = currentItem.__config__.formId
    }

    const saveProjectItemInfo = async (item: any) => {
      let isSuccess = false
      let params = formItemConvertData(item, state.projectKey)
      let pItem = item
      await createQuestionItem(params).then(res => {
        console.log(res)
        pItem.sort = res.sort
        isSuccess = true
      })
      // 如果是分页组件 刷新所有分页的页码
      if (item.typeId === 'PAGINATION') {
        updatePaginationList()
      }
      return isSuccess
    }

    const updatePaginationList = () => {
      // 页总数
      const length = state.drawingList.filter(item => item.typeId === 'PAGINATION').length
      let curr = 1
      state.drawingList.forEach((item,index) => {
        if (item.typeId === 'PAGINATION') {
          item.totalPageNum = length
          item.currPageNum = curr++
          state.drawingList[index] = item
        }
      })
    }

    const onEnd = (obj: any) => {
      if (obj.from !== obj.to) {
        state.activeData = tempActiveData
        state.activeId = idGlobal
        saveProjectItemInfo(tempActiveData).then(() => {
          onItemEnd(obj)
        })
      }
    }

    const onItemEnd = (obj: any) => {
      let params: any = { 'questionKey': state.projectKey }
      if (state.drawingList[obj.newIndex - 1]) {
        let sort1 = state.drawingList[obj.newIndex - 1].sort
        params.beforePosition = sort1
      }
      if (state.drawingList[obj.newIndex + 1]) {
        let sort2 = state.drawingList[obj.newIndex + 1].sort
        params.afterPosition = sort2
      }
      params.formItemId = state.drawingList[obj.newIndex].__config__.formId
      if (params.beforePosition || params.afterPosition) {
        console.log(params)
        sortItem(params).then(res => {
          state.drawingList[obj.newIndex].sort = res.sort
        })
        // this.$api.post('/user/project/item/sort',params).then(res => {
        // this.drawingList[obj.newIndex].sort = res.data.sort
        // })
      }
    }

    const leftBoard = () => {
      return (
        <div class="left-board">
          <el-scrollbar class="left-scrollbar">
            <div class="components-list">
              {leftComponents.map((item,index) => {
                return (
                  <div key={'left' + index}>
                    <div class="components-title">
                      <svg-icon name="component" />
                      {item.title}
                    </div>
                    <draggable
                      clone={cloneComponent}
                      group={{ name: 'componentsGroup',pull: 'clone',put: false }}
                      list={item.list}
                      sort={false}
                      class="components-draggable"
                      draggable=".components-item"
                      onEnd={onEnd}
                      itemKey='size'
                      v-slots={{
                        item: ({ element,index }: { element: any,index: number }) => {
                          return (
                            <div
                              key={'element' + index}
                              class="components-item"
                              onClick={() => addComponent(element)}
                            >
                              <div class="components-body">
                                <svg-icon name="element.__config__.tagIcon" />
                                {element.__config__.label}
                              </div>
                            </div>
                          )
                        }
                      }}
                    >
                    </draggable>
                  </div>
                )
              })
              }
            </div >
          </el-scrollbar>
        </div >
      )
    }

    const titleBlur = (event: Event) => {
      formConf.value.title = (event.target as HTMLHeadElement).innerText;
      saveProjectInfo()
    }

    const saveProjectInfo = debounce(430,true,function () {
      // this.$api.post('/user/project/update',{
      //   'key': this.projectKey,
      //   'name': this.formConf.title,
      //   'describe': this.formConf.description
      // }).then(() => {
      // })
    })

    const editDescription = ref(true)
    const changeLabel = (currentItem: any, value: any) => {
      console.log(currentItem)
      console.log(value)
    }

    const drawingItemCopy = (item: any, list: any) => {
      let clone = cloneDeep(item)
      clone = createIdAndKey(clone)
      list.push(clone)
      activeFormItem(clone)
      saveProjectItemInfo(clone)
    }

    const drawingItemDelete = (index: any, list: any) => {
      let item = list[index]
      list.splice(index,1)
      nextTick(() => {
        const len = state.drawingList.length
        if (len) {
          activeFormItem(state.drawingList[len - 1])
        }
      })
      deleteProjectItemInfo(item)
    }

    const deleteProjectItemInfo = (val: any) => {
      deleteQuestionItem([val.dId]).then(() => {})
      // this.$api.post('/user/project/item/delete',data).then(() => {
      // })
    }

    const centerBoard = () => {
      return (
        <div class="center-board">
          <el-scrollbar class="center-scrollbar">
            {formConf.value ? (
              <el-row gutter={formConf.gutter} class="center-board-row" style='display: block;'>
                <el-row align="middle" justify="center" type="flex">
                  <el-col class="form-head-title">
                    <h4
                      class="form-name-text"
                      contenteditable="true"
                      onBlur={titleBlur}>
                      {formConf.value.title}
                    </h4>
                  </el-col>
              </el-row>
              <el-row align="middle" justify="center" type="flex">
                <el-col class="form-head-desc">
                  {editDescription.value ? (
                    <Tinymce
                      // @ts-ignore
                      value={formConf.value.description}
                      // @ts-ignore
                      placeholder="请输入表单描述"
                      // @ts-ignore
                      onBlur={() => editDescription.value = false} onInput={saveProjectInfo}
                    />
                  ) : (
                        <div class="form-name-text" onClick={() => editDescription.value = true} innerHTML={formConf.value.description} />
                  )}
                </el-col>
              </el-row>
              <el-divider class="form-head-divider" />
              <el-form
                disabled={formConf.value.disabled}
                label-position={formConf.value.labelPosition}
                label-width={formConf.labelWidth + 'px'}
                size={formConf.value.size}
              >
                <draggable
                  animation="340"
                  list={state.drawingList}
                  class="drawing-board"
                  group="componentsGroup"
                  onEnd={onItemEnd}
                  itemKey='renderKey'
                  v-slots={{
                    item: ({ element,index }: { element: any, index: number}) => {
                      return (
                        <draggable-item
                          key={element.renderKey}
                          active-id={state.activeId}
                          current-item={element}
                          drawing-list={state.drawingList}
                          form-conf={formConf}
                          index={index}
                          onActiveItem={activeFormItem}
                          onChangeLabel={changeLabel}
                          onCopyItem={drawingItemCopy}
                          onDeleteItem={drawingItemDelete}
                        />
                      )
                    }
                  }}
                >
                </draggable >
                  <div class="empty-info" style={{ display: !state.drawingList.length ? 'block' : 'none' }}>
                    <img style="width: 20%" src={require("@/assets/images/form-bg.png")} />
                    <p>从左侧拖入或点选组件进行表单设计</p>
                </div>
              </el-form>
            </el-row >
              ) : ''}
          </el-scrollbar>
        </div >
          )
    }
    const activeData = computed(() => {
      return state.activeData
    })
    watch(activeData, (newValue, oldValue) => {
      if (!newValue || !oldValue) return
      if (newValue.__config__.formId === oldValue.__config__.formId) {
        if (newValue) {
          updateProjectItemInfo(newValue)
        }
      }
    }, { deep: true })

    const updateProjectItemInfo = (val: any) => {
      let data = formItemConvertData(val, state.projectKey)
      updateItem(data).then(res => {
        console.log(res)
      })
    }

    const tagChange = (newTag: any) => {
      newTag = cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = state.activeData.__vModel__
      newTag.sort = state.activeData.sort
      config.formId = state.activeId
      config.span = state.activeData.__config__.span
      state.activeData.__config__.tag = config.tag
      state.activeData.__config__.tagIcon = config.tagIcon
      state.activeData.__config__.document = config.document
      state.activeData.typeId = newTag.typeId
      if (typeof state.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = state.activeData.__config__.defaultValue
      }
      Object.keys(newTag)
        .forEach(key => {
          if (newTag.__config__.tag === 'el-select' && key === '__slot__' && newTag.__slot__.options && newTag.__slot__.options.length) {
            newTag[key] = newTag.__slot__
          } else if (state.activeData[key] !== undefined) {
            newTag[key] = state.activeData[key]
          }
        })
      state.activeData = newTag
      updateProjectItemInfo(newTag)
      updateDrawingList(newTag, state.drawingList)
    }

    const updateDrawingList = (newTag: any, list: any) => {
      const index = list.findIndex((item: any) => item.__config__.formId === state.activeId)
      console.log(newTag, index)
      if (index > -1) {
        list.splice(index,1,newTag)
      } else {
        list.forEach((item: any) => {
          if (Array.isArray(item.__config__.children)) {
            updateDrawingList(newTag, item.__config__.children)
          }
        })
      }
    }

    onMounted(() => {
      eventBus.on('spanChange',(model) => {
        formConf.value.span = model
      })
    })

    const mainContainerRender = () => {
      return (
        <>
          {leftBoard()}
          {centerBoard()}
          <RightPannel
            activeData={state.activeData}
            formConf={formConf.value}
            showField={!!state.drawingList.length}
            onTagChange={tagChange}
            onDataChange={updateProjectItemInfo}
          />
        </>
      )
    }

    const previewKey = computed(() => +new Date())
    return () => (
      <div class='form-edit-container'>
        {mainContainerRender()}
      </div>
    )
  }
})
