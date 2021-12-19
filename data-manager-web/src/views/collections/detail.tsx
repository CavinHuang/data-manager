import { defineComponent, reactive, ref } from 'vue'
import DataFilter from './filter'
import ResultItem from './detail-item'
import UserHeader from '../home/components/userHeader'
import style from './style.module.scss'
import { itemLists, resultList } from '@/apis/modules/question'
import { useRoute } from 'vue-router'
import set from 'lodash/set'
import { getCheckedColumn } from './creator/utils/db'

// 头部固定标签
const fixedDefaultFormColumn: any = ['serialNumber']
const fixedDefaultLabelFormColumn: any = {serialNumber: '提交序号'}
// 尾部固定标签
const fixedDefaultFormTailColumn: any = ['submitAddress', 'createTime']
const fixedDefaultLabelFormTailColumn: any = { submitAddress: '提交地址', createTime: '提交时间'}

export default defineComponent({
  props: {

  },
  setup() {
    const route = useRoute()
    const filterForm = ref<any>(null)
    const state = reactive({
      projectResultList: [] as any[],
      // 查询条件
      queryConditions: {
        page: 1,
        page_size: 10,
        projectKey: route.query.key as string,
        beginDateTime: '',
        endDateTime: '',
        extParams: null,
        extComparisons: null
      },
      otherCustomColumns: [] as any[],
      projectItemList: [] as any[],
      projectItemColumns: {} as any,
      detailDrawer: false,
      total: 0,
      customColumnDialogVisible: false,
      checkOtherCustomColumns: [] as any[],
      // 选中的
      checkedFixedCustomColumns: fixedDefaultFormColumn,
      checkedFixedTailCustomColumns: fixedDefaultFormTailColumn,
      // 固定自定义列 如序号等
      fixedCustomColumns: fixedDefaultFormColumn,
      fixedFormTailColumns: fixedDefaultFormTailColumn,
      fixedCustomTailColumns: [] as any[]
    })
    const activeResultRow = ref<any>(null)

    const dataFilter = ref<any>(null)

    const queryProjectResult = () => {
      resultList(state.queryConditions).then(res => {
        console.log(res)
        state.total = res.total
        state.projectResultList = res.data
        state.queryConditions.page_size = res.size
      })
      // this.$api.get('/user/project/result/page', {params: this.queryConditions}).then(res => {
      //   let {records, total, size} = res.data
      //   this.projectResultList = records
      //   this.total = total
      //   this.queryConditions.size = size
      // })
    }
    queryProjectResult()
    const conditionFilterHandle = () => {
      dataFilter.value.showDialogHandle()
    }
    const getDbCheckedColumns = () => {
      let checkedColumn = getCheckedColumn(state.queryConditions.projectKey)
      if (!checkedColumn) {
        return
      }
      let {fixedCustomColumns, otherCustomColumns, fixedCustomTailColumns} = checkedColumn
      if (fixedCustomColumns) {
        state.fixedCustomColumns = fixedCustomColumns
        state.checkedFixedCustomColumns = fixedCustomColumns
      }
      if (otherCustomColumns) {
        state.otherCustomColumns = otherCustomColumns
        state.checkOtherCustomColumns = otherCustomColumns
      }
      if (fixedCustomTailColumns) {
        state.fixedCustomTailColumns = fixedCustomTailColumns
        state.checkedFixedTailCustomColumns = fixedCustomTailColumns
      }
    }
    const queryProjectItems = () => {
      itemLists(state.queryConditions.projectKey, false).then(res => {
        res.map(item => {
         set(state.projectItemColumns, `field${item.formItemId}`, item.label)
        })
        state.projectItemList = res
        getDbCheckedColumns()
      })
    }
    queryProjectItems()
    const exportProjectResult = () => {}
    const downloadProjectResultFile = () => {}
    const openDetailDrawerHandle = (row: any) => {
      console.log(111111, row)
      activeResultRow.value = row
      state.detailDrawer = true
    }
    const renderHeader = () => {
      return <i class="el-icon-setting" style="color:currentColor" onClick={() => state.customColumnDialogVisible = true}></i>
    }
    const saveStatisticsCheckedColumns = () => {}
    const dataFilterHandle = () => {}

    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class={style['statistics-container']}>
          <div class="filter-table-view">
            <el-form ref={filterForm} inline={true}>
              <el-form-item label="提交时间" prop="endDateTime">
                <el-date-picker
                  modelValue={state.queryConditions.beginDateTime}
                  onChange={(val: string) => { state.queryConditions.beginDateTime = val }}
                  placeholder="开始时间"
                  type="datetime"
                  value-format="yyyy-MM-dd HHmmss"
                />
                <span> 至 </span>
                <el-date-picker
                  modelValue={state.queryConditions.endDateTime}
                  onChange={(val: string) => { state.queryConditions.endDateTime = val }}
                  default-time={['235959']}
                  placeholder="结束时间"
                  type="datetime"
                  value-format="yyyy-MM-dd HHmmss"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" onClick={queryProjectResult}>查询</el-button>
                <el-button type="primary" onClick={conditionFilterHandle}>条件</el-button>
                <el-button type="success" onClick={exportProjectResult}>导出</el-button>
                {/* <el-button type="success" onClick={downloadProjectResultFile}>下载附件</el-button> */}
              </el-form-item>
            </el-form>
          </div>
          <div class="result-table-view">
            <el-table
              data={state.projectResultList}
              header-cell-class-name="data-table-header"
              stripe
              onRowDblclick={(row: any, column: any, event: any)=>{
                openDetailDrawerHandle(row)
              }}
            >
              <el-table-column
                type="selection"
                width="55"
              />
              {state.fixedCustomColumns.map((col: any) => {
                return <el-table-column
                key={`t${col}`}
                label={fixedDefaultLabelFormColumn[col]}
              >
                {{
                  default: (scope: any) => {
                    return <>{scope.row[col]}</>
                  }
                }}
              </el-table-column>
              })}
              {state.otherCustomColumns.map(col => {
                return <el-table-column
                  key={col}
                  label={state.projectItemColumns[col]}
                  show-overflow-tooltip
                >
                  {{
                    default: (scope: any) => <>{scope.row['processData'][col]}</>
                  }}
                </el-table-column>
              })}
              {state.fixedFormTailColumns.map((col: any) => {
                return <el-table-column
                    label={fixedDefaultLabelFormTailColumn[col]}
                  >
                    {{
                      default: (scope: any) => <>{ scope.row[col] }</>
                    }}
                  </el-table-column>
              })}

              <el-table-column
                fixed="right"
                width="50"
                v-slots={{
                  header: () => <i class="el-icon-setting" style="color:currentColor" onClick={() => state.customColumnDialogVisible = true}></i>,
                  default: (scope: any) => <el-button size="small" type="text" onClick={() => { openDetailDrawerHandle(scope.row) }}>查看</el-button>
                }}
              >
              </el-table-column>
            </el-table>

            {activeResultRow.value ? (
              <el-drawer
                modelValue={state.detailDrawer}
                with-header={false}
                onClosed={() => { state.detailDrawer = false }}
              >
                <el-scrollbar style="height 100%;">
                  <el-card class="detail-container" v-slots={{
                    header: () => {
                      return <div class="clearfix">
                      <span>提交详情</span>
                    </div>
                    }
                  }}>
                    {state.projectItemList.map(item => {
                      console.log(item, '==================')
                      return <div key={item.id}>
                      <h4>{ item.label }</h4>
                      <ResultItem
                        fieldItemId={item.formItemId}
                        projectItemData={item}
                        resultData={activeResultRow.value}
                      />
                      <el-divider />
                    </div>
                    })}
                  </el-card>
                </el-scrollbar>
              </el-drawer>
            ) : ''}
            <div style="display flex; justify-content center; margin-top 10px;">
              {state.total > 10 ? <el-pagination
                current-page={state.queryConditions.page}
                page-size={state.queryConditions.page_size}
                total={state.total}
                background
                layout="total, prev, pager, next"
                onCurrentChange={queryProjectResult}
              /> : ''}
            </div>
          </div>
          <div class="custom-col-container">
            <el-dialog
              modelValue={state.customColumnDialogVisible}
              center
              title="自定义显示列"
              v-slots={{
                footer: () => {
                  return (
                    <span class="dialog-footer">
                      <el-button onClick={() => { state.customColumnDialogVisible = false }}>取 消</el-button>
                      <el-button type="primary" onClick={saveStatisticsCheckedColumns}>确 定</el-button>
                    </span>
                  )
                }
              }}
            >
              <el-row>
                <el-col span="3">
                  <span>显示列：</span>
                </el-col>
              </el-row>
              <el-divider />
              <el-checkbox-group modelValue={state.checkedFixedCustomColumns} onInput={(val: string[]) => { state.checkedFixedCustomColumns = val }}>
                <el-row>
                  {Object.keys(fixedDefaultLabelFormColumn).map(key => <el-col key={key} span={4}>
                    <el-checkbox label="key">{ fixedDefaultLabelFormColumn[key] }</el-checkbox>
                  </el-col>)}
                </el-row>
              </el-checkbox-group>
              <el-divider />
              <el-checkbox-group modelValue={state.checkOtherCustomColumns} onChange={(val: string[]) => { state.checkOtherCustomColumns = val }}>
                <el-row>
                  {Object.keys(state.projectItemColumns).map(key => <el-col key={key} span={8}>
                    <el-checkbox label="key">{ state.projectItemColumns[key] }</el-checkbox>
                  </el-col>)}
                </el-row>
              </el-checkbox-group>
              <el-divider />
              <el-checkbox-group modelValue={state.checkedFixedTailCustomColumns} onInput={(val: string[]) => { state.checkedFixedTailCustomColumns = val }}>
                <el-row>
                  {Object.keys(fixedDefaultLabelFormTailColumn).map(key => <el-col key={key} span={4}>
                    <el-checkbox label="key">{ fixedDefaultLabelFormTailColumn[key] }</el-checkbox>
                  </el-col>)}
                </el-row>
              </el-checkbox-group>
            </el-dialog>
          </div>
          <DataFilter ref={dataFilter} fields={state.projectItemList} onFilter={dataFilterHandle} />
        </div>
      </div>
    )
  }
})
