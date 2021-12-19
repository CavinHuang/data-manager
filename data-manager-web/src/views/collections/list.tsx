import { queryLists, update } from '@/apis/modules/query'
import { questionList } from '@/apis/modules/question'
import { TQuestion } from '@/apis/types/question'
import router from '@/router'
import { date } from '@/utils/date'
import { defineComponent,reactive,ref } from 'vue'
import UserHeader from '../home/components/userHeader'
import css from '../home/index.module.scss'

type TPageData = {
  lists: TQuestion[]
  current_page: number,
  title: string
}

export default defineComponent({
  name: 'HomeUser',
  setup() {
    const dataLoading = ref<boolean>(false)
    const pageData = reactive<TPageData>({
      lists: [],
      current_page: 1,
      title: ''
    })

    const getData = () => {
      dataLoading.value = true
      questionList({ page: 1,page_size: 10 }).then(res => {
        console.log(res)
        pageData.current_page = res.current_page
        pageData.lists = res.data
        dataLoading.value = false
      })
    }

    getData()

    const dialogVisible = ref(false)
    const currentRow = ref<TQuestion | null>(null)
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

    const editTitleHandler = (row: TQuestion) => {
      console.log(1)
      currentRow.value = row
      editTitleData.value = row.name
      dialogVisible.value = true
    }

    const viewCollectionDetail = (row: TQuestion) => {
      router.push({
        path: '/home/collection/detail',
        query: {
          key: row.key
        }
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
            </div>
            <div class='table-container'>
              <el-table
                ref="multipleTable"
                loading={dataLoading.value}
                data={pageData.lists}
                tooltip-effect="dark"
                style={{ width: '100%' }}
                empty-text='暂无数据，快去创建一条吧！'
                onSelection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="标题" prop='name' width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="描述" prop='describe' width="320" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态" width="80" v-slots={{
                  default: ({ row }: { row: TQuestion }) => {
                    // 1 => 未发布 2 已发布 3 已过期 4 撤回
                    const danger = { 1: '未发布', 3: '已过期', 4: '已撤回' } as any
                    if (row.status === 2) return <el-button type="success" plain size='mini'>已发布</el-button>
                    else return <el-button type="danger" plain size='mini'>{danger[row.status]}</el-button>
                  }
                }}></el-table-column>
                {/* <el-table-column align='center' prop="limit_number" label="次数限制" width="120" show-overflow-tooltip></el-table-column> */}
                {/* <el-table-column prop="address" label="查询类型" width="120" show-overflow-tooltip></el-table-column> */}
                {/* <el-table-column align='center' prop="excel_total_row" label="数据总行数" width="120" show-overflow-tooltip></el-table-column> */}
                <el-table-column prop="createTime" label="提交时间" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="action" label="操作" v-slots={
                  {
                    default: ({ row }: { row: TQuestion }) => {
                      return (
                        <div class='action-btns'>
                          <el-row>
                            {/* <el-button type="primary" size='mini'>统计编辑</el-button> */}
                            <el-button type="primary" size='mini' onClick={() => { router.push({
                              path: '/creator/form',
                              query: {
                                key: row.key,
                                t: +(new Date())
                              }
                            }) }}>编辑</el-button>
                            <el-button type="success" size='mini' onClick={() => { viewCollectionDetail(row) }}>查看收集表单</el-button>
                            {/* <el-button type="primary" size='mini'>导出</el-button> */}
                            <el-button type="warning" size='mini'>暂停</el-button>
                            <el-button type="danger" size='mini'>删除</el-button>
                          </el-row>
                        </div>
                      )
                    }
                  }
                } />
              </el-table>
            </div>
          </div>
        </div>
        {renderEditTitle()}
      </div>
    )
  }
})
