import { defineComponent, reactive } from 'vue'
import DataEmpty from '@/components/DataEmpty'
export default defineComponent({
  props: {
    fields: {
      type: Object,
      default: null
    },
    onFilter: {
      type: Function
    }
  },
  setup() {
    const state = reactive({
      dialogVisible: false,
      copyFields: [],
      selectedFields: [] as any[],
      filterParams: {} as any
    })
    const selectedFieldHandle = (index: number, field: any) => {}
    const removeSelectedFieldHandle = () => {}
    const cancelHandle = () => {}
    const submitFilterHandle = () => {}
    return () => (
      <el-dialog modelValue={state.dialogVisible} center title="筛选"
        v-slots={{
          footer: () => {
            return (
              <span class="dialog-footer">
                <el-button onClick={cancelHandle}>取 消</el-button>
                <el-button
                  disabled={state.selectedFields.length==0&&state.filterParams!={}}
                  type="primary"
                  onclick={submitFilterHandle}
                >确 定</el-button>
              </span>
            )
          }
        }}
      >
        <p>点击添加筛选项：</p>
        <el-row>
          <el-col span={6} class="filter-left">
            {state.copyFields.map((field: any, index: number) => <p
              key={field.id}
              class={{'selected': field.selected, 'filter-item-label': true}}
              onClick={() => { selectedFieldHandle(index,field) }}
            >
              {
                field.label
              }
            </p>)}
          </el-col>
          <el-col span="18" class="filter-right">
            {!state.selectedFields || state.selectedFields.length==0 ? <DataEmpty desc="'请在左侧选择筛选项'" /> : ''}
            {state.selectedFields.map((field: any) => <div key={field.id}>
              <div class="filter-item">
                <label>{ field.label }</label>
                {['SELECT','RADIO','CHECKBOX','IMAGE_SELECT'].includes(field.type) ? <>
                  <p class="compare">选择</p>
                  <el-select modelValue={state.filterParams[`field${field.formItemId}`]} onChange={(val: string) => { state.filterParams[`field${field.formItemId}`] = val }}>
                    {field.expand.options.map((item: any) => <el-option
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />)}
                  </el-select>
                </> :
                <>
                  <p class="compare">包含</p>
                  <el-input modelValue={state.filterParams[`field${field.formItemId}`]} onInput={(val: string) => { state.filterParams[`field${field.formItemId}`] }} />
                </>
                }
                <i class="el-icon-delete" onClick={removeSelectedFieldHandle} />
              </div>
              <el-divider />
            </div>)}
          </el-col>
        </el-row>
      </el-dialog>
    )
  }
})
