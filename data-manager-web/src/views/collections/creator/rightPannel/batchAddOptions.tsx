import { deepClone } from '@/utils'
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
export default defineComponent({
  name: 'BatchAddOptions',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array as PropType<string[]>,
      default: () => ([])
    },
    onConfirm: {
      type: Function as PropType<(options: string[]) => void>,
      default: null
    }
  },
  setup(props) {
    const _options = ref<string[]>([])
    const options = computed({
      get() {
        return _options.value.length ? _options.value : props.options
      },
      set(val: string[]) {
        _options.value = val
      }
    })
    const valueChange = (val: string) => {
      const _result = val.split(/[(\r\n\s)\r\n\s]+/)
      options.value = _result
    }
    const onOpen = () => {
    }
    const onClose = () => { }
    const handelConfirm = () => {
      if (props.onConfirm && typeof props.onConfirm === 'function') {
        const _result = _options.value.filter(item => item !== '' && item)
        props.onConfirm(deepClone(_result))
        _options.value = []
      }
    }
    return () => (
      <el-dialog
        closeOnClickModal={false}
        appendToBody={false}
        onOpen={onOpen}
        onClose={onClose}
        modelValue={props.modelValue}
        title='批量操作选项'
        v-slots={{
          footer: () => {
            return (
              <>
                <el-button type="primary" onClick={handelConfirm}
                >确定 </el-button>
                <el-button onClick="close">取消</el-button>
              </>
            )
          }
        }}
      >
        <div class='add-options-content'>
          <p style='color: #999; font-size: 14px; line-height: 24px'>每一项之间用换行区分！</p>
          <el-input type='textarea' rows={10} modelValue={options.value.join('\n')} onInput={ valueChange } placeholder="请输入选项名" clearable />
        </div>
      </el-dialog>
    )
  }
})
