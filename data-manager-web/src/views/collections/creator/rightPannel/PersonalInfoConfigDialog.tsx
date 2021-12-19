import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { regList } from './regList'
import style from './style.module.scss'

export type TRowSettingConfig = {
  title: string
  reg: string
  min?: number
  max?: number
  required: boolean
  width?: string
  placeholder?: string
}

type TableScope = {
  row: TRowSettingConfig
  column: any
  $index: number
}

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array as PropType<TRowSettingConfig[]>,
      default: () => ([])
    },
    onCancel: {
      type: Function,
      default: () => {}
    },
    onConfirm: {
      type: Function as PropType<(data: TRowSettingConfig[]) => void>,
      default: () => { }
    }
  },
  setup(props) {

    const widthOptions = [
      {
        label: '默认',
        value: 'auto'
      },
      {
        label: '10%',
        value: '10%'
      },
      {
        label: '20%',
        value: '20%'
      },
      {
        label: '30%',
        value: '30%'
      },
      {
        label: '40%',
        value: '40%'
      },
      {
        label: '50%',
        value: '50%'
      },
      {
        label: '60%',
        value: '60%'
      },
      {
        label: '70%',
        value: '70%'
      },
      {
        label: '80%',
        value: '80%'
      },
    ]
    const _tableData = ref<TRowSettingConfig[]>(props.tableData)
    const addRaw = () => {
      _tableData.value.push({
        title: '',
        reg: '',
        min: 0,
        max: 10,
        required: true,
        placeholder: ''
      })
    }
    const renderContent = () => {
      return (
        <>
          <el-table data={_tableData.value}>
            <el-table-column label='行标题'>
              {{
                default: ({ row,column,$index }: TableScope) => {
                  return <el-input size='mini' type='text' modelValue={row.title} onInput={(val: string) => { row.title = val }} clearable />
                }
              }}
            </el-table-column>
            <el-table-column label='验证属性'>
              {{
                default: ({ row,column,$index }: TableScope) => {
                  return <el-select size='mini' modelValue={row.reg} onChange={(val: string) => { row.reg = val }}>
                    {regList.map((item,index) => {
                      return <el-option
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    })}
                  </el-select>
                }
              }}
            </el-table-column>
            <el-table-column label='范围' width='400'>{{
              default: ({ row,column,$index }: TableScope) => {
                const reg = regList.find(item => item.value === row.reg)
                if (reg) {
                  const regType = reg.type
                  switch (regType) {
                    case 'text':
                      return (
                        <div>
                          <span class='type-label'>最小字数</span>
                          <el-input-number size='mini' type='number' modelValue={row.min} onInput={(val: string) => { row.min = +val }} />
                          <span class='type-label'>最大字数</span>
                          <el-input-number size='mini' type='number' modelValue={row.max} onInput={(val: string) => { row.max = +val }} />
                        </div>
                      )
                      break
                    case 'number':
                      return (
                        <div>
                          <span class='type-label'>最小值</span>
                          <el-input-number size='mini' type='number' modelValue={row.min} onInput={(val: string) => { row.min = +val }} />
                          <span class='type-label'>最大值</span>
                          <el-input-number size='mini' type='number' modelValue={row.max} onInput={(val: string) => { row.max = +val }} />
                        </div>
                      )
                      break
                  }
                }
                return <span />
              }
            }}</el-table-column>
            <el-table-column label='必填' align='center'>
              {{
                default: ({ row,column,$index }: TableScope) => {
                  return <el-checkbox modelValue={row.required} onChange={(val: string) => { row.required = Boolean(val) }} />
                }
              }}
            </el-table-column>
            <el-table-column label='提示语' width='200'>
              {{
                default: ({ row,column,$index }: TableScope) => {
                  return <el-input size='mini' type='text' modelValue={row.placeholder} onInput={(val: string) => { row.placeholder = val }} clearable />
                }
              }}
            </el-table-column>
          </el-table>
          <div class='add-row' style='margin-top: 20px; display: flex; justify-content: center;'><el-button type='primary' size='medium' icon='plus' onClick={() => addRaw()}>增加一行</el-button></div>
        </>
      )
    }
    const onCancel = () => {
      props.onCancel()
    }
    const onConfirm = () => {
      props.onConfirm(_tableData.value)
    }
    return () => (
      <el-dialog
        modelValue={props.modelValue}
        title="设置行属性"
        width='90%'
      >
        {{
          default: () => renderContent(),
          footer: () => <div>
            <el-button onClick={onCancel}>取消</el-button>
            <el-button type="primary" onClick={onConfirm}>确定</el-button>
          </div>
        }}
      </el-dialog>
    )
  }
})
