import { computed, defineComponent, PropType } from 'vue'
import { TFieldConfig } from '../query'
import PreviewPhoneHtml from '@/views/front/query'

export default defineComponent({
  name: 'QuerySetting',
  props: {
    allSubmitData: {
      type: Object,
      default: {}
    },
    onChange: Function,
    excelFieldConfigs: {
      type: Array as PropType<TFieldConfig[]>,
      default: () => ([])
    }
  },
  setup(props) {

    const allSubmitData = computed({
      get: () => props.allSubmitData,
      set: (val: any) => {
        props.onChange && props.onChange(val)
      }
    })

    return () => (
      <>
        <div class='setup-container'>
          <div class='setup-left'>
            <div class='query-block'>
              <div class='query-tip'>请选择查询页需要输入的内容</div>
            </div>
            <div class='setup-form'>
              <div class='setup-content'>
                <div class='setup-block'>
                  <div class='setup-block__title'>说明:(提示语)</div>
                  <div class='setup-block__input'>
                    <el-input type='textarea' modelValue={allSubmitData.value.description} onInput={(val: string) => { allSubmitData.value.description = val }} size='medium' row={3} placeholder='请输入提示语'></el-input>
                  </div>
                </div>
                <div class='setup-block'>
                  <div class='setup-block__title'>查询次数限制0表示不限制:</div>
                  <div class='setup-block__input'>
                    <el-input size='medium' modelValue={allSubmitData.value.limit_number} onInput={(val: string) => { allSubmitData.value.limit_number = +val }} placeholder='请输入查询次数限制' value='0'></el-input>
                  </div>
                  <el-button size='medium' class='setup-block__btn'>设置可修改列</el-button>
                </div>
              </div>

              <div class='setup-content'>
                <div class='setup-block'>
                  <div class='setup-block__title red-txt'>查询条件:(必选)</div>
                  <div class='setup-block__content'>
                    {props.excelFieldConfigs.map((item) => {
                      return (
                        <div class='setup-block__item'>
                          <div class='field'>
                            <el-checkbox modelValue={item.show} onChange={(val: string) => { item.show = Boolean(+val) }} />
                            <span>{item.label}</span>
                          </div>
                          <div class='label'>
                            <span class='label-txt'>提示标题:</span>
                            <el-input size='mini' modelValue={item.title} onInput={(val: string) => { item.title = val }} placeholder={`请输入${item.label}标题`}></el-input>
                          </div>
                        </div>
                      )
                    }) }
                  </div>
                </div>
              </div>
            </div>
            <div class='quey-setup-tip'>
              <div class='setup-block'>
                <div class='setup-block__title'>查询结果页提示文字：</div>
                <div class='setup-block__input'>
                  <el-input type='textarea' size='medium' modelValue={allSubmitData.value.result_tips} onInput={(val: string) => { allSubmitData.value.result_tips = val }} row={3} placeholder='请输入提示语'></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class='setup-right'>
            <div class="preview-layer">
              <div class="preview-bg" />
              <div class="preview-phone">
                <div class='preview-html'>
                  <PreviewPhoneHtml isPreview={true} data={allSubmitData.value} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
})
