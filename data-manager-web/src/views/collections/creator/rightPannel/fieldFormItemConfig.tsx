import { isNumberStr } from '@/utils'
import { eventBus } from '@/utils/eventBus'
import AddOptions from './addOption'
import LayoutTree from './layoutTree'
import RegList from './regList'

const justifyOptions = [
  {
    label: 'start',
    value: 'start'
  },
  {
    label: 'end',
    value: 'end'
  },
  {
    label: 'center',
    value: 'center'
  },
  {
    label: 'space-around',
    value: 'space-around'
  },
  {
    label: 'space-between',
    value: 'space-between'
  }
]
const dateRangeTypeOptions = [
  {
    label: '日期范围(daterange)',
    value: 'daterange'
  },
  {
    label: '月范围(monthrange)',
    value: 'monthrange'
  },
  {
    label: '日期时间范围(datetimerange)',
    value: 'datetimerange'
  }
]
const dateTypeOptions = [
  {
    label: '日(date)',
    value: 'date'
  },
  {
    label: '周(week)',
    value: 'week'
  },
  {
    label: '月(month)',
    value: 'month'
  },
  {
    label: '年(year)',
    value: 'year'
  },
  {
    label: '日期时间(datetime)',
    value: 'datetime'
  }
]
const colorFormatOptions = [
  {
    label: 'hex',
    value: 'hex'
  },
  {
    label: 'rgb',
    value: 'rgb'
  },
  {
    label: 'rgba',
    value: 'rgba'
  },
  {
    label: 'hsv',
    value: 'hsv'
  },
  {
    label: 'hsl',
    value: 'hsl'
  }
]
const setDefaultValue = (val: any) => {
  if (Array.isArray(val)) {
    return val.join(',')
  }
  // if (['string', 'number'].indexOf(typeof val) > -1) {
  //   return val
  // }
  if (typeof val === 'boolean') {
    return `${val}`
  }
  return val
}
const onSwitchValueInput = (activeData: any, val: any, name: any) => {
  if (['true', 'false'].indexOf(val) > -1) {
    activeData[name] = JSON.parse(val)
  } else {
    activeData[name] = isNumberStr(val) ? +val : val
  }
}
export const formItemRender = (
  changeRenderKey: () => void,
  spanChange: (val: string) => void,
  openIconsDialog: (val: string) => void,
  isShowMin: boolean,
  isShowMax: boolean,
  isShowStep: boolean
) => {
  return [
    {
      title: '组件名',
      field: 'componentName',
      render: (activeData: any) => {
        return <>{activeData.__config__.componentName}</>
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.componentName !== undefined
      }
    },
    {
      title: '标题',
      field: 'componentName',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.__config__.label}
            placeholder='请输入标题'
            onInput={(val: string) => { activeData.__config__.label = val; changeRenderKey() }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.label !== undefined && activeData.__config__.showLabel !== false
      }
    },
    {
      title: '占位提示',
      field: 'placeholder',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.placeholder}
            placeholder='请输入占位提示'
            onInput={(val: string) => { activeData.placeholder = val; changeRenderKey() }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.placeholder !== undefined
      }
    },
    {
      title: '开始占位',
      field: 'start-placeholder',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['start-placeholder']}
            placeholder='请输入占位提示'
            onInput={(val: string) => { activeData['start-placeholder'] = val } }
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['start-placeholder'] !== undefined
      }
    },
    {
      title: '结束占位',
      field: 'end-placeholder',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['end-placeholder']}
            placeholder='请输入占位提示'
            onInput={(val: string) => { activeData['end-placeholder'] = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['end-placeholder'] !== undefined
      }
    },
    {
      title: '表单栅格',
      field: 'span',
      render: (activeData: any) => {
        return (
          <el-slider
            modelValue={activeData.__config__.span}
            onInput={(val: string) => { activeData.__config__.span = val }}
            marks={{ 12: '' }}
            max={24}
            min={1}
            onChange={spanChange}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.span !== undefined
      }
    },
    {
      title: '栅格间隔',
      field: 'rowFormItem',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.gutter}
            min={0}
            onInput={(val: string) => { activeData.gutter = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.layout === 'rowFormItem' && activeData.gutter !== undefined
      }
    },
    {
      title: '水平排列',
      field: 'justify',
      render: (activeData: any) => {
        return (
          <el-select
            modeValue={activeData.justify}
            style = {{ width: '100%' }}
            placeholder='请选择水平排列'
            onChange = {(val: string) => { activeData.justify = val }}
          >
            {justifyOptions.map((item, index) => {
              return (
                <el-option
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              )
            })}
          </el-select >
        )
      },
      showCondition: (activeData: any) => {
        return activeData.justify !== undefined && activeData.type === 'flex'
      }
    },
    {
      title: '垂直排列',
      field: 'align',
      render: (activeData: any) => {
        return (
          <el-radio-group modelValue={activeData.align} onChange={(val: string) => { activeData.align = val }}>
            <el-radio-button label='top' />
            <el-radio-button label='middle' />
            <el-radio-button label='bottom' />
          </el-radio-group>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.justify !== undefined && activeData.type === 'flex'
      }
    },
    {
      title: '默认值',
      field: 'end-placeholder',
      render: (activeData: any) => {
        const onDefaultValueInput = (str: string) => {
          if (Array.isArray(activeData.__config__.defaultValue)) {
            // 数组
            activeData.__config__.defaultValue = str.split(',').map((val) => (isNumberStr(val) ? +val : val))
          } else if (['true', 'false'].indexOf(str) > -1) {
            // 布尔
            activeData.__config__.defaultValue = JSON.parse(str)
          } else {
            // 字符串和数字
            activeData.__config__.defaultValue = isNumberStr(str) ? +str : str
          }
        }
        return (
          <el-input
            modelValue={setDefaultValue(activeData.__config__.defaultValue)}
            placeholder='请输入默认值'
            onInput={onDefaultValueInput}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__vModel__ !== undefined && activeData.__config__.showDefaultValue !== false
      }
    },
    {
      title: '至少应选',
      field: 'min',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.min}
            min={0}
            onInput={(val: string) => { activeData.min = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-checkbox-group'
      }
    },
    {
      title: '最多可选',
      field: 'max',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.max}
            min={0}
            onInput={(val: string) => { activeData.max = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-checkbox-group'
      }
    },
    {
      title: '前缀',
      field: 'prepend',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.__slot__.prepend}
            placeholder='请输入前缀'
            onInput={(val: string) => { activeData.__slot__.prepend = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__slot__ && activeData.__slot__.prepend !== undefined
      }
    },
    {
      title: '后缀',
      field: 'append',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.__slot__.append}
            placeholder='请输入默认值'
            onInput={(val: string) => { activeData.__slot__.append = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__slot__ && activeData.__slot__.append !== undefined
      }
    },
    {
      title: '前图标',
      field: 'prefix-icon',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['prefix-icon']}
            placeholder='请输入按钮图标名称'
            onInput={(val: string) => { activeData['prefix-icon'] = val }}
            v-slots={{
              append: () => {
                return (
                  <el-button
                    slot='append'
                    icon='el-icon-thumb'
                    onClick={() => openIconsDialog('prefix-icon')}
                  > 选择 </el-button >
                )
              }
            }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['prefix-icon'] !== undefined
      }
    },
    {
      title: '后图标',
      field: 'suffix-icon',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['suffix-icon']}
            placeholder='请输入按钮图标名称'
            onInput={(val: string) => { activeData['suffix-icon'] = val }}
            v-slots={{
              append: () => {
                return (
                  <el-button
                    slot='append'
                    icon='el-icon-thumb'
                    onClick={() => openIconsDialog('suffix-icon')}
                  > 选择 </el-button >
                )
              }
            }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['suffix-icon'] !== undefined
      }
    },
    {
      title: '按钮图标',
      field: 'icon',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.icon}
            placeholder='请输入按钮图标名称'
            onInput={(val: string) => { activeData.icon = val }}
            v-slots={{
              append: () => {
                return (
                  <el-button
                    slot='append'
                    icon='el-icon-thumb'
                    onClick={() => openIconsDialog('icon')}
                  > 选择 </el-button >
                )
              }
            }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.icon !== undefined && activeData.__config__.tag === 'el-button'
      }
    },
    {
      title: '选项分隔符',
      field: 'separator',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.separator}
            placeholder='请输入选项分隔符'
            onInput={(val: string) => { activeData.separator = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-cascader'
      }
    },
    {
      title: '最小行数',
      field: 'minRows',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.autosize.minRows}
            min={0}
            onInput={(val: string) => { activeData.autosize.minRows = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.autosize !== undefined
      }
    },
    {
      title: '最小行数',
      field: 'maxRows',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.autosize.maxRows}
            min={0}
            onInput={(val: string) => { activeData.autosize.maxRows = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.autosize !== undefined
      }
    },
    {
      title: '最小值',
      field: 'minValue',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.min}
            placeholder='最小值'
            min={0}
            onInput={(val: string) => { activeData.min = val }}
          />
        )
      },
      showCondition: () => {
        return isShowMin
      }
    },
    {
      title: '最大值',
      field: 'maxValue',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.max}
            placeholder='最大值'
            min={0}
            onInput={(val: string) => { activeData.max = val }}
          />
        )
      },
      showCondition: () => {
        return isShowMax
      }
    },
    {
      title: '高度',
      field: 'height',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.height}
            placeholder='高度'
            min={0}
            onInput={(val: string) => { activeData.height = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.height !== undefined
      }
    },
    {
      title: '步长',
      field: 'step',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.step}
            placeholder='步长'
            min={0}
            onInput={(val: string) => { activeData.step = val }}
          />
        )
      },
      showCondition: () => {
        return isShowStep
      }
    },
    {
      title: '精度',
      field: 'precision',
      render: (activeData: any) => {
        return (
          <el-input-number
            modelValue={activeData.precision}
            placeholder='精度'
            min={0}
            onInput={(val: string) => { activeData.precision = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-input-number'
      }
    },
    {
      title: '按钮位置',
      field: 'controls-position',
      render: (activeData: any) => {
        return (
          <el-radio-group modelValue={activeData['controls-position']} onChange={(val: string) => { activeData['controls-position'] = val }}>
            <el-radio-button label='' >默认</el-radio-button>
            <el-radio-button label='right' >右侧</el-radio-button>
          </el-radio-group>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-input-number'
      }
    },
    {
      title: '最多输入',
      field: 'maxlength',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.maxlength}
            placeholder='请输入字符长度'
            onInput={(val: string) => { activeData.maxlength = val }}
            v-slots={{
              append: () => <>个字符</>
            }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.maxlength !== undefined
      }
    },
    {
      title: '开启提示',
      field: 'active-text',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['active-text']}
            placeholder='请输入开启提示'
            onInput={(val: string) => { activeData['active-text'] = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['active-text'] !== undefined
      }
    },
    {
      title: '关闭提示',
      field: 'inactive-text',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['inactive-text']}
            placeholder='关闭提示'
            onInput={(val: string) => { activeData['inactive-text'] = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['inactive-text'] !== undefined
      }
    },
    {
      title: '开启值',
      field: 'active-value',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={setDefaultValue(activeData['active-value'])}
            placeholder='请输入开启值'
            onInput={(val: string) => onSwitchValueInput(activeData, val, 'active-value')}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['active-value'] !== undefined
      }
    },
    {
      title: '关闭值',
      field: 'inactive-value',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={setDefaultValue(activeData['inactive-value'])}
            placeholder='请输入关闭值'
            onInput={(val: string) => onSwitchValueInput(activeData, val, 'inactive-value')}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['inactive-value'] !== undefined
      }
    },
    {
      title: '时间类型',
      field: 'type',
      render: (activeData: any) => {
        let dateOptions: any = []
        if (activeData.type !== undefined && activeData.__config__.tag === 'el-date-picker') {
          if (activeData['start-placeholder'] === undefined) {
            dateOptions = dateTypeOptions
          }
          dateOptions = dateRangeTypeOptions
        }
        return (
          <el-select
            modeValue={activeData.type}
            style={{ width: '100%' }}
            placeholder='请选择时间类型'
            onChange={(val: string) => { activeData.type = val }}
          >
            {dateOptions.map((item: any, index: number) => {
              return (
                <el-option
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              )
            })}
          </el-select >
        )
      },
      showCondition: (activeData: any) => {
        return activeData.justify !== undefined && activeData.type === 'flex'
      }
    },
    {
      title: '文件类型',
      field: 'accept',
      render: (activeData: any) => {
        return (
          <el-select
            modeValue={activeData.accept}
            style={{ width: '100%' }}
            placeholder='请选择文件类型'
            onChange={(val: string) => { activeData.accept = val }}
          >
            <el-option label='图片' value='image/*' />
            <el-option label='视频' value='video/*' />
            <el-option label='音频' value='audio/*' />
            <el-option label='excel' value='.xls,.xlsx' />
            <el-option label='word' value='.doc,.docx' />
            <el-option label='pdf' value='.pdf' />
            <el-option label='txt' value='.txt' />
          </el-select >
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__slot__ && activeData.accept !== undefined
      }
    },
    {
      title: '文件大小',
      field: 'fileSize',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.__config__.fileSize}
            placeholder='请输入关闭值'
            onInput={(val: string) => { activeData.__config__.fileSize = val }}
            v-slots={{
              append: () => {
                return (
                  <el-select
                    modelValue={activeData.__config__.sizeUnit}
                    style={{ width: '66px' }}
                  >
                    <el-option label='KB' value='KB' />
                    <el-option label='MB' value='MB' />
                    <el-option label='GB' value='GB' />
                  </el-select>
                )
              }
            }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.fileSize !== undefined
      }
    },
    {
      title: '列表类型',
      field: 'list-type',
      render: (activeData: any) => {
        return (
          <el-radio-group modelValue={activeData['list-type']} onChange={(val: string) => { activeData['list-type'] = val }}>
            <el-radio-button label='text'> 文字 </el-radio-button>
            <el-radio-button label='picture'> 图片 </el-radio-button>
            <el-radio-button label='picture-card'>图片卡片</el-radio-button>
          </el-radio-group>
        )
      },
      showCondition: (activeData: any) => {
        return activeData['list-type'] !== undefined
      }
    },
    {
      title: '按钮类型',
      field: 'button-type',
      render: (activeData: any) => {
        return (
          <el-select modelValue={activeData.type} onChange={(val: string) => { activeData.type = val }}>
            <el-option label='primary' value='primary' />
            <el-option label='success' value='success' />
            <el-option label='warning' value='warning' />
            <el-option label='danger' value='danger' />
            <el-option label='info' value='info' />
            <el-option label='text' value='text' />
          </el-select>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.type !== undefined && activeData.__config__.tag === 'el-button'
      }
    },
    {
      title: '按钮文字',
      field: 'buttonText',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.__config__.buttonText}
            placeholder='请输入按钮文字'
            onInput={(val: string) => { activeData.__config__.buttonText = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.buttonText !== undefined && activeData['list-type'] !== 'picture-card'
      }
    },
    {
      title: '按钮文字',
      field: 'buttonText',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.__slot__.default}
            placeholder='请输入按钮文字'
            onInput={(val: string) => { activeData.__slot__.default = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-button'
      }
    },
    {
      title: '分隔符',
      field: 'range-separator',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['range-separator']}
            placeholder='请输入分隔符'
            onInput={(val: string) => { activeData['range-separator'] = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['range-separator'] !== undefined
      }
    },
    {
      title: '时间段',
      field: 'picker-options',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData['picker-options'].selectableRange}
            placeholder='请输入分隔符'
            onInput={(val: string) => { activeData['picker-options'].selectableRange = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['picker-options'] !== undefined
      }
    },
    {
      title: '时间段',
      field: 'picker-options',
      render: (activeData: any) => {
        return (
          <el-input
            modelValue={activeData.format}
            placeholder='请输入时间格式'
            onInput={(val: string) => { activeData.format = val }}
          />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.format !== undefined
      }
    },
    {
      title: '选项',
      field: 'options',
      noFormItem: true,
      render: (activeData: any) => {
        return (
          <AddOptions activeData={activeData} />
        )
      },
      showCondition: (activeData: any) => {
        return ['el-checkbox-group', 'el-radio-group', 'el-select', 'el-cascader', 'image-select'].indexOf(activeData.__config__.tag) > -1
      }
    },
    {
      title: '选项样式',
      field: 'optionType',
      render: (activeData: any) => {
        return (
          <el-radio-group modelValue={activeData.__config__.optionType} onChange={(val: string) => { activeData.__config__.optionType = val }}>
            <el-radio-button label='default'> 默认 </el-radio-button>
            <el-radio-button label='button'> 按钮 </el-radio-button>
          </el-radio-group>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.optionType !== undefined
      }
    },
    {
      title: '开启颜色',
      field: 'active-color',
      render: (activeData: any) => {
        return (
          <el-color-picker modelValue={activeData['active-color']} onChange={(val: string) => { activeData['active-color'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['active-color'] !== undefined
      }
    },
    {
      title: '关闭颜色',
      field: 'inactive-color',
      render: (activeData: any) => {
        return (
          <el-color-picker modelValue={activeData['inactive-color']} onChange={(val: string) => { activeData['inactive-color'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['inactive-color'] !== undefined
      }
    },
    {
      title: '显示标签',
      field: 'showLabel',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.__config__.showLabel} onInput={(val:string) => { activeData.__config__.showLabel = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.showLabel !== undefined && activeData.__config__.labelWidth !== undefined
      }
    },
    {
      title: '品牌烙印',
      field: 'branding',
      render: (activeData: any) => {
        const needRerenderList = ['tinymce']
        const changeRenderKey = () => {
          if (needRerenderList.includes(activeData.__config__.tag)) {
            activeData.__config__.renderKey = +new Date()
          }
        }
        return (
          <el-switch modelValue={activeData.branding} onInput={(val: string) => { activeData.branding = val; changeRenderKey() }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.branding !== undefined
      }
    },
    {
      title: '允许半选',
      field: 'allow-half',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['allow-half']} onInput={(val: string) => { activeData['allow-half'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['allow-half'] !== undefined
      }
    },
    {
      title: '辅助文字',
      field: 'show-text',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['show-text']} onInput={(val: string) => { activeData['show-text'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['show-text'] !== undefined
      }
    },
    {
      title: '显示分数',
      field: 'show-score',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['show-score']} onInput={(val: string) => { activeData['show-score'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['show-score'] !== undefined
      }
    },
    {
      title: '显示间断点',
      field: 'show-stops',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['show-stops']} onInput={(val: string) => { activeData['show-stops'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['show-stops'] !== undefined
      }
    },
    {
      title: '范围选择',
      field: 'range',
      render: (activeData: any) => {
        const rangeChange = (val: string) => {
          activeData.__config__.defaultValue = val ? [activeData.min, activeData.max] : activeData.min
        }
        return (
          <el-switch modelValue={activeData.range} onInput={(val: string) => { activeData.range = val }} onChange={rangeChange}/>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.range !== undefined
      }
    },
    {
      title: '颜色格式',
      field: 'color-format',
      render: (activeData: any) => {
        return (
          <el-select
            modeValue={activeData['color-format']}
            style={{ width: '100%' }}
            clearable
            placeholder='请选择颜色格式'
            onChange={(val: string) => { activeData['color-format'] = val }}
          >
            {colorFormatOptions.map((item, index) => {
              return (
                <el-option
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              )
            })}
          </el-select >
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-color-picker'
      }
    },
    {
      title: '组件尺寸',
      field: 'size-align',
      render: (activeData: any) => {
        return (
          <el-radio-group modelValue={activeData.size} onChange={(val: string) => { activeData.size = val }}>
            <el-radio-button label='medium'> 中等 </el-radio-button>
            <el-radio-button label='small'> 较小 </el-radio-button>
            <el-radio-button label='mini'> 迷你 </el-radio-button>
          </el-radio-group>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.size !== undefined && (activeData.__config__.border || activeData.__config__.tag === 'el-color-picker' || activeData.__config__.tag === 'el-button')
      }
    },
    {
      title: '输入统计',
      field: 'show-word-limit',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['show-word-limit']} onInput={(val: string) => { activeData['show-word-limit'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData['show-word-limit'] !== undefined
      }
    },
    {
      title: '严格步数',
      field: 'step-strictly',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['step-strictly']} onInput={(val: string) => { activeData['step-strictly'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-input-number'
      }
    },
    {
      title: '是否多选',
      field: 'multiple',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.props.multiple} onInput={(val: string) => { activeData.props.multiple = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-cascader'
      }
    },
    {
      title: '展示全路径',
      field: 'show-all-levels',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData['show-all-levels']} onInput={(val: string) => { activeData['show-all-levels'] = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-cascader'
      }
    },
    {
      title: '可否筛选',
      field: 'show-all-levels',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.filterable} onInput={(val: string) => { activeData.filterable = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-cascader'
      }
    },
    {
      title: '能否清空',
      field: 'clearable',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.clearable} onInput={(val: string) => { activeData.clearable = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.clearable !== undefined
      }
    },
    {
      title: '显示提示',
      field: 'showTip',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.__config__.showTip} onInput={(val: string) => { activeData.__config__.showTip = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.showTip !== undefined
      }
    },
    {
      title: '多选文件',
      field: 'multiple',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.multiple} onInput={(val: string) => { activeData.multiple = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-upload'
      }
    },
    {
      title: '文件个数',
      field: 'limit',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.limit} onInput={(val: string) => { activeData.limit = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-upload'
      }
    },
    {
      title: '是否只读',
      field: 'readonly',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.readonly} onInput={(val: string) => { activeData.readonly = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.readonly !== undefined
      }
    },
    {
      title: '能否搜索',
      field: 'filterable',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.filterable} onInput={(val: string) => { activeData.filterable = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-select'
      }
    },
    {
      title: '是否多选',
      field: 'filterable',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.multiple} onInput={(val: string) => { activeData.multiple = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-select'
      }
    },
    {
      title: '颜色',
      field: 'color',
      render: (activeData: any) => {
        return (
          <el-color-picker modelValue={activeData.color} onChange={(val: string) => { activeData.color = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.color !== undefined
      }
    },
    {
      title: '对齐方式',
      field: 'textAlign',
      render: (activeData: any) => {
        return (
          <el-radio-group modelValue={activeData.textAlign} onChange={(val: string) => { activeData.textAlign = val }}>
            <el-radio-button label='left'> 左对齐 </el-radio-button>
            <el-radio-button label='center'> 居中 </el-radio-button>
            <el-radio-button label='right'> 右对齐 </el-radio-button>
          </el-radio-group>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.textAlign !== undefined
      }
    },
    {
      title: '图片地址',
      field: 'textAlign',
      render: (activeData: any) => {
        return (
          <>
            <el-input
              modelValue={activeData.src}
              onInput={(val: string) => { activeData.src = val }}
              placeholder='请输入图片url地址'
            />
            <el-upload
              ref='logoUpload'
              action='getUploadUrl'
              headers='getUploadHeader'
              on-progress='uploadProgressHandle'
              on-success={(response: any, file: any, fileList: any) => {
                activeData.src = response.data
                console.log(file, fileList)
              }
              }
              show-file-list='false'
              accept='.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP'
              style='text-align: center'
              v-slots={{
                trigger: () => {
                  return <el-button size='small' type='text'>点击上传图片 *</el-button>
                }
              }}
            />
          </>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'el-image'
      }
    },
    {
      title: '是否必填',
      field: 'required',
      render: (activeData: any) => {
        return (
          <el-switch modelValue={activeData.__config__.required} onInput={(val: string) => { activeData.__config__.required = val }} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.required !== undefined && activeData.__config__.showRequired !== false
      }
    },
    {
      title: '',
      field: '',
      noFormItem: true,
      render: (activeData: any) => {
        return (
          <LayoutTree activeData={activeData} />
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.layoutTree
      }
    },
    {
      title: '',
      field: '',
      noFormItem: true,
      render: (activeData: any) => {
        return (
          <RegList activeData={activeData} />
        )
      },
      showCondition: (activeData: any) => {
        return Array.isArray(activeData.__config__.regList) &&
          activeData.__config__.showRegList !== false
      }
    },
    {
      title: '配置项',
      field: 'slotOptions',
      render: () => {
        return (
          <el-button type='primary' size='medium' onClick={() => { eventBus.emit('personalConfig') }}>设置行属性</el-button>
        )
      },
      showCondition: (activeData: any) => {
        return activeData.__config__.tag === 'personal-information'
      }
    }
  ]
}
