import { eventBus } from '@/utils/eventBus'
import { defineComponent, PropType, ref } from 'vue'
import { imageComponents, inputComponents, selectComponents } from '../config/components'
import { formItemRender } from './fieldFormItemConfig'
export default defineComponent({
  name: 'FieldFormItem',
  props: {
    activeData: {
      type: Object as PropType<any>,
      default: null
    },
    onTagChange: {
      type: Function as PropType<(target: any) => void>,
      default: null
    }
  },
  setup(props) {
    const tagList = [
      {
        label: "输入型组件",
        options: inputComponents
      },
      {
        label: "图片型组件",
        options: imageComponents
      },
      {
        label: "选择型组件",
        options: selectComponents
      }
    ]
    const tagChange = (tagIcon: string) => {
      let target: any = inputComponents.find(
        (item) => item.__config__.tagIcon === tagIcon
      );
      if (!target) {
        target = selectComponents.find(
          (item) => item.__config__.tagIcon === tagIcon
        );
      }
      props.onTagChange && props.onTagChange(target)
    }
    // 组件类型切换
    const componentType = () => {
      return (
        props.activeData && (props.activeData as any).__config__.changeTag ? (<el-form-item label="组件类型">
          <el-select
            modelValue={(props.activeData as any).__config__.tagIcon}
            style={'width:100%'}
            placeholder='请选择组件类型'
            onChange={tagChange}
          >
            {tagList.map((group: any) => {
              return (
                <el-option-group
                  key={group.label}
                  label={group.label}
                >
                  {
                    group.options.map((item: any) => {
                      return (
                        <el-option
                          key={item.__config__.label}
                          label={item.__config__.label}
                          value={item.__config__.tagIcon}
                        >
                          <svg-icon name="item.__config__.tagIcon" class="node-icon" />
                          <span>
                            {item.__config__.label}
                            {item.__config__.tagIcon}
                          </span>
                        </el-option>
                      )
                    })
                  }
                </el-option-group >
              )}
            )}
          </el-select>
        </el-form-item>): ''
      )
    }

    const changeRenderKey = () => {}
    const spanChange = (val: string) => {
      eventBus.emit('spanChange', val)
    }
    const openIconsDialog = (val: string) => {
      eventBus.emit('openIconsDialog', val)
    }
    const isShowMin = ref(false)
    const isShowMax = ref(false)
    const isShowStep = ref(false)
    const formItem = () => {
      const formItemResult = formItemRender(
        changeRenderKey,
        spanChange,
        openIconsDialog,
        isShowMin.value,
        isShowMax.value,
        isShowStep.value)
      return formItemResult.map((item, index) => {
        const showCondition = item.showCondition ? item.showCondition(props.activeData) : false
        if (!showCondition) return ''
        const noFormItem = !!item.noFormItem
        return noFormItem ? item.render(props.activeData) : <el-form-item label={item.title}>{item.render(props.activeData)}</el-form-item>
      })
    }
    return () => (
      <>
        {componentType()}
        {formItem()}
      </>
    )
  }
})
