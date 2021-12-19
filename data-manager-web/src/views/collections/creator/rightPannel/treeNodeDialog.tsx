import { defineComponent, PropType, reactive, ref } from 'vue'
import { getTreeNodeId, saveTreeNodeId } from '../utils/db'

export default defineComponent({
  name: 'TreeNodeDialog',
  props: {
    commit: {
      type: Function as PropType<(formData: any) => void>
    },
    updateVisible: {
      type: Function as PropType<(visible: boolean) => void>,
      default: null
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    let id: any = getTreeNodeId()

    const state = reactive<any>({
      formData: {
        label: undefined,
        value: undefined
      }
    })
    const rules = {
      label: [
        {
          required: true,
          message: '请输入选项名',
          trigger: 'blur'
        }
      ],
      value: [
        {
          required: true,
          message: '请输入选项值',
          trigger: 'blur'
        }
      ]
    }
    const dataType = ref('string')
    const dataTypeOptions = [
      {
        label: '字符串',
        value: 'string'
      },
      {
        label: '数字',
        value: 'number'
      }
    ]
    const onOpen = () => {
      state.formData = {
        label: undefined,
        value: undefined
      }
    }
    const onClose = () => { }
    const close = () => {
      props.updateVisible!(false)
    }
    const elForm = ref<any>(null)
    const handelConfirm = () => {
      elForm.value.validate((valid: boolean) => {
        if (!valid) return
        console.log('+++++++', dataType.value)
        if (dataType.value === 'number') {
          state.formData.value = parseFloat(state.formData.value)
        }
        state.formData.id = id++
        props.commit!(state.formData)
        close()
      })
    }
    return () => (
      <el-dialog
        closeOnClickModal={false}
        appendToBody= {false}
        onOpen={onOpen}
        onClose={onClose}
        modelValue={props.modelValue}
        title={props.title}
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
        <el-row gutter={0}>
          <el-form
            ref={elForm}
            model={state.formData}
            rules={rules}
            size="small"
            label-width="100px"
            style={{ width: '100%' }}
          >
            <el-col span={24}>
              <el-form-item label="选项名" prop="label">
                <el-input modelValue={state.formData.label} onInput={(val: string) => state.formData.label = val} placeholder="请输入选项名" clearable />
              </el-form-item>
            </el-col>
            <el-col span={24}>
              <el-form-item label="选项值" prop="value">
                <el-input
                  modelValue={state.formData.value}
                  onInput={(val: string) => state.formData.value = val}
                  placeholder="请输入选项值"
                  clearable
                  v-slots={{
                    append: () => {
                      return (
                        <el-select
                          modelValue={dataType.value}
                          onChange={(val: string) => dataType.value = val}
                          style={{width: '100px'}}
                        >
                          {
                            dataTypeOptions.map((item, index) => {
                              return (
                                <el-option
                                  key={index}
                                  label={item.label}
                                  value={item.value}
                                />
                              )
                            })
                          }
                        </el-select>
                      )
                    }
                  }}
                />
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </el-dialog>
    )
  }
})
