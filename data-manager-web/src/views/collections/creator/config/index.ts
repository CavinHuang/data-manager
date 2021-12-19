import { personalInfoComponents, inputComponents, imageComponents, assistComponents, selectComponents } from './components'

export const leftComponents = [
  {
    title: '个人信息',
    list: personalInfoComponents
  },
  {
    title: '选择题',
    list: selectComponents
  },
  {
    title: '输入型组件',
    list: inputComponents
  },
  // {
  //   title: '图片型组件',
  //   list: imageComponents
  // },
  {
    title: '辅助型组件',
    list: assistComponents
  }
]

export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'mini',
  labelPosition: 'top',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 20,
  disabled: false,
  span: 24,
  title: '问卷名称',
  description: '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位\n' +
  '用户的宝贵意见，期待您的参与！现在我们就马上开始吧！',
  formBtns: true,
  unFocusedComponentBorder: true
}
