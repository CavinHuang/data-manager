import { deepClone } from "@/utils/index";
import render from "@/components/render/render";
const ruleTrigger = {
  "el-input": "blur",
  "el-input-number": "blur",
  "el-select": "change",
  "el-radio-group": "change",
  "el-checkbox-group": "change",
  "el-cascader": "change",
  "el-time-picker": "change",
  "el-date-picker": "change",
  "el-rate": "change",
};
const layouts = {
  colFormItem(h: any, scheme: any) {
    const config = scheme.__config__;
    const listeners = buildListeners.call(this, scheme);
    let labelWidth = config.labelWidth ? `${config.labelWidth}px` : null;
    if (config.showLabel === false) labelWidth = "0";
    return <el-col span={config.span}>
        <el-form-item label-width={labelWidth} prop={scheme.__vModel__}
          label={config.showLabel ? config.label : ''}>
          <render conf={scheme} on={listeners}  />
        </el-form-item>
      </el-col>
  },
  rowFormItem(h: any, scheme: any) {
    let child = renderChildren.apply(this, arguments as any)
    if (scheme.type === "flex") {
      child = <el-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
              {child}
            </el-row>
    }
    return <el-col span={scheme.span}>
        <el-row gutter={scheme.gutter}>
          {child}
        </el-row>
      </el-col>
  },
};
function renderFrom(h: any) {
  // @ts-ignore
  const { formConfCopy } = this;
  return (
    <el-row gutter={formConfCopy.gutter}>
      <el-form
        size={formConfCopy.size}
        label-position={formConfCopy.labelPosition}
        disabled={formConfCopy.disabled}
        label-width={`${formConfCopy.labelWidth}px`}
        ref={formConfCopy.formRef}
        // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
        // @ts-ignore
        model={this[formConfCopy.formModel]}
        // @ts-ignore
        rules={this[formConfCopy.formRules]}
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
function formBtns(h: any) {
  // @ts-ignore
 const {formConfCopy} = this
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
    const config = scheme.__config__;
    // @ts-ignore
    const layout = layouts[config.layout];
    if (layout) {
      // @ts-ignore
      return layout.call(this, h, scheme);
    }
    throw new Error(`没有与${config.layout}匹配的layout`);
  });
}
function renderChildren(h: any, scheme: any) {
  const config = scheme.__config__
  if (!Array.isArray(config.children)) return null;
  // @ts-ignore
  return renderFormItem.call(this, h, config.children);
}
function setValue(event: any, config: any, scheme: any) {
  console.log(1111)
  // @ts-ignore
  this.$set(config, "defaultValue", event);
  // @ts-ignore
  this.$set(this[this.formConf.formModel], scheme.__vModel__, event);
}
function buildListeners(scheme: any) {
  const config = scheme.__config__;
  // @ts-ignore
  const methods = this.formConf.__methods__ || {};
  const listeners = {};
  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach((key) => {
    // @ts-ignore
    listeners[key] = (event) => methods[key].call(this, event);
  });
  // 响应 render.js 中的 vModel $emit('input', val)
  // @ts-ignore
  listeners.input = (event) => setValue.call(this, event, config, scheme);
  return listeners;
}
export default {
  components: {
    render,
  },
  props: {
    formConf: {
      type: Object,
      required: true,
    },
  },
  data() {
    const data = {
      // @ts-ignore
      formConfCopy: deepClone(this.formConf),
      // @ts-ignore
      [this.formConf.formModel]: {},
      // @ts-ignore
      [this.formConf.formRules]: {},
    } as any;
    // @ts-ignore
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel]);
    // @ts-ignore
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules]);
    return data;
  },
  methods: {
    initFormData(componentList: any, formData: any) {
      componentList.forEach((cur: any) => {
        const config = cur.__config__;
        if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue;
        if (config.children) this.initFormData(config.children, formData);
      });
    },
    buildRules(componentList: any, rules: any) {
      componentList.forEach((cur: any) => {
        const config = cur.__config__;
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: cur.placeholder };
            if (Array.isArray(config.defaultValue)) {
              // @ts-ignore
              required.type = "array";
              required.message = `请至少选择一个${config.label}`;
            }
            required.message === undefined &&
              (required.message = `${config.label}不能为空`);
            config.regList.push(required);
          }
          rules[cur.__vModel__] = config.regList.map((item: any) => {
            item.pattern && (item.pattern = eval(item.pattern));
            // @ts-ignore
            item.trigger = ruleTrigger && ruleTrigger[config.tag];
            return item;
          });
        }
        if (config.children) this.buildRules(config.children, rules);
      });
    },
    resetForm() {
      // @ts-ignore
      this.formConfCopy = deepClone(this.formConf);
      // @ts-ignore
      this.$refs[this.formConf.formRef].resetFields();
    },
    submitForm() {
      // @ts-ignore
      this.$refs[this.formConf.formRef].validate((valid) => {
        if (!valid) return false;
        // 触发sumit事件
        // @ts-ignore
        this.$emit("submit", this[this.formConf.formModel]);
        return true;
      });
    },
  },
  render(h: any) {
    return renderFrom.call(this, h)
  },
}
