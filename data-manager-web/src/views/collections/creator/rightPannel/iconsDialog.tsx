import { defineComponent, PropType, reactive } from 'vue'
import iconList from '../utils/icon.json'
import style from './style.module.scss'
export default defineComponent({
  name: 'IconsDialog',
  props: {
    current: {
      type: String,
      default: ''
    },
    select: {
      type: Function as PropType<(icon: string) => void>
    },
    updateVisible: {
      type: Function as PropType<(visible: boolean) => void>
    },
    modelValue: {
      type: Boolean
    },
    title: {
      type: String
    }
  },
  setup(props) {
    const state = reactive({
      active: '',
      key: ''
    })
    const onOpen = () => {
      state.active = props.current
      state.key = ''
    }
    const onClose = () => {
    }
    const onSelect = (icon: string) => {
      state.active = icon
      props.select!(icon)
      props.updateVisible!(false)
    }
    return () => (
      <div class={style['icon-dialog']}>
        <el-dialog
          width="980px"
          appendToBody={false}
          onOpen={onOpen}
          onClose={onClose}
          modelValue={props.modelValue}
          title={props.title}
          v-slots={{
            title: () => {
              return (
                <div>
                  选择图标
                  <el-input
                    modelValue={state.key}
                    onInput={(val: string) => state.key = val}
                    size="mini"
                    style={{ width: '260px', marginLeft: '10px' }}
                    placeholder="请输入图标名称"
                    prefix-icon="el-icon-search"
                    clearable
                  />
                </div>
              )
            }
          }}
        >
          <ul class={style['icon-ul']}>
            {iconList.map((icon: any, index: any) => {
              return (
                <li
                  key={icon}
                  class={state.active === icon ? 'active-item' : ''}
                  onClick={() => onSelect(icon)}
                >
                  <i class={`el-icon-${icon}`} />
                  <div>{ icon }</div>
                </li>
              )
            })}
          </ul>
        </el-dialog>
      </div>
    )
  }
})
