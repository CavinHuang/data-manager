import { defineComponent, PropType, ref } from 'vue'
import { last, max, values } from 'lodash-es'
import { eventBus } from '@/utils/eventBus';
import draggable from 'vuedraggable'
import style from './style.module.scss'
export default defineComponent({
  name: 'AddOptions',
  props: {
    activeData: {
      type: Object as PropType<any>
    }
  },
  components: {
    draggable
  },
  setup(props) {
    const addSelectItem = () => {
      let lastItem: any = last((props.activeData as any).__slot__.options);
      (props.activeData as any).__slot__.options.push({
        label: "",
        value: lastItem
          ? lastItem.value === 0
            ? max(
              values(
                (props.activeData as any).__slot__.options.map((item: any) => item.value)
              )
            ) + 1
            : lastItem.value + 1
          : 1,
      });
    }

    const blukAddSelectItems = () => {
      eventBus.emit('blukAddSelectItems')
    }

    const addSelectOtherItem = () => {
      let item = (props.activeData as any).__slot__.options.find((item: any) => {
        return item.value == 0;
      });
      if (item) {
        return;
      }
      (props.activeData as any).__slot__.options.push({
        label: "其他",
        value: 0,
      });
    }

    const addSelectOptions =() => {
      return (
        <>
          <draggable
            animation="340"
            list={(props.activeData as any).__slot__.options}
            group="selectItem"
            handle=".option-drag"
            itemKey='renderKey'
            class={style['select-container']}
            v-slots={{
              item: ({ element, index }: { element: any, index: number }) => {
                return (
                  <div key={index} class="select-item">
                    <div class="select-line-icon option-drag">
                      <i class="el-icon-s-operation" />
                    </div>
                    <el-input
                      modelValue={element.label}
                      onInput={(val: string) => element.label = val}
                      placeholder="选项名"
                      size="small"
                    />
                    <div class="close-btn select-line-icon"
                      onClick={() => (props.activeData as any).__slot__.options.splice(index,1)}>
                      <i class="el-icon-remove-outline" />
                    </div>
                  </div>
                )
              }
            }}
          />
          <div style="margin-left: 20px">
            <el-button
              icon="el-icon-circle-plus-outline"
              style="padding-bottom: 0"
              type="text"
              onclick={addSelectItem}
            >添加选项</el-button>
            <el-button
              icon="el-icon-document-copy"
              style="padding-bottom: 0"
              type="text"
              onClick={blukAddSelectItems}>批量贴入</el-button >
            {['el-checkbox-group','el-radio-group'].indexOf((props.activeData as any).__config__.tag) > -1 ? (
              <el-button
                icon="el-icon-circle-plus-outline"
                style="padding-bottom: 0"
                type="text"
                onClick={addSelectOtherItem}
              >添加其他</el-button>) : ''}
          </div >
        </>
      )
    }

    const isSelectCheckboxRadio = () => {
      return ['el-checkbox-group','el-radio-group','el-select'].indexOf(
        (props.activeData as any).__config__.tag
      ) > -1
    }


    const addImageSelectOptions = () => {
      return (
        <>
          <draggable
            animation="340"
            list={(props.activeData as any).__slot__.options}
            group="selectItem"
            handle=".option-drag"
            v-slots={{
              item: () => {
                (props.activeData as any).options.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      class="select-item"
                    >
                      <div class="select-line-icon option-drag">
                        <i class="el-icon-s-operation" />
                      </div>
                      <div class="width-full">
                        <div class="flex-row">
                          <el-input
                            modelValue={item.label}
                            onInput={(val: string) => item.label = val}
                            placeholder="选项名"
                            size="small"
                          />
                          <div
                            class="close-btn select-line-icon"
                            onClick={(props.activeData as any).__slot__.options.splice(index, 1)}
                          >
                            <i class="el-icon-remove-outline" />
                          </div>
                        </div>
                        <div class="flex-row">
                          <el-input
                            modelValue={item.image}
                            onInput={(val: string) => item.image = val}
                            placeholder="图片"
                            size="small"
                          />
                          <el-upload
                            ref="logoUpload"
                            action="getUploadUrl"
                            headers="getUploadHeader"
                            on-progress="uploadProgressHandle"
                            on-success={(response: any, file: any, fileList: any) => {
                                item.image = response.data;
                                (props.activeData as any).__slot__.options[index] = item
                                // closeUploadProgressHandle();
                              }
                            }
                            show-file-list="false"
                            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                            style="text-align center"
                            v-slots={{
                              trigger: () => {
                                return <div class="select-line-icon">
                                  <i class="el-icon-upload" />
                                </div>
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            }}
          >

          </draggable>
          <div style="margin-left 20px">
            <el-button
              icon="el-icon-circle-plus-outline"
              style="padding-bottom 0"
              type="text"
              onClick="addImageCarouselItem"
            >
              添加选项
            </el-button>
          </div>
        </>
      )
    }

    const isImageSelect = () => {
      return ['image-select'].indexOf((props.activeData as any).__config__.tag) > -1
    }

    const isCascader = () => { // el-cascader  el-carousel
      return ['el-cascader'].indexOf((props.activeData as any).__config__.tag) > -1
    }

    const currentNode = ref<any>([])
    const append = (data: any) => {
      if (!data.children) {
        data.children = []
      }
      // this.dialogVisible = true;
      currentNode.value = data.children;
      eventBus.emit('append', data.children)
    }
    const remove = (node: any, data: any) => {
      (props.activeData as any).__config__.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d: any) => d.id === data.id);
      children.splice(index,1);
    }
    const renderContent = (h: any, { node, data, store }: any) => {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              onClick={() => append(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i
              onClick={() => remove(node,data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      );
    }
    const idGlobal = ref(0)
    const addTreeItem = () => {
      ++idGlobal.value;
      // this.dialogVisible = true;
      currentNode.value = (props.activeData as any).options;
      eventBus.emit('addTreeItem', idGlobal.value)
    }
    const addCascaderSelectOptions = () => {
      return (
        (props.activeData as any).__config__.dataType === 'static' ? <>
          <el-tree
            data={(props.activeData as any).options}
            expand-on-click-node={false}
            render-content={renderContent}
            draggable={true}
            node-key="id"
          />
          <div style="margin-left: 20px">
            <el-button
              icon="el-icon-circle-plus-outline"
              style="padding-bottom: 0"
              type="text"
              onClick={addTreeItem}
            >添加父级</el-button>
          </div>
        </> : ''
      )
    }

    return () => (
      <>
        <el-divider>选项</el-divider>
        {isSelectCheckboxRadio() ? addSelectOptions(): ''}
        {isImageSelect() ? addImageSelectOptions() : ''}
        {isCascader() ? addCascaderSelectOptions() : ''}
        <el-divider />
      </>
    )
  }
})
