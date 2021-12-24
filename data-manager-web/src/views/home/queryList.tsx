/*
 * @Author: your name
 * @Date: 2021-09-07 21:57:55
 * @LastEditTime: 2021-12-19 14:24:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\home\queryList.tsx
 */
import { queryLists, update } from '@/apis/modules/query'
import { TQueryItem } from '@/apis/types/query'
import { date } from '@/utils/date'
import { defineComponent,reactive,ref } from 'vue'
import UserHeader from './components/userHeader'
import css from './index.module.scss'
import QuerySetting from './components/querySetting'
import { submit, deleteRow, updateStatus } from '@/apis/modules/query'
import { cloneDeep } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'

type TPageData = {
  lists: TQueryItem[]
  current_page: number,
  title: string,
  total: number
}

export default defineComponent({
  name: 'HomeUser',
  setup() {
    const pageData = reactive<TPageData>({
      lists: [],
      current_page: 1,
      title: '',
      total: 0
    })

    const getData = () => {
      queryLists({ page: pageData.current_page, page_size: 10 }).then(res => {
        pageData.current_page = res.current_page
        pageData.lists = res.data
        pageData.total = res.total
      })
    }

    getData()

    const pageChange = (current: number) => {
      pageData.current_page = current
      console.log('========', current)
      getData()
    }

    const dialogVisible = ref(false)
    const currentRow = ref<TQueryItem | null>(null)
    const editTitleData = ref<string>('')
    const handleClose = () => { }
    const editTitle = () => {
      if (currentRow.value) {
        const id = currentRow.value.id
        const updateData = {
          title: editTitleData.value
        }
        update(id, updateData).then(res => {
          console.log(res)
          dialogVisible.value = false
          editTitleData.value = ''
          getData()
        })
      }
    }
    const renderEditTitle = () => {
      return (
        <el-dialog
          title="提示"
          modelValue={dialogVisible.value}
          width="30%"
          before-close={handleClose}
          v-slots={{
            footer: () => {
              return (
                <span class="dialog-footer">
                  <el-button onClick={() => dialogVisible.value = false}>取 消</el-button>
                  <el-button type="primary" onClick={editTitle}>确 定</el-button>
                </span >
              )
            }
          }}
        >
          <el-input placeholder="请输入标题" modelValue={editTitleData.value} onInput={(val: string) => editTitleData.value = val} clearable> </el-input>
        </el-dialog >
      )
    }

    const editTitleHandler = (row: TQueryItem) => {
      console.log(1)
      currentRow.value = row
      editTitleData.value = row.title
      dialogVisible.value = true
    }

    const querySettingDialog = ref(false)
    const currentSettingRow = ref<any>(null)
    const querySettingChange = () => {}
    const editQuerySettingHandler = (row: TQueryItem) => {
      const { excel_fields, excel_fields_config } = row
      console.log(excel_fields_config)
      currentSettingRow.value = {
        ...row,
        excel_fields: JSON.parse(excel_fields),
        excel_fields_config: JSON.parse(excel_fields_config)
      }
      querySettingDialog.value = true
    }
    const submitAllData = () => {
      if (currentSettingRow.value) {
        const postData = cloneDeep(currentSettingRow.value)
        postData.attach_id = postData.source_id
        postData.field_config = postData.excel_fields_config
        postData.fields = postData.excel_fields
        submit(postData).then(() => {
          querySettingDialog.value = false
          getData()
        })
      }
    }

    const deleteRowHandler = (row: TQueryItem) => {
      ElMessageBox.confirm('是否需要删除该条记录，删除后无法恢复！', '操作提醒', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
        deleteRow(row.id).then(() => {
          ElMessage.success('删除成功')
          getData()
        })
      })
    }

    const editQuerySettingResult = () => {
      // 更行数据
      submitAllData()
    }

    const cancelEditQuery = () => {
      querySettingDialog.value = false
      currentSettingRow.value = null
    }
    const editQuerySetting = () => {
      return (
        <el-dialog
          title="编辑查询配置"
          modelValue={querySettingDialog.value}
          fullscreen
          width="100%"
          before-close={handleClose}
          v-slots={{
            footer: () => {
              return (
                <span class="dialog-footer" style='display: flex; flex-wrap: nowrap; justify-content: center;'>
                  <el-button onClick={cancelEditQuery}>取 消</el-button>
                  <el-button type="primary" onClick={editQuerySettingResult}>确 定</el-button>
                </span >
              )
            }
          }}
        >
          <div class={css['main-container']}>
            {currentSettingRow.value ? <QuerySetting allSubmitData={currentSettingRow.value} excelFieldConfigs={currentSettingRow.value.excel_fields_config} onChange={querySettingChange}/> : ''}
          </div>
        </el-dialog>
      )
    }

    const handleSelectionChange = (slection: any[]) => {
      console.log(slection)
    }

    const updateStatusHandler = (row: TQueryItem, status: number) => {
      updateStatus({ id: row.id, status }).then(() => {
        ElMessage.success('更新成功')
        row.status = status
      })
    }

    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class={css['action-wrapper']}>
          <div class='action-left'>
            <el-button type="danger" size='medium' round>一键删除</el-button>
          </div>
          <div class='action-right'>
            <el-form inline={true} class='demo-form-inline'>
              <el-form-item>
                <el-input modelValue={pageData.title} onInput={(val: string) => pageData.title = val} placeholder='请输入名称'></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class={css['page-content']}>
          <div class={css['content-block']}>
            <div class='checkbox'>
              <el-button type='primary' size='mini' plain>全部</el-button>
              {/* <el-button type='danger' size='mini' plain>批量删除</el-button> */}
            </div>
            <div class='table-container'>
              <el-table
                ref="multipleTable"
                data={pageData.lists}
                tooltip-effect="dark"
                style={{ width: '100%' }}
                empty-text='暂无数据，快去创建一条吧！'
                onSelectionChange={handleSelectionChange}
              >
                {/* <el-table-column type="selection" width="55" /> */}
                <el-table-column label="查询名称" prop='title' width="220" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="查询状态" width="120" v-slots={{
                  default: ({ row }: { row: TQueryItem }) => {
                    if (row.status === 0) return <el-button type="success" plain size='mini' onClick={() => { updateStatusHandler(row, 1) }}>已启用</el-button>
                    else return <el-button type="danger" plain size='mini' onClick={() => { updateStatusHandler(row, 0) }}>已关闭</el-button>
                  }
                }}></el-table-column>
                <el-table-column align='center' prop="limit_number" label="次数限制" width="120" show-overflow-tooltip></el-table-column>
                {/* <el-table-column prop="address" label="查询类型" width="120" show-overflow-tooltip></el-table-column> */}
                <el-table-column align='center' prop="excel_total_row" label="数据总行数" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createtime" label="提交时间" width="120" show-overflow-tooltip v-slots={{
                  default: ({ row }: { row: TQueryItem }) => {
                    return date('Y-m-d',+row.createtime)
                  }
                }}></el-table-column>
                <el-table-column prop="action" label="操作" v-slots={
                  {
                    default: ({ row }: { row: TQueryItem }) => {
                      return (
                        <div class='action-btns'>
                          <el-row>
                            <el-button type="primary" size='mini' onClick={() => { editQuerySettingHandler(row) }}>编辑查询配置</el-button>
                            <el-button type="primary" size='mini' onClick={() => { editTitleHandler(row) }}>修改标题</el-button>
                            <el-button type="primary" size='mini'>导出</el-button>
                            <el-button type="danger" size='mini' onClick={() => { deleteRowHandler(row) }}>删除</el-button>
                          </el-row>
                        </div>
                      )
                    }
                  }
                } />
              </el-table>
              <el-pagination background layout="prev, pager, next" total={pageData.total} onCurrentChange={pageChange} />
            </div>
          </div>
        </div>
        {renderEditTitle()}
        {editQuerySetting()}
      </div>
    )
  }
})
