import { defineComponent, PropType, ref } from 'vue'

export const regList: Array<{ value: string,label: string, type: string }> = [
  {
    label: '文本',
    value: '',
    type: 'text'
  },
  {
    label: '手机号码',
    value: '/^1(3|4|5|7|8|9)\\d{9}$/',
    type: 'no'
  },
  {
    label: '座机号码',
    value: '/^(\(\\d{3,4}\)|\\d{3,4}-|\\s)?\\d{7,14}$/',
    type: 'no'
  },
  {
    label: '身份证号码',
    value: '/^\\d{15}$)|(^\\d{17}([0-9]|X)$/',
    type: 'no'
  },
  {
    label: '邮箱',
    value: '/\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\.\\w+([-.]\\w+)*/',
    type: 'no'
  },
  {
    label: '中文姓名',
    value: '/^[\\u4E00-\\u9FA5A-Za-z\\s]+(·[\\u4E00-\\u9FA5A-Za-z]+)*$/',
    type: 'no'
  },
  {
    label: 'QQ',
    value: '/[1-9][0-9]{4,}/',
    type: 'no'
  },
  {
    label: '邮政编码',
    value: '/[1-9]d{5}(?!d)/',
    type: 'no'
  },
  {
    label: '金额',
    value: '/^\d*(?:\.\d{0,2})?$/',
    type: 'number'
  },
  {
    label: '字母',
    value: '/^[a-zA-Z]*$/',
    type: 'text'
  },
  {
    label: '汉字',
    value: '/^[\u4e00-\u9fa5]{0,}$/',
    type: 'text'
  },
  {
    label: '正整数',
    value: '/^0$|^[1-9]\d*$/',
    type: 'number'
  }
]

export default defineComponent({
  name: 'RegList',
  props: {
    activeData: {
      type: Object as PropType<any>
    }
  },
  setup(props) {
    const addReg = () => {
      (props.activeData as any).__config__.regList.push({
        pattern: '',
        message: ''
      })
    }

    return () => (
      <>
        <el-divider>校验</el-divider>
        {
          (props.activeData as any).__config__.regList.map((item: any,index: number) => {
            return (
              <div
                key={index}
                class="reg-item"
              >
                <span
                  class="close-btn"
                  onClick={() => { (props.activeData as any).__config__.regList.splice(index,1) }}
                >
                  <i class="el-icon-close" />
                </span>
                <el-form-item label="表达式">
                  {item.custom ? <el-input modelValue={item.pattern} clearable onInput={(val: string) => item.pattern = val} placeholder="请输入正则" /> : <><el-select modelValue={item.pattern} onChange={(val: string) => { item.pattern = val}}>
                    {regList.map((item, index) => {
                      return (
                        <el-option
                          key={'select' + index}
                          label={item.label}
                          value={item.value}
                        />
                      )
                    })}
                  </el-select>
                  <el-button type='primary' class='custom-btn' onClick={() => { item.custom = true }}>自定义</el-button>
                  </>
                  }
                </el-form-item>
                <el-form-item label="错误提示" style="margin-bottom: 0">
                  <el-input modelValue={item.message} onInput={(val: string) => item.message = val} placeholder="请输入错误提示" />
                </el-form-item>
              </div>
            )
          })
        }
        <div style="margin-left: 20px">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            onClick={addReg}
          > 添加规则 </el-button>
        </div>
        <div style='color: red; line-height: 22px; font-size: 12px;'>注意：自定义正表达式为高度自定义写法，语法错误将有可能导致程序出错，非专业人员不要轻易尝试！</div>
      </>
    )
  }
})
