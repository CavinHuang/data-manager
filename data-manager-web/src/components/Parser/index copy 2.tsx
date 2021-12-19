import {deepClone} from '@/utils/index'
import {evalExpression} from '@/utils/expression'
import render from '@/components/render/render'
import _ from 'lodash'
import { componentDefaultValue } from '@/views/collections/creator/config/components'

const ruleTrigger = {
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

const processType = {
    'el-select': '__slot__.options',
    'el-cascader': 'options',
    'el-radio-group': '__slot__.options',
    'el-checkbox-group': '__slot__.options'
}

const layouts = {
    colFormItem(h: any, scheme: any) {
        const config = scheme.__config__
        const listeners = buildListeners.call(this, scheme)
        const {formConfCopy} = this as any
        let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null
        if (config.showLabel === false) labelWidth = '0'
        let label = config.label
        // 显示序号
        if (formConfCopy.showNumber) {
            label = scheme.serialNumber + ': ' + label
        }
        // 分页返回上一页时把值设置回表单
        // @ts-ignore
        let value = _.get(this[this.formConf.formModel], scheme.__vModel__)
        if (value) {
            config.defaultValue = value
        }
        // 逻辑隐藏后赋值默认值
        if (!config.logicShow) {
            config.defaultValue = value
        }
        // 表单被重新渲染 控制逻辑显示隐藏
        // @ts-ignore
        let triggerShow = _.indexOf(this.logicTriggerItemList, config.formId) > -1
        let colStyle = scheme.logicShow || triggerShow ? '' : 'display:none'
        let cidAttr = config.formId
        return (
            <el-col span={config.span} style={colStyle} cid={cidAttr}>
                <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
                    label={config.showLabel ? label : ''}>
                    <render conf={scheme} {...listeners} />
                </el-form-item>
            </el-col>
        )
    },
    rowFormItem(h: any, scheme: any) {
        let child = renderChildren.apply(this, arguments as any)
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

function renderFrom(h: any) {
    // @ts-ignore
    const {formConfCopy} = this as any

    return (
        <el-row gutter={formConfCopy.gutter}>
            <el-form
                size={formConfCopy.size}
                label-position={formConfCopy.labelPosition}
                disabled={formConfCopy.disabled}
                label-width={`${formConfCopy.labelWidth}px`}
                ref={formConfCopy.formRef}
                // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
                props={
                  // @ts-ignore
                  {model: this[formConfCopy.formModel]}
                }
                rules={
                  // @ts-ignore
                  this[formConfCopy.formRules]
                }
            >
                {
                  // @ts-ignore
                  renderFormItem.call(this, h, formConfCopy.fields)
                }
                {
                  // @ts-ignore
                  formConfCopy.formBtns && formBtns.call(this, h)
                }
            </el-form>
        </el-row>
    )
}

// eslint-disable-next-line no-unused-vars
function formBtns(h: any) {
    // @ts-ignore
    const {formConfCopy} = this as any
    let style = {
        'background-color': formConfCopy.submitBtnColor,
        'border-color': formConfCopy.submitBtnColor
    }
    let btnSpan = 24
    if (formConfCopy.resetBtn) {
        return <el-col>
            <el-form-item size="large" style="margin-top:30px">
                <el-row>
                    <el-col span="4" offset="6">
                        <el-button type="primary" onClick={
                          // @ts-ignore
                          this.submitForm
                        }>提交</el-button>
                    </el-col>
                    <el-col span="9" offset="3">
                        <el-button onClick={
                          // @ts-ignore
                          this.resetForm
                        }>重置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-col>
    }
    return <el-col>
        <el-form-item size="large" class="submit-btn-form-item" style="margin-top:30px;">
            <el-row type="flex" justify="center">
                <el-col span={btnSpan}>
                    <el-button style={style} type="primary"
                        onClick={
                          // @ts-ignore
                          this.submitForm
                        }>{
                          // @ts-ignore
                          this.formConfCopy.submitBtnText
                        }</el-button>
                </el-col>
            </el-row>
        </el-form-item>
    </el-col>

}

function renderFormItem(h: any, elementList: any) {
    return elementList.map((scheme: any) => {
        const config = scheme.__config__
        // @ts-ignore
        const layout = layouts[config.layout]

        if (layout) {
          // @ts-ignore
          return layout.call(this, h, scheme)
        }
        throw new Error(`没有与${config.layout}匹配的layout`)
    })
}

function renderChildren(h: any, scheme: any) {
    const config = scheme.__config__
    if (!Array.isArray(config.children)) return null
    // @ts-ignore
    return renderFormItem.call(this, h, config.children)
}

function setUpload(config: any, scheme: any, response: any, file: any) {
   // @ts-ignore
    let newValue = JSON.parse(this[this.formConf.formModel][scheme.__vModel__])
    if (!newValue) {
        newValue = []
    }
    newValue.push({fileName: file.name, url: response.data})
    // @ts-ignore
    this.$set(config, 'defaultValue', newValue)
    // @ts-ignore
    this.$set(this[this.formConf.formModel], scheme.__vModel__, newValue)
    // @ts-ignore
    setValueLabel.call(this, {type: 'file', files: newValue}, config, scheme)
}

function deleteUpload(config: any, scheme: any, file: any, fileList: any) {
    let newValue: any[] = []
    fileList.forEach((element: any) => {
        newValue.push({fileName: element.name, url: element.url})
    })
    // @ts-ignore
    this.$set(config, 'defaultValue', newValue)
    // @ts-ignore
    this.$set(this[this.formConf.formModel], scheme.__vModel__, newValue)
    // @ts-ignore
    setValueLabel.call(this, {type: 'file', files: newValue}, config, scheme)
}

function setValue(event: any, config: any, scheme: any) {
    // @ts-ignore
    config.defaultValue = event
    // @ts-ignore
    this[this.formConf.formModel][scheme.__vModel__] = event
    // @ts-ignore
    setValueLabel.call(this, event, config, scheme)
    // @ts-ignore
    let logicShowRule = this.formConfCopy.logicShowRule
    if (!logicShowRule) {
        return
    }
    // 找到该问题需要触发显示的问题 判断逻辑是否成立
    let rules = _.get(logicShowRule, config.formId)
    if (rules && Array.isArray(rules)) {
        rules.forEach(r => {
            // 成立让该对应的问题显示出来
    // @ts-ignore
            let flag = evalExpression(this[this.formConf.formModel], r.logicExpression)
            // 参与逻辑设置的表单项
    // @ts-ignore
            let logicItem = this.formConf.fields.find(a => a.formItemId == r.triggerFormItemId)
            if (flag) {
                // 防止表单重新渲染 display被刷新
    // @ts-ignore
                this.logicTriggerItemList.push(r.triggerFormItemId)
    // @ts-ignore
                console.log(this.logicTriggerItemList)
    // @ts-ignore
                document.querySelector(`div[cid="${r.triggerFormItemId}"]`).style.display = ''
                // 重置逻辑校验
                logicItem.logicShow = true
    // @ts-ignore
                this[this.formConf.formRules] = {}
    // @ts-ignore
                this.logicRules(this.formConfCopy.fields, this[this.formConf.formRules])
            } else {
    // @ts-ignore
                _.remove(this.logicTriggerItemList, function(n) {
                    return n == r.triggerFormItemId
                })
    // @ts-ignore
                document.querySelector(`div[cid="${r.triggerFormItemId}"]`).style.display = 'none'
                // 隐藏表单校验
                logicItem.logicShow = false
    // @ts-ignore
                this[this.formConf.formRules] = {}
    // @ts-ignore
                this.logicRules(this.formConfCopy.fields, this[this.formConf.formRules])
                // 默认值
    // @ts-ignore
                let resetValConfig = componentDefaultValue[logicItem.typeId]
                if (resetValConfig) {
    // @ts-ignore
                  this[this.formConf.labelFormModel][logicItem.__vModel__] = resetValConfig.val
    // @ts-ignore
                  this[this.formConfCopy.labelFormModel][logicItem.__vModel__] = resetValConfig.val
                }
            }
        })
    }
}

/**
 * 分页下一页
 */
function nextPage(page: any) {
    // @ts-ignore
    switchPage.call(this, 'next', page)
}

/**
 * 分页上一页
 */
function prevPage(page: any) {
    // @ts-ignore
    switchPage.call(this, 'prev', page)
}

/**
 * 切换页
 */
function switchPage(eventName: any, page: any) {
    // @ts-ignore
    this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) {
            setTimeout(() => {
                let isError = document.getElementsByClassName('is-error')
    // @ts-ignore
                isError[0].querySelector('input').focus()
            }, 100)
            return false
        } else {
    // @ts-ignore
            this.$emit(eventName, {
                page: page,
    // @ts-ignore
                formModel: this[this.formConf.formModel],
    // @ts-ignore
                labelFormModel: this[this.formConf.labelFormModel]
            })
        }
        return true
    })
}

/**
 * radio checkbox 其他输入框值处理
 */
function setOtherValueLabel(event: any, config: any) {
    // @ts-ignore
    let value = this[this.formConf.formModel][config.__vModel__]
    // 临时保存其他的选项值
    // @ts-ignore
    this.$nextTick(() => {
    // @ts-ignore
        this.$set(this[this.formConf.labelFormModel], `${config.__vModel__}other`, event)
    // @ts-ignore
        console.log(this[this.formConf.labelFormModel])
    // @ts-ignore
        setValueLabel.call(this, value, config.__config__, config)
    })

}

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
    // @ts-ignore
                this.$set(this[this.formConf.labelFormModel], `${scheme.__vModel__}other`, '')
                // 同时把输入框清空
    // @ts-ignore
                let otherInput = document.querySelector('.' + config.tag).querySelector('.item-other-input')
                if (otherInput) {
    // @ts-ignore
                    otherInput.value = ''
                }
            }
            event.forEach(item => {
                // 拼到头部 其他选项
    // @ts-ignore
                let {label} = getObject(_.get(scheme, tagOptionKey), 'value', item)
                labelArr.push(label)
            })
    // @ts-ignore
            this.$set(this[this.formConf.labelFormModel], scheme.__vModel__, labelArr.join(','))
        } else {
            // 单选 其他自定义输入
            if (event == 0) {
    // @ts-ignore
                console.log(this[this.formConf.labelFormModel][`${scheme.__vModel__}other`])
                // 如果选择了其他，把label存在field字段，把输入框内容存在fieldother字段
                let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
    // @ts-ignore
              this[this.formConf.labelFormModel].scheme.__vModel__ = item.label
    // @ts-ignore
              this[this.formConf.labelFormModel][`${scheme.__vModel__}other`] = this[this.formConf.labelFormModel][`${scheme.__vModel__}other`]
            } else {
                let item = _.find(_.get(scheme, tagOptionKey), {'value': event})
    // @ts-ignore
              this[this.formConf.labelFormModel].scheme.__vModel__ = item.label
                // 如果没有选择其他，就清掉other
    // @ts-ignore
              this[this.formConf.labelFormModel][`${scheme.__vModel__}other`] = ''
                // 同时把输入框清空
    // @ts-ignore
                let otherInput = document.querySelector('.' + config.tag).querySelector('.item-other-input')
                if (otherInput) {
    // @ts-ignore
                    otherInput.value = ''
                }
            }
        }
    } else if (config.tag === 'el-upload') {
      // @ts-ignore
      this[this.formConf.labelFormModel].scheme.__vModel__ = event
    } else {
      // @ts-ignore
      this[this.formConf.labelFormModel].scheme.__vModel__ = event
    }
}

function getObject(array: any, key: any, value: any) {
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

function buildListeners(scheme: any) {
    const config = scheme.__config__
    // @ts-ignore
    const methods = this.formConf.__methods__ || {}
    const listeners = {}

    // 给__methods__中的方法绑定this和event
    Object.keys(methods).forEach(key => {
    // @ts-ignore
        listeners[key] = event => methods[key].call(this, event)
    })
    // 响应 render.js 中的 vModel $emit('input', val)
    // @ts-ignore
    listeners.onInput = event => setValue.call(this, event, config, scheme)
    // @ts-ignore
    listeners.onUpload = (response, file, fileList) => setUpload.call(this, config, scheme, response, file, fileList)
    // @ts-ignore
    listeners.onDeleteUpload = (file, fileList) => deleteUpload.call(this, config, scheme, file, fileList)
    // @ts-ignore
    listeners.onOtherChange = (event, config) => setOtherValueLabel.call(this, event, config)
    // @ts-ignore
    listeners.onPrev = page => prevPage.call(this, page)
    // @ts-ignore
    listeners.onNext = page => nextPage.call(this, page)
    console.log('+++++++++++++++++++++++++', listeners)
    return listeners
}

export default {
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
        }
    },
    // @ts-ignore
    data() {
    // @ts-ignore
        const data = {
    // @ts-ignore
            formConfCopy: deepClone(this.formConf),
    // @ts-ignore
            [this.formConf.formModel]: deepClone(this.formModel),
    // @ts-ignore
            [this.formConf.labelFormModel]: deepClone(this.labelFormModel),
    // @ts-ignore
            [this.formConf.formRules]: {},
            // 已经被触发显示的问题
            logicTriggerItemList: []
        }
    // @ts-ignore
        this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
    // @ts-ignore
        this.initLabelFormData(data.formConfCopy.fields, data[this.formConf.labelFormModel])
    // @ts-ignore
        this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])
        return data
    },
    methods: {
    // @ts-ignore
        initLabelFormData(componentList, formData) {
            // 获取选择项选中的显示的值
            componentList.forEach((cur: any) => {
                let temConfig = cur.__config__
                if (cur.__vModel__ && !formData[cur.__vModel__]) {
    // @ts-ignore
                    let tagOptionKey = processType[temConfig.tag]
                    let defaultValue = temConfig.defaultValue
                    let labelStr = ''
                    if (tagOptionKey && defaultValue) {
                        if (defaultValue instanceof Array) {
                            defaultValue.forEach(item => {
                                if (item) {
                                    let labelItem = getObject(_.get(cur, tagOptionKey), 'value', item)
                                    if (labelItem) {
    // @ts-ignore
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
                if (temConfig.children) this.initLabelFormData(temConfig.children, formData)
            })
        },
    // @ts-ignore
        initFormData(componentList, formData) {
            // 设置默认值
    // @ts-ignore
            componentList.forEach(cur => {
                const config = cur.__config__
                if (cur.__vModel__ && !formData[cur.__vModel__]) {
                    // 如果存在分页带回的数据 则不再设置默认
                    formData[cur.__vModel__] = config.defaultValue
                }
                if (config.children) this.initFormData(config.children, formData)
            })
        },
    // @ts-ignore
        buildRules(componentList, rules) {
    // @ts-ignore
            componentList.forEach(cur => {
                // 逻辑不显示必填问题不校验
    // @ts-ignore
                let triggerShow = _.indexOf(this.logicTriggerItemList, cur.formItemId) > -1
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
    // @ts-ignore
                const validateOtherInput = (rule, value, callback) => {
                    // 0 等于选中其他
                    if (value == 0 || (Array.isArray(value) && value.includes(0))) {
    // @ts-ignore
                        if (!this[this.formConf.labelFormModel][`${rule.field}other`]) {
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
                        const required = {required: config.required, message: cur.placeholder}
                        if (Array.isArray(config.defaultValue)) {
    // @ts-ignore
                            required.type = 'array'
                            required.message = `请至少选择一个${config.label}`
                        }
                        required.message === undefined && (required.message = `${config.label}不能为空`)
                        config.regList.push(required)
                    }
                    // 显示时使用表单校验
                    if (!flag) {
    // @ts-ignore
                        rules[cur.__vModel__] = config.regList.map(item => {
                            item.pattern && (item.pattern = eval(item.pattern))
    // @ts-ignore
                            item.trigger = ruleTrigger && ruleTrigger[config.tag]
                            return item
                        })
                    }
                }
                if (config.children) this.buildRules(config.children, rules)
            })
        },
        // 重建逻辑规则的表单校验
    // @ts-ignore
        logicRules(componentList, rules) {
    // @ts-ignore
            componentList.forEach(cur => {
    // @ts-ignore
                let triggerShow = _.indexOf(this.logicTriggerItemList, cur.formItemId) > -1
                let flag = cur.logicShow || triggerShow ? '' : 'display:none'
                const config = cur.__config__
                if (!flag) {
    // @ts-ignore
                    rules[cur.__vModel__] = config.regList.map(item => {
    // @ts-ignore
                        item.pattern && (item.pattern = eval(item.pattern))
    // @ts-ignore
                        item.trigger = ruleTrigger && ruleTrigger[config.tag]
                        return item
                    })
                }
            })
        },
        resetForm() {
    // @ts-ignore
            this.formConfCopy = deepClone(this.formConf)
    // @ts-ignore
            this.$refs[this.formConf.formRef].resetFields()
        },
        submitForm() {
    // @ts-ignore
            this.$refs[this.formConf.formRef].validate(valid => {
                if (!valid) {
                    // 未选中自动高亮
                    // if (document.getElementsByClassName('el-form-item__error').length > 0) {
                    //
                    // }
                    setTimeout(() => {
                        let isError = document.getElementsByClassName('is-error')
    // @ts-ignore
                        isError[0].querySelector('input').focus()
                    }, 100)
                    return false
                }
                // 触发sumit事件
    // @ts-ignore
                this.$emit('submit', {
    // @ts-ignore
                    formModel: this[this.formConf.formModel],
    // @ts-ignore
                    labelFormModel: this[this.formConf.labelFormModel]
                })
                return true
            })
        }
    },
    render(h: any) {
        return renderFrom.call(this, h)
    }
}
