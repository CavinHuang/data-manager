import { createQuestionService } from '@/apis/modules/question'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from './components/userHeader'
import css from './index.module.scss'

export default defineComponent({
  name: 'HomeUser',
  setup () {
    const router = useRouter()
    const goQuery = () => {
      router.push({
        path: '/home/query'
      })
    }
    const createQuestion = () => {
      const postData = {
        name: '收集项目名称',
        describe: '为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位\n用户的宝贵意见，期待您的参与！现在我们就马上开始吧！'
      }

      createQuestionService(postData).then(res => {
        if (res) {
          router.push({
            path: '/creator/index',
            query: {
              key: res.key
            }
          })
        }
      })
    }
    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class='page-content'>
          <div class={[css['main-container'], 'mt_20']}>
            <div class='block-title'>请选择一项继续</div>
            <div class='main-content mt_40'>
              <div class='content-item'>
                <div class='add-wrapper' onClick={goQuery}>
                  <i class='icon icon-query'></i>
                  <span>新建查询</span>
                </div>
              </div>
              <div class='content-item'>
                <div class='add-wrapper' onClick={createQuestion}>
                  <i class='icon icon-query'></i>
                  <span>新建采集</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
