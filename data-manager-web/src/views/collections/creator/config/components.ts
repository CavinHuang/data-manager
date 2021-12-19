// 个人信息组件
export const personalInfoComponents = [
  {
    __config__: {
      typeId: 'INPUT',
      label: '姓名',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [{
          pattern: '/^[\\u4E00-\\u9FA5A-Za-z\\s]+(·[\\u4E00-\\u9FA5A-Za-z]+)*$/',
          message: '请输入正确的姓名'
      }]
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: '请输入姓名',
    style: {width: '100%'},
    clearable: true,
    'prefix-icon': 'el-icon-user',
    'suffix-icon': '',
    maxlength: 11,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      typeId: 'PERSONNAL_INFOMATION',
      label: '个人信息',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'personal-information',
      tagIcon: 'input',
      defaultValue: [1, 2, 3],
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: false,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    __slot__: {
      options: [
        {
          label: '姓名',
          placeholder: '请输入姓名'
        },
        {
          label: '部门',
          placeholder: '请输入部门'
        },
        {
          label: '员工编号',
          placeholder: '请输入员工编号'
        },
      ]
    },
    style: {width: '100%'}
  },
  {
    __config__: {
      typeId: 'INPUT',
      label: '手机号',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [{
          pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
          message: '手机号格式错误'
      }]
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: '请输入手机号',
    style: {width: '100%'},
    clearable: true,
    'prefix-icon': 'el-icon-mobile',
    'suffix-icon': '',
    maxlength: 11,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '手机号验证',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'phone-verification',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: false,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    placeholder: '请验证手机号',
    style: {width: '100%'}
  },
  {
    __config__: {
      typeId: 'RADIO',
      label: '性别',
      labelWidth: null,
      showLabel: true,
      showRegList: false,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },
    __slot__: {
      options: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      typeId: 'RADIO',
      label: '年龄段',
      labelWidth: null,
      showLabel: true,
      showRegList: false,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },
    __slot__: {
      options: [{
          label: '18岁以下',
          value: 1
      }, {
          label: '18~25',
          value: 2
      }, {
          label: '26~30',
          value: 3
      }, {
          label: '31~40',
          value: 4
      }, {
          label: '41~50',
          value: 5
      }, {
          label: '51~60',
          value: 6
      }, {
          label: '60以上',
          value: 7
      }]
    },
    style: {},
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      typeId: 'INPUT',
      label: '邮箱',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [{
          pattern: '/^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$/',
          message: '邮箱格式错误'
      }]
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: '请输入邮箱',
    style: {width: '100%'},
    clearable: true,
    'prefix-icon': 'el-icon-message',
    'suffix-icon': '',
    maxlength: 24,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      type: 'INPUT',
      label: '身份证',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [{
          pattern: '/(^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$)|(^[1-9]\\d{5}\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}$)/',
          message: '身份证格式错误'
      }]
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    placeholder: '请输入身份证',
    style: {width: '100%'},
    clearable: true,
    'prefix-icon': 'el-icon-postcard',
    'suffix-icon': '',
    maxlength: 18,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      typeId: 'CASCADER',
      label: '省市联动',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'province-city',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: false,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    placeholder: '请选择省市县',
    style: {width: '100%'}
  },
  // {
  //
  //     __config__: {
  //         label: '地理位置',
  //         labelWidth: null,
  //         showLabel: true,
  //         changeTag: false,
  //         tag: 'input-map',
  //         tagIcon: 'input',
  //         defaultValue: undefined,
  //         required: true,
  //         layout: 'colFormItem',
  //         span: 24,
  //         showRegList: false,
  //         regList: [],
  //         document: 'https://element.eleme.cn/#/zh-CN/component/input'
  //     },
  //     placeholder: '请选择位置',
  //     style: {width: '100%'}
  // },
  {
    __config__: {
      typeId: 'TIME',
      label: '时间',
      tag: 'el-time-picker',
      tagIcon: 'time',
      defaultValue: null,
      span: 24,
      showLabel: true,
      showRegList: false,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    placeholder: '请选择',
    style: {width: '100%'},
    disabled: false,
    clearable: true,
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      typeId: 'TIME',
      label: '时间范围',
      tag: 'el-time-picker',
      tagIcon: 'time-range',
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      defaultValue: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    style: {width: '100%'},
    disabled: false,
    clearable: true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      typeId: 'DATE',
      label: '日期',
      tag: 'el-date-picker',
      tagIcon: 'date',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    placeholder: '请选择',
    type: 'date',
    style: {width: '100%'},
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      typeId: 'DATE_RANGE',
      label: '日期范围',
      tag: 'el-date-picker',
      tagIcon: 'date-range',
      defaultValue: null,
      showRegList: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: 'colFormItem',
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    style: {width: '100%'},
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      typeId: 'INPUT',
      label: '高校',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      showRegList: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
    },
    // 组件的插槽属性
    __slot__: {
        prepend: '',
        append: ''
    },
    placeholder: '请输入您所在或者毕业的高校名称',
    style: {width: '100%'},
    clearable: true,
    'prefix-icon': 'el-icon-school',
    'suffix-icon': '',
    maxlength: 11,
    'show-word-limit': true,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      typeId: 'SELECT',
      label: '职业',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __slot__: {
      options: [{
        label: '全日制学生',
        value: 1
      }, {
        label: '生产人员',
        value: 2
      }, {
        label: '销售人员',
        value: 3
      }, {
        label: '市场/公关人员',
        value: 4
      }, {
        label: '客服人员',
        value: 5
      }, {
        label: '行政/后勤人员',
        value: 6
      }, {
        label: '人力资源',
        value: 7
      }, {
        label: '财务/审计人员',
        value: 8
      }, {
        label: '文职/办事人员',
        value: 9
      }, {
        label: '技术/研发人员',
        value: 10
      }, {
        label: '管理人员',
        value: 11
      }, {
        label: '教师',
        value: 12
      }, {
        label: '顾问/咨询',
        value: 13
      }, {
        label: '专业人士(如会计师、律师、建筑师、医护人员、记者等)',
        value: 14
      }, {
        label: '其他',
        value: 15
      }]
    },
    placeholder: '请选择',
    style: {width: '100%'},
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  },
]

// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      typeId: 'INPUT',
      label: '单行文本',
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: []
  },
  // 组件的插槽属性
  __slot__: {
    prepend: '',
    append: ''
  },
  // 其余的为可直接写在组件标签上的属性
  placeholder: '请输入',
  style: {width: '100%'},
  clearable: true,
  'prefix-icon': '',
  'suffix-icon': '',
  maxlength: null,
  'show-word-limit': false,
  readonly: false,
  disabled: false
  },
  {
    __config__: {
      typeId: 'TEXTAREA',
      label: '多行文本',
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    type: 'textarea',
    placeholder: '请输入',
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: {width: '100%'},
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      typeId: 'NUMBER_INPUT',
      label: '计数器',
      showLabel: true,
      changeTag: true,
      labelWidth: null,
      tag: 'el-input-number',
      tagIcon: 'number',
      defaultValue: undefined,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'https://element.eleme.cn/#/zh-CN/component/input-number'
    },
    placeholder: '',
    min: undefined,
    max: undefined,
    step: 1,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false
  }
]

// 图片型组件 【左面板】
export const imageComponents = [
  {
    __config__: {
      typeId: 'IMAGE',
      label: '图片展示',
      showLabel: false,
      displayType: true,
      labelWidth: null,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: 'el-image',
      tagIcon: 'image',
      layout: 'colFormItem',
      span: 24,
      required: false,
      regList: [],
      changeTag: true
    },
    __slot__: {
      'error': 'image'
    },
    style: {width: '100%'},
    src: '',
    fit: 'contain',
    alt: ''
  },
  {
    __config__: {
      typeId: 'IMAGE_CAROUSEL',
      label: '图片轮播',
      showLabel: false,
      displayType: true,
      labelWidth: null,
      defaultValue: null,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: 'el-carousel',
      tagIcon: 'image-carousel',
      layout: 'colFormItem',
      span: 24,
      required: false,
      regList: [],
      changeTag: true
    },
    __slot__: {
        options: [{
            label: '文字',
            image: ''
        }]
    },
    style: {width: '100%'}
  },
  {
    __config__: {
      typeId: 'IMAGE_SELECT',
      label: '图片选择',
      showLabel: true,
      labelWidth: null,
      defaultValue: null,
      showDefaultValue: true,
      showRequired: true,
      showClearable: false,
      showRegList: false,
      tag: 'image-select',
      tagIcon: 'image-select',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true
    },
    multiple: false,
    options: [{
      label: '选项1',
      value: 1
    }],
    style: {width: '100%'}
  }
]

// 辅助型组件 【左面板】
export const assistComponents = [
  {
    __config__: {
      typeId: 'DESC_TEXT',
      label: '文字描述',
      defaultValue: '描述文字',
      displayType: true,
      showDefaultValue: true,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: 'desc-text',
      tagIcon: 'text',
      layout: 'colFormItem',
      span: 24,
      required: false,
      regList: [],
      changeTag: false
    },
    color: '',
    textAlign: 'left',
    style: {width: '100%'}
  },
  {
    __config__: {
      typeId: 'DIVIDER',
      label: '分割线',
      defaultValue: '',
      displayType: true,
      showLabel: false,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: 'el-divider',
      tagIcon: 'divider',
      layout: 'colFormItem',
      span: 24,
      required: false,
      regList: [],
      changeTag: false
    },
    color: '#000000',
    style: {width: '100%'},
    action: '/project/file/upload/'
  },
  {
    __config__: {
      typeId: 'SIGN_PAD',
      label: '手写签名',
      defaultValue: '',
      showLabel: true,
      showDefaultValue: true,
      showRequired: true,
      showClearable: false,
      showRegList: false,
      tag: 'sign-pad',
      tagIcon: 'sign-pad',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: false
    },
    color: '#000000',
    style: {width: '100%'},
    action: '/project/file/upload/'
  },
  {
    __config__: {
      typeId: 'PAGINATION',
      label: '分页',
      defaultValue: '分页',
      displayType: true,
      showLabel: false,
      showDefaultValue: false,
      showRequired: false,
      showClearable: false,
      showRegList: false,
      tag: 'pagination',
      tagIcon: 'page',
      layout: 'colFormItem',
      span: 24,
      required: false,
      regList: [],
      changeTag: false
    },
    prev: true,
    currPage: true,
    totalPage: true,
    currPageNum: 1,
    totalPageNum: 1,
    style: {width: '100%'}
  }
]

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      typeId: 'SELECT',
      label: '下拉选择',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    placeholder: '请选择',
    style: {width: '100%'},
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  },
  {
    __config__: {
      typeId: 'CASCADER',
      label: '级联选择',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataKey: 'list',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'cascader',
      layout: 'colFormItem',
      defaultValue: [],
      dataType: 'static',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
    },
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
          id: 2,
          value: 2,
          label: '选项1-1'
      }]
    }],
    placeholder: '请选择',
    style: {width: '100%'},
    props:{
      multiple: false,
      label: 'label',
      value: 'value',
      children: 'children'
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      typeId: 'RADIO',
      label: '单选框组',
      labelWidth: null,
      showLabel: true,
      showRegList: false,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },
    __slot__: {
        options: [{
            label: '选项一',
            value: 1
        }, {
            label: '选项二',
            value: 2
        }]
    },
    style: {},
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      typeId: 'CHECKBOX',
      label: '多选框组',
      tag: 'el-checkbox-group',
      tagIcon: 'checkbox',
      defaultValue: [],
      span: 24,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: true,
      regList: [],
      changeTag: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'medium',
    min: null,
    max: null,
    disabled: false
  },
  {
    __config__: {
      typeId: 'SWITCH',
      label: '开关',
      tag: 'el-switch',
      tagIcon: 'switch',
      defaultValue: false,
      span: 24,
      showRegList: false,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/switch'
    },
    style: {},
    disabled: false,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false
  },
  {
    __config__: {
      typeId: 'SLIDER',
      label: '滑块',
      tag: 'el-slider',
      tagIcon: 'slider',
      defaultValue: null,
      showRegList: false,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/slider'
    },
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false
  },
  {
    __config__: {
      typeId: 'TIME',
      label: '时间选择',
      tag: 'el-time-picker',
      tagIcon: 'time',
      defaultValue: null,
      span: 24,
      showLabel: true,
      showRegList: false,
      layout: 'colFormItem',
      labelWidth: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    placeholder: '请选择',
    style: {width: '100%'},
    disabled: false,
    clearable: true,
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      typeId: 'TIME_RANGE',
      label: '时间范围',
      tag: 'el-time-picker',
      tagIcon: 'time-range',
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      defaultValue: null,
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
    },
    style: {width: '100%'},
    disabled: false,
    clearable: true,
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      typeId: 'DATE',
      label: '日期选择',
      tag: 'el-date-picker',
      tagIcon: 'date',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    placeholder: '请选择',
    type: 'date',
    style: {width: '100%'},
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      typeId: 'DATE_RANGE',
      label: '日期范围',
      tag: 'el-date-picker',
      tagIcon: 'date-range',
      defaultValue: null,
      showRegList: false,
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: 'colFormItem',
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    style: {width: '100%'},
    type: 'daterange',
    'range-separator': '至',
    'start-placeholder': '开始日期',
    'end-placeholder': '结束日期',
    disabled: false,
    clearable: true,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false
  },
  {
    __config__: {
      typeId: 'RATE',
      label: '评分',
      tag: 'el-rate',
      tagIcon: 'rate',
      defaultValue: 0,
      span: 24,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/rate'
    },
    style: {},
    max: 5,
    'allow-half': false,
    'show-text': false,
    'show-score': false,
    disabled: false
  },
  {
    __config__: {
      typeId: 'COLOR',
      label: '颜色选择',
      tag: 'el-color-picker',
      tagIcon: 'color',
      span: 24,
      defaultValue: null,
      showLabel: true,
      showRegList: false,
      labelWidth: null,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/color-picker'
    },
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    size: 'medium'
  },
  {
    __config__: {
      typeId: 'UPLOAD',
      label: '上传',
      tag: 'el-upload',
      tagIcon: 'upload',
      layout: 'colFormItem',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      required: true,
      span: 24,
      showTip: false,
      buttonText: '点击上传',
      regList: [],
      changeTag: true,
      fileSize: 2,
      sizeUnit: 'MB',
      document: 'https://element-plus.gitee.io/#/zh-CN/component/upload'
    },
    __slot__: {
      'list-type': true
    },
    action: 'https://jsonplaceholder.typicode.com/posts/',
    disabled: false,
    accept: '',
    name: 'file',
    'auto-upload': true,
    'list-type': 'text',
    multiple: false
  }
]

// 组件默认值
export const componentDefaultValue = {
  INPUT: {
    val: undefined
  },
  TEXTAREA: {
    val: undefined
  },
  NUMBER_INPUT: {
    val: undefined
  },
  CASCADER: {
    val: []
  },
  RADIO: {
    val: undefined
  },
  CHECKBOX: {
    val: []
  },
  SWITCH: {
    val: false
  },
  SLIDER: {
    val: null
  },
  TIME: {
    val: null
  },
  TIME_RANGE: {
    val: null
  },
  DATE: {
    val: null
  },
  DATE_RANGE: {
    val: null
  },
  RATE: {
    val: 0
  },
  COLOR: {
    val: null
  },
  UPLOAD: {
    val: null
  },
  IMAGE_CAROUSEL: {
    val: null
  },
  IMAGE_SELECT: {
    val: null
  },
  DESC_TEXT: {
    val: '描述文字'
  },
  DIVIDER: {
    val: ''
  },
  SIGN_PAD: {
    val: ''
  },
  PAGINATION: {
    val: '分页'
  }
}
