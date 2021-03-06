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
      // ??????????????????????????????
      logicTriggerItemList: [] as any[]
    })
    const formRef = ref<any>(null)

    function initFormData(componentList: any[], formData: any) {
      // ???????????????
      componentList.forEach(cur => {
        const config = cur.__config__
        if (cur.__vModel__ && !formData[cur.__vModel__]) {
            // ????????????????????????????????? ?????????????????????
            formData[cur.__vModel__] = config.defaultValue
        }
        if (config.children) initFormData(config.children, formData)
      })
    }

    function initLabelFormData(componentList: any[], formData: any) {
      // ????????????????????????????????????
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
        // ????????????????????????????????????
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
        // ??????????????????????????????
        const validateOtherInput = (rule: any, value: any, callback: any) => {
          // 0 ??????????????????
          if (value == 0 || (Array.isArray(value) && value.includes(0))) {
            if (!state[labelFormModelKey.value][`${rule.field}other`]) {
              callback(new Error('?????????????????????'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
        if (Array.isArray(config.regList)) {
          // ???????????????????????????
          if (['RADIO', 'CHECKBOX'].includes(cur.typeId)) {
            const required = {validator: validateOtherInput, message: cur.placeholder}
            config.regList.push(required)
          }
          if (config.required) {
            const required = {required: config.required, message: cur.placeholder} as any
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `?????????????????????${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}????????????`)
            config.regList.push(required)
          }
          // ???????????????????????????
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
     *  this.formConf.formModel ???????????????????????? ???checkbox radio????????? 1,2,3???
     *  this.formConf.labelFormModel ?????????????????? ???????????? ????????????
     * ???????????????label???
     * @param event
     * @param config
     * @param scheme
     */
    function setValueLabel(event: any, config: any, scheme: any) {
      // ????????????????????? ?????????input?????????????????????
      // @ts-ignore
      let tagOptionKey = processType[config.tag]
      if (tagOptionKey) {
        if (event instanceof Array) {
          // ?????? ?????????????????????
          let labelArr = new Array()
          if (!event.includes(0)) {
            // ?????????????????????????????????????????????other
            Object.assign(state[labelFormModelKey.value], {[`${scheme.__vModel__}other`]: ''})
            // this.$set(this[this.formConf.labelFormModel], `${scheme.__vModel__}other`, '')
            // ????????????????????????
            const tagElement = document.querySelector('.' + config.tag)
            if (tagElement) {
              let otherInput = tagElement.querySelector('.item-other-input') as HTMLInputElement
              if (otherInput) {
                otherInput.value = ''
              }
            }
          }
          event.forEach(item => {
            // ???????????? ????????????
            let { label } = getObject(_.get(scheme, tagOptionKey), 'value', item)
            labelArr.push(label)
          })
          Object.assign(state[labelFormModelKey.value], {[scheme.__vModel__]: labelArr.join(',')})
          // this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, labelArr.join(','))
        } else {
          // ?????? ?????????????????????
          if (event == 0) {
            console.log(state[labelFormModelKey.value][`${scheme.__vModel__}other`])
            // ???????????????????????????label??????field?????????????????????????????????fieldother??????
            let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
            state[labelFormModelKey.value][scheme.__vModel__] = item.label
            // this[this.formConf.labelFormModel].scheme.__vModel__ = item.label
            state[labelFormModelKey.value][`${scheme.__vModel__}other`] = state[labelFormModelKey.value][`${scheme.__vModel__}other`]
            // this[this.formConf.labelFormModel][`${scheme.__vModel__}other`] = this[this.formConf.labelFormModel][`${scheme.__vModel__}other`]
          } else {
            let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
            state[labelFormModelKey.value][scheme.__vModel__] = item.label
            // this[this.formConf.labelFormModel].scheme.__vModel__ = item.label
            // ????????????????????????????????????other
            state[labelFormModelKey.value][`${scheme.__vModel__}other`] = ''
            // this[this.formConf.labelFormModel][`${scheme.__vModel__}other`] = ''
            // ????????????????????????
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
      // ?????????????????????????????????????????? ????????????????????????
      let rules = _.get(logicShowRule, config.formId)
      if (rules && Array.isArray(rules)) {
        rules.forEach(r => {
          // ???????????????????????????????????????
          let flag = evalExpression(state[formModelKey.value], r.logicExpression)
          // let flag = evalExpression(this[this.formConf.formModel], r.logicExpression)
          // ??????????????????????????????
          let logicItem = props.formConf.fields.find((a: any) => a.formItemId == r.triggerFormItemId)
          // let logicItem = this.formConf.fields.find(a => a.formItemId == r.triggerFormItemId)
          if (flag) {
            // ???????????????????????? display?????????
            state.logicTriggerItemList.push(r.triggerFormItemId)
            console.log(state.logicTriggerItemList)
            const element = document.querySelector(`div[cid="${r.triggerFormItemId}"]`) as HTMLDivElement
            element.style.display = ''
            // ??????????????????
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
            // ??????????????????
            logicItem.logicShow = false
            state[formRulesKey.value] = {}
            logicRules(state.formConfCopy.fields, state[formRulesKey.value])
            // ?????????
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
     * radio checkbox ????????????????????????
     */
    function setOtherValueLabel(event: any, config: any) {
      let value = state[formModelKey.value][config.__vModel__]
      // ??????????????????????????????
      nextTick(() => {
        state[labelFormModelKey.value][`${config.__vModel__}other`] = event
        // this.$set(this[this.formConf.labelFormModel], `${config.__vModel__}other`, event)
        console.log(state[labelFormModelKey.value])
        setValueLabel(value, config.__config__, config)
      })
    }

    /**
     * ???????????????
     */
    function nextPage(page: any) {
      switchPage('Next', page)
    }

    /**
     * ???????????????
     */
    function prevPage(page: any) {
      switchPage('Prev', page)
    }

    /**
     * ?????????
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

      // ???__methods__??????????????????this???event
      Object.keys(methods).forEach(key => {
        listeners[key] = event => methods[key](event)
      })
      // ?????? render.js ?????? vModel $emit('input', val)
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
          // ????????????
          if (state.formConfCopy.showNumber) {
              label = scheme.serialNumber + ': ' + label
          }
          // ?????????????????????????????????????????????
          let value = _.get(state[formModelKey.value], scheme.__vModel__)
          if (value) {
              config.defaultValue = value
          }
          // ??????????????????????????????
          if (!config.logicShow) {
              config.defaultValue = value
          }
          // ????????????????????? ????????????????????????
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
        throw new Error(`?????????${config.layout}?????????layout`)
      })
    }

    function resetForm() {
      state.formConfCopy = deepClone(props.formConf)
      formRef.value.resetFields()
    }

    function submitForm() {
      formRef.value.validate((valid: any) => {
        if (!valid) {
          // ?????????????????????
          // if (document.getElementsByClassName('el-form-item__error').length > 0) {
          //
          // }
          setTimeout(() => {
            let isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input')?.focus()
          }, 100)
          return false
        }
        // ??????sumit??????
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
                <el-button type="primary" onClick={submitForm}>??????</el-button>
              </el-col>
              <el-col span="9" offset="3">
                <el-button onClick={resetForm}>??????</el-button>
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
            // model?????????????????? https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
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
