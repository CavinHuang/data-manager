/*
 * @Author: your name
 * @Date: 2021-10-24 18:57:57
 * @LastEditTime: 2021-10-25 22:19:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\components\Parser\index.tsx
 */
import { deepClone } from '@/utils'
import { computed, defineComponent, nextTick, reactive, ref, watchEffect } from 'vue'
import _ from 'lodash'
import { evalExpression } from '@/utils/expression'
import { componentDefaultValue } from '@/views/collections/creator/config/components'
import render from '@/components/render/render'
import style from './style.module.scss'

const ruleTrigger:{[key: string]: string} = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change'
}

const processType:{[key: string]: string} = {
  'el-select': '__slot__.options',
  'el-cascader': 'options',
  'el-radio-group': '__slot__.options',
  'el-checkbox-group': '__slot__.options'
}

function getObject(array: any, key: any, value: any): any {
  let o
  array.some(function iter(a: any) {
    if (a[key] === value) {
      o = a
      return true
    }
    return Array.isArray(a.children) && a.children.some(iter)
  })
  return o
}

export default defineComponent({
  name: 'Parser',
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    },
    formModel: {
      type: Object,
      required: false
    },
    labelFormModel: {
      type: Object,
      required: false
    },
    onNext: {
      type: Function,
      default: null
    },
    onPrev: {
      type: Function,
      default: null
    },
    onSubmit: {
      type: Function,
      default: null
    }
  },
  setup(props, ctx) {
    const labelFormModelKey = computed(() => props.formConf.labelFormModel)
    const formRulesKey = computed(() => props.formConf.formRules)
    const formModelKey = computed(() => props.formConf.formModel)
    const state = reactive({
      formConfCopy: deepClone(props.formConf),
      [formModelKey.value]: deepClone(props.formModel),
      [labelFormModelKey.value]: deepClone(props.labelFormModel),
      [formRulesKey.value]: {},
      // 已经被触发显示的问题
      logicTriggerItemList: [] as any[]
    })
    const formRef = ref<any>(null)

    function initFormData(componentList: any[], formData: any) {
      // 设置默认值
      componentList.forEach(cur => {
        const config = cur.__config__
        if (cur.__vModel__ && !formData[cur.__vModel__]) {
            // 如果存在分页带回的数据 则不再设置默认
            formData[cur.__vModel__] = config.defaultValue
        }
        if (config.children) initFormData(config.children, formData)
      })
    }

    function initLabelFormData(componentList: any[], formData: any) {
      // 获取选择项选中的显示的值
      componentList.forEach((cur: any) => {
        let temConfig = cur.__config__
        if (cur.__vModel__ && !formData[cur.__vModel__]) {
          let tagOptionKey = processType[temConfig.tag]
          let defaultValue = temConfig.defaultValue
          let labelStr = ''
          if (tagOptionKey && defaultValue) {
            if (defaultValue instanceof Array) {
              defaultValue.forEach(item => {
                if (item) {
                  let labelItem = getObject(_.get(cur, tagOptionKey), 'value', item)
                  if (labelItem) {
                    labelStr += labelItem.label + ','
                  }
                }
              })
              formData[cur.__vModel__] = labelStr
            } else {
              let {label} = _.find(_.get(cur, tagOptionKey), {'value': defaultValue})
              formData[cur.__vModel__] = label
            }
          }
        }
        if (temConfig.children) initLabelFormData(temConfig.children, formData)
      })
    }

    function buildRules(componentList: any[], rules: any[]) {
      componentList.forEach(cur => {
        // 逻辑不显示必填问题不校验
        let triggerShow = _.indexOf(state.logicTriggerItemList, cur.formItemId) > -1
        let flag = cur.logicShow || triggerShow ? '' : 'display:none'
        const config = cur.__config__
        if (cur.tag === 'el-upload') {
          config.regList.push({
            validator: () => {
              console.log(cur.limit)
            }, trigger: 'change'
          })
        }
        // 处理其他输入必填校验
        const validateOtherInput = (rule: any, value: any, callback: any) => {
          // 0 等于选中其他
          if (value == 0 || (Array.isArray(value) && value.includes(0))) {
            if (!state[labelFormModelKey.value][`${rule.field}other`]) {
              callback(new Error('请输入其他内容'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
        if (Array.isArray(config.regList)) {
          // 必填其他输入框校验
          if (['RADIO', 'CHECKBOX'].includes(cur.typeId)) {
            const required = {validator: validateOtherInput, message: cur.placeholder}
            config.regList.push(required)
          }
          if (config.required) {
            const required = {required: config.required, message: cur.placeholder} as any
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `请至少选择一个${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}不能为空`)
            config.regList.push(required)
          }
          // 显示时使用表单校验
          if (!flag) {
            rules[cur.__vModel__] = config.regList.map((item: any) => {
              item.pattern && (item.pattern = eval(item.pattern))
              item.trigger = ruleTrigger && ruleTrigger[config.tag]
              return item
            })
          }
        }
        if (config.children) buildRules(config.children, rules)
      })
    }

    initFormData(state.formConfCopy.fields, state[formModelKey.value])
    initLabelFormData(state.formConfCopy.fields, state[labelFormModelKey.value])
    buildRules(state.formConfCopy.fields, state[formRulesKey.value])

    /**
     *  this.formConf.formModel 保存表单的原始值 如checkbox radio的值是 1,2,3等
     *  this.formConf.labelFormModel 保存显示的值 如选项一 选项二等
     * 保存选项的label值
     * @param event
     * @param config
     * @param scheme
     */
    function setValueLabel(event: any, config: any, scheme: any) {
      // 需要处理的类型 如果是input等则不需要处理
      // @ts-ignore
      let tagOptionKey = processType[config.tag]
      if (tagOptionKey) {
        if (event instanceof Array) {
          // 多选 其他自定义输入
          let labelArr = new Array()
          if (!event.includes(0)) {
            // 如果多选里没有选择其他，就清掉other
            Object.assign(state[labelFormModelKey.value], {[`${scheme.__vModel__}other`]: ''})
            // this.$set(this[this.formConf.labelFormModel], `${scheme.__vModel__}other`, '')
            // 同时把输入框清空
            const tagElement = document.querySelector('.' + config.tag)
            if (tagElement) {
              let otherInput = tagElement.querySelector('.item-other-input') as HTMLInputElement
              if (otherInput) {
                otherInput.value = ''
              }
            }
          }
          event.forEach(item => {
            // 拼到头部 其他选项
            let { label } = getObject(_.get(scheme, tagOptionKey), 'value', item)
            labelArr.push(label)
          })
          Object.assign(state[labelFormModelKey.value], {[scheme.__vModel__]: labelArr.join(',')})
          // this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, labelArr.join(','))
        } else {
          // 单选 其他自定义输入
          if (event == 0) {
            console.log(state[labelFormModelKey.value][`${scheme.__vModel__}other`])
            // 如果选择了其他，把label存在field字段，把输入框内容存在fieldother字段
            let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
            state[labelFormModelKey.value][scheme.__vModel__] = item.label
            // this[this.formConf.labelFormModel].scheme.__vModel__ = item.label
            state[labelFormModelKey.value][`${scheme.__vModel__}other`] = state[labelFormModelKey.value][`${scheme.__vModel__}other`]
            // this[this.formConf.labelFormModel][`${scheme.__vModel__}other`] = this[this.formConf.labelFormModel][`${scheme.__vModel__}other`]
          } else {
            let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
            state[labelFormModelKey.value][scheme.__vModel__] = item.label
            // this[this.formConf.labelFormModel].scheme.__vModel__ = item.label
            // 如果没有选择其他，就清掉other
            state[labelFormModelKey.value][`${scheme.__vModel__}other`] = ''
            // this[this.formConf.labelFormModel][`${scheme.__vModel__}other`] = ''
            // 同时把输入框清空
            const tagElement = document.querySelector('.' + config.tag)
            if (tagElement) {
              let otherInput = tagElement.querySelector('.item-other-input') as HTMLInputElement
              if (otherInput) {
                otherInput.value = ''
              }
            }
          }
        }
      } else if (config.tag === 'el-upload') {
        state[labelFormModelKey.value][scheme.__vModel__] = event
        // this[this.formConf.labelFormModel].scheme.__vModel__ = event
      } else {
        state[labelFormModelKey.value][scheme.__vModel__] = event
        // this[this.formConf.labelFormModel].scheme.__vModel__ = event
      }
    }

    function logicRules(componentList: any[], rules: any[]) {
      componentList.forEach(cur => {
        let triggerShow = _.indexOf(state.logicTriggerItemList, cur.formItemId) > -1
        let flag = cur.logicShow || triggerShow ? '' : 'display:none'
        const config = cur.__config__
        if (!flag) {
          rules[cur.__vModel__] = config.regList.map((item: any) => {
            item.pattern && (item.pattern = eval(item.pattern))
            item.trigger = ruleTrigger && ruleTrigger[config.tag]
            return item
          })
        }
      })
    }

    function setValue(event: any, config: any, scheme: any) {
      config.defaultValue = event
      state[formModelKey.value][scheme.__vModel__] = event
      setValueLabel(event, config, scheme)
      let logicShowRule = state.formConfCopy.logicShowRule
      if (!logicShowRule) {
        return
      }
      // 找到该问题需要触发显示的问题 判断逻辑是否成立
      let rules = _.get(logicShowRule, config.formId)
      if (rules && Array.isArray(rules)) {
        rules.forEach(r => {
          // 成立让该对应的问题显示出来
          let flag = evalExpression(state[formModelKey.value], r.logicExpression)
          // let flag = evalExpression(this[this.formConf.formModel], r.logicExpression)
          // 参与逻辑设置的表单项
          let logicItem = props.formConf.fields.find((a: any) => a.formItemId == r.triggerFormItemId)
          // let logicItem = this.formConf.fields.find(a => a.formItemId == r.triggerFormItemId)
          if (flag) {
            // 防止表单重新渲染 display被刷新
            state.logicTriggerItemList.push(r.triggerFormItemId)
            console.log(state.logicTriggerItemList)
            const element = document.querySelector(`div[cid="${r.triggerFormItemId}"]`) as HTMLDivElement
            element.style.display = ''
            // 重置逻辑校验
            logicItem.logicShow = true
            state[formRulesKey.value] = {}
            // this[this.formConf.formRules] = {}
            logicRules(state.formConfCopy.fields, state[formRulesKey.value])
          } else {
            _.remove(state.logicTriggerItemList, function(n) {
              return n == r.triggerFormItemId
            })
            const element = document.querySelector(`div[cid="${r.triggerFormItemId}"]`) as HTMLDivElement
            element.style.display = 'none'
            // 隐藏表单校验
            logicItem.logicShow = false
            state[formRulesKey.value] = {}
            logicRules(state.formConfCopy.fields, state[formRulesKey.value])
            // 默认值
            let resetValConfig = (componentDefaultValue as any)[logicItem.typeId]
            if (resetValConfig) {
              state[labelFormModelKey.value][logicItem.__vModel__] = resetValConfig.val
              // this[this.formConf.labelFormModel][logicItem.__vModel__] = resetValConfig.val
              state[state.formConfCopy.labelFormModel][logicItem.__vModel__] = resetValConfig.val
              // this[this.formConfCopy.labelFormModel][logicItem.__vModel__] = resetValConfig.val
            }
          }
        })
      }
    }

    function setUpload(config: any, scheme: any, response: any, file: any) {
      let newValue = JSON.parse(state[formModelKey.value][scheme.__vModel__])
      // let newValue = JSON.parse(this[this.formConf.formModel][scheme.__vModel__])
      if (!newValue) {
          newValue = []
      }
      newValue.push({fileName: file.name, url: response.data})
      config.defaultValue = newValue
      // this.$set(config, 'defaultValue', newValue)
      state[formModelKey.value][scheme.__vModel__] = newValue
      // this.$set(this[this.formConf.formModel], scheme.__vModel__, newValue)
      setValueLabel({type: 'file', files: newValue}, config, scheme)
    }

    function deleteUpload(config: any, scheme: any, file: any, fileList: any) {
      let newValue: any[] = []
      fileList.forEach((element: any) => {
          newValue.push({fileName: element.name, url: element.url})
      })
      config.defaultValue = newValue
      // this.$set(config, 'defaultValue', newValue)
      state[formModelKey.value][scheme.__vModel__] = newValue
      // this.$set(this[this.formConf.formModel], scheme.__vModel__, newValue)
      setValueLabel({type: 'file', files: newValue}, config, scheme)
    }

    /**
     * radio checkbox 其他输入框值处理
     */
    function setOtherValueLabel(event: any, config: any) {
      let value = state[formModelKey.value][config.__vModel__]
      // 临时保存其他的选项值
      nextTick(() => {
        state[labelFormModelKey.value][`${config.__vModel__}other`] = event
        // this.$set(this[this.formConf.labelFormModel], `${config.__vModel__}other`, event)
        console.log(state[labelFormModelKey.value])
        setValueLabel(value, config.__config__, config)
      })
    }

    /**
     * 分页下一页
     */
    function nextPage(page: any) {
      switchPage('Next', page)
    }

    /**
     * 分页上一页
     */
    function prevPage(page: any) {
      switchPage('Prev', page)
    }

    /**
     * 切换页
     */
    function switchPage(eventName: any, page: any) {
      formRef.value.validate((valid: any) => {
        if (!valid) {
          setTimeout(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input')?.focus()
          }, 100)
          return false
        } else {
          const event = `on${eventName}`
          if ((props as any)[event]) {
            (props as any)[event]({ page, formModel: state[formModelKey.value], labelFormModel: state[labelFormModelKey.value] })
          }
          // this.$emit(eventName, {
          //   page: page,
          //   formModel: this[this.formConf.formModel],
          //   labelFormModel: this[this.formConf.labelFormModel]
          // })
        }
        return true
      })
    }

    function buildListeners(scheme: any) {
      const config = scheme.__config__
      const methods = props.formConf.__methods__ || {}
      const listeners: {[key: string]: (event: any, file?: any) => void} = {}

      // 给__methods__中的方法绑定this和event
      Object.keys(methods).forEach(key => {
        listeners[key] = event => methods[key](event)
      })
      // 响应 render.js 中的 vModel $emit('input', val)
      listeners.onInput = event => setValue(event, config, scheme)
      listeners.onUpload = (response: any, file: any) => setUpload(config, scheme, response, file)
      listeners.onDeleteUpload = (file, fileList) => deleteUpload(config, scheme, file, fileList)
      listeners.onOtherChange = (event, config) => setOtherValueLabel(event, config)
      listeners.onPrev = page => prevPage(page)
      listeners.onNext = page => nextPage(page)
      console.log('+++++++++++++++++++++++++', listeners)
      return listeners
    }

    function renderChildren(scheme: any) {
      const config = scheme.__config__
      if (!Array.isArray(config.children)) return null
      return renderFormItem(config.children)
    }

    const layouts = {
      colFormItem(scheme: any) {
          const config = scheme.__config__
          const listeners = buildListeners(scheme)
          let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
          if (config.showLabel === false) labelWidth = '0'
          let label = config.label
          // 显示序号
          if (state.formConfCopy.showNumber) {
              label = scheme.serialNumber + ': ' + label
          }
          // 分页返回上一页时把值设置回表单
          let value = _.get(state[formModelKey.value], scheme.__vModel__)
          if (value) {
              config.defaultValue = value
          }
          // 逻辑隐藏后赋值默认值
          if (!config.logicShow) {
              config.defaultValue = value
          }
          // 表单被重新渲染 控制逻辑显示隐藏
          let triggerShow = _.indexOf(state.logicTriggerItemList, config.formId) > -1
          let colStyle = scheme.logicShow || triggerShow ? '' : 'display:none'
          let cidAttr = config.formId
          return (
            <el-col span={config.span} style={colStyle} cid={cidAttr}>
              <el-form-item
                label-width={labelWidth}
                prop={scheme.__vModel__}
                label={config.showLabel ? label : ''}
              >
                <render conf={scheme} {...listeners} />
              </el-form-item>
            </el-col>
          )
      },
      rowFormItem(scheme: any) {
          let child = renderChildren(arguments as any)
          if (scheme.type === 'flex') {
            child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
              {child}
            </el-row>
          }
          return (
            <el-col span={scheme.span}>
              <el-row gutter={scheme.gutter}>
                {child}
              </el-row>
            </el-col>
          )
      }
    }

    function renderFormItem(elementList: any) {
      return elementList.map((scheme: any) => {
        const config = scheme.__config__
        const layout = (layouts as any)[config.layout]
        if (layout) {
          return layout(scheme)
        }
        throw new Error(`没有与${config.layout}匹配的layout`)
      })
    }

    function resetForm() {
      state.formConfCopy = deepClone(props.formConf)
      formRef.value.resetFields()
    }

    function submitForm() {
      formRef.value.validate((valid: any) => {
        if (!valid) {
          // 未选中自动高亮
          // if (document.getElementsByClassName('el-form-item__error').length > 0) {
          //
          // }
          setTimeout(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input')?.focus()
          }, 100)
          return false
        }
        // 触发sumit事件
        if (props.onSubmit) {
          props.onSubmit({ formModel: state[formModelKey.value], labelFormModel: state[labelFormModelKey.value] })
        }
        // this.$emit('submit', {
        //   formModel: this[this.formConf.formModel],
        //   labelFormModel: this[this.formConf.labelFormModel]
        // })
        return true
      })
    }

    function formBtns() {
      let style = {
        'background-color': state.formConfCopy.submitBtnColor,
        'border-color': state.formConfCopy.submitBtnColor
      }
      let btnSpan = 24
      if (state.formConfCopy.resetBtn) {
        return <el-col class='footer-btns'>
          <el-form-item size="large" style="margin-top:30px">
            <el-row>
              <el-col span="4" offset="6">
                <el-button type="primary" onClick={submitForm}>提交</el-button>
              </el-col>
              <el-col span="9" offset="3">
                <el-button onClick={resetForm}>重置</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      }
      return <el-col>
        <el-form-item size="large" class="submit-btn-form-item" style="margin-top:30px;">
          <el-row type="flex" justify="center">
            <el-col span={btnSpan}>
              <el-button style={style} type="primary" onClick={submitForm}>{ state.formConfCopy.submitBtnText}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    }

    function renderFrom() {
      return (
        <el-row gutter={state.formConfCopy.gutter} class={style['render-wrap']}>
          <el-form
            size={state.formConfCopy.size}
            label-position={state.formConfCopy.labelPosition}
            disabled={state.formConfCopy.disabled}
            label-width={`${state.formConfCopy.labelWidth}px`}
            ref={formRef}
            // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
            model={state[formModelKey.value]}
            rules={state[formRulesKey.value]}
          >
            { renderFormItem(state.formConfCopy.fields) }
            { state.formConfCopy.formBtns && formBtns() }
          </el-form>
        </el-row>
      )
    }

    watchEffect(() => {
      console.log(state)
    })

    return () => renderFrom()
  }
})
