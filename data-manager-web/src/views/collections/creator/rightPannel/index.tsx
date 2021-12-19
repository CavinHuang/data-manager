import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import style from './style.module.scss'
import FieldFormItem from './fieldFormItem'
import TreeNodeDialog from './treeNodeDialog'
import IconsDialog from './iconsDialog'
import BatchAddOptions from './batchAddOptions'
import { eventBus } from '@/utils/eventBus'
import PersonalInfoConfigDialog, { TRowSettingConfig } from './PersonalInfoConfigDialog'
export default defineComponent({
  name: 'RightPannel',
  props: {
    activeData: {
      type: Object as PropType<any>,
      default: null
    },
    formConf: {
      type: Object,
      default: null
    },
    showField: {
      type: Boolean,
      default: false
    },
    onTagChange: {
      type: Function as PropType<(target: any) => void>,
      default: null
    },
    onDataChange: {
      type: Function as PropType<(target: any) => void>,
      default: null
    }
  },
  setup (props) {
    const activeData = computed<any>({
      get: () => props.activeData,
      set: (newValue: any) => {
        console.log(newValue, '=================================')
        if (newValue.__config__.formId === (props.activeData as any).__config__.formId) {
          if (newValue) {
            props.onDataChange(newValue)
          }
        }
      }
    })

    const currentTab = ref('field')
    const header = () => {
      return (
        <el-tabs modelValue={currentTab.value} onChange={(val: string) => { currentTab.value = val }} class="center-tabs">
          <el-tab-pane label="组件属性" name="field" />
        </el-tabs>
      )
    }
    const currentNode = ref<any>([])
    const dialogVisible = ref(false)
    const iconsVisible = ref(false)
    const currentIconModel = ref<any>(null)
    const addNode = (data: any) => {
      currentNode.value.push(data)
    }
    const setIcon = (val: string) => {
      activeData.value[currentIconModel.value] = 'el-icon-' + val
    }

    const batchAddVisible = ref(false)
    const batchAddOptions = ref<string[]>([])

    const batchAddOnConfirm = (options: string[]) => {
      batchAddVisible.value = false
      const _options: Array<{ label: string, value: string | number }> = options.map((item, index) => {
        return {
          label: item,
          value: index
        }
      })
      activeData.value.__slot__.options = _options
    }

    const personalInformationVisible = ref(false)
    /**
     * {
          label: '姓名',
          value: '',
          placeholder: '请输入姓名'
        }
     */
    const personalInfo = computed<TRowSettingConfig[]>(() => {
      if (activeData.value.__config__.tag === 'personal-information') {
        const options = activeData.value.__slot__.options
        const arr: TRowSettingConfig[] = []
        options.forEach((item: any) => {
          arr.push({
            title: item.label,
            reg: '',
            min: 0,
            max: 10,
            required: true,
            placeholder: item.placeholder
          })
        })
        return arr
      }
      return []
    })
    /**
     *  ref<TRowSettingConfig[]>([
      {
        title: '姓名',
        reg: '',
        min: 0,
        max: 10,
        required: true,
        placeholder: '请输入姓名'
      },
      {
        title: '部门',
        reg: '',
        min: 0,
        max: 10,
        required: true,
        placeholder: '请输入部门'
      }
    ])

     */

    const personalInfoConfirm = (personalConfig: TRowSettingConfig[]) => {
      const _res = personalConfig.map((item) => {
        return {
          label: item.title,
          value: '',
          placeholder: item.placeholder
        }
      })
      activeData.value.__slot__.options = _res
      personalInformationVisible.value = false
    }

    onMounted(() => {
      eventBus.on('openIconsDialog', (model) => {
        iconsVisible.value = true
        currentIconModel.value = model
      })

      eventBus.on('addTreeItem', () => {
        dialogVisible.value = true
        currentNode.value = activeData.value.options
      })

      eventBus.on('append', (children) => {
        dialogVisible.value = true
        currentNode.value = children
      })
      eventBus.on('blukAddSelectItems', () => {
        console.log('++++++++++blukAddSelectItems')
        batchAddVisible.value = true
        batchAddOptions.value = activeData.value.__slot__.options.map((item: any) => item.label)
      })

      eventBus.on('personalConfig', () => {
        personalInformationVisible.value = true
      })
    })

    return () => (
      activeData.value ? (
        <div class={style['right-board']}>
          {header()}
          <div class='field-box'>
            <el-scrollbar class='right-scrollbar'>
              <el-form
                label-width="90px"
                size="small"
              >
                <FieldFormItem
                  activeData={activeData.value}
                  onTagChange={props.onTagChange}
                />
              </el-form>
              {props.formConf && currentTab.value === 'form' ? (<el-form v-show="currentTab === 'form'" label-width="90px" size="small">
                <el-form-item label="表单名">
                  <el-input
                    modelValue={props.formConf.formRef}
                    placeholder="请输入表单名（ref）"
                  />
                </el-form-item>
                <el-form-item label="表单模型">
                  <el-input
                    modelValue={props.formConf.formModel}
                    placeholder="请输入数据模型"
                  />
                </el-form-item>
                <el-form-item label="校验模型">
                  <el-input
                    modelValue={props.formConf.formRules}
                    placeholder="请输入校验模型"
                  />
                </el-form-item>
                <el-form-item label="表单尺寸">
                  <el-radio-group modelValue={props.formConf.size}>
                    <el-radio-button label="medium"> 中等 </el-radio-button>
                    <el-radio-button label="small"> 较小 </el-radio-button>
                    <el-radio-button label="mini"> 迷你 </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="标签对齐">
                  <el-radio-group modelValue={props.formConf.labelPosition}>
                    <el-radio-button label="left"> 左对齐 </el-radio-button>
                    <el-radio-button label="right"> 右对齐 </el-radio-button>
                    <el-radio-button label="top"> 顶部对齐 </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="标签宽度">
                  <el-input modelValue={props.formConf.labelWidth} onInput={(val: string) => { props.formConf.labelWidth = val }} placeholder="请输入标签宽度" type="number" />
                </el-form-item>
                <el-form-item label="栅格间隔">
                  <el-input-number
                    modelValue={props.formConf.gutter}
                    min="0"
                    placeholder="栅格间隔"
                  />
                </el-form-item>
                <el-form-item label="禁用表单">
                  <el-switch modelValue={props.formConf.disabled} />
                </el-form-item>
                <el-form-item label="表单按钮">
                  <el-switch modelValue={props.formConf.formBtns} />
                </el-form-item>
                <el-form-item label="显示未选中组件边框">
                  <el-switch modelValue={props.formConf.unFocusedComponentBorder} />
                </el-form-item>
              </el-form>) : '' }
            </el-scrollbar>
          </div>
          <TreeNodeDialog
            modelValue={dialogVisible.value}
            updateVisible={(visible: boolean) => { dialogVisible.value = visible }}
            title="添加选项"
            commit={addNode}
          />
          <IconsDialog
            current={activeData.value[currentIconModel.value]}
            modelValue={iconsVisible.value}
            updateVisible={(visible: boolean) => { iconsVisible.value = visible }}
            select={setIcon}
          />
          <BatchAddOptions
            modelValue={batchAddVisible.value}
            options={batchAddOptions.value}
            onConfirm={batchAddOnConfirm}
          />
          <PersonalInfoConfigDialog
            modelValue={personalInformationVisible.value}
            tableData={personalInfo.value}
            onConfirm={personalInfoConfirm}
            onCancel={() => { personalInformationVisible.value = false }}
          />
        </div>) : ''
    )
  }
})
