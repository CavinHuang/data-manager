/*
 * @Author: your name
 * @Date: 2021-10-12 22:07:36
 * @LastEditTime: 2021-10-23 21:33:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\components\render\slots\personal-information.tsx
 */
/**
 * 个人信息渲染
 */

type TOption = {
  label: string
  field: string
  value: string
  placeholder: string
  labelWidth: number
}

export default function (h: any, conf: any) {
  const renderContent = (defaultValue: any, onInput: any) => {
    const options = conf.__slot__.options as TOption[]
    if (options) {
      const inputChange = (val: string, index: number) => {
        defaultValue[index] = val
        onInput && onInput(defaultValue)
      }
      return options.map((item, index) => {
        const style: any = {}
        if (item.labelWidth) {
          style.width = item.labelWidth + 'px'
        }
        return (
          <div class='personal-item'>
            <div class='personal-label' style={style}>{item.label}：</div>
            <div class='personal-value'>
              <el-input modelValue={defaultValue[index]} onInput={ (val: string) => { inputChange(val, index) } } placeholder={item.placeholder} clearable />
            </div>
          </div>
        )
      })
    }
  }
  return { default: renderContent }
}
