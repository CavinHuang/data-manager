import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import UserHeader from './components/userHeader'
import css from './index.module.scss'

export default defineComponent({
  name: 'HomeUser',
  setup () {
    const router = useRouter()
    const goStart = () => {
      router.push({
        path: '/home/start'
      })
    }
    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class='page-content'>
          <div class={css['ad-banner']}>一分钟创建自己查询采集平台</div>
          <div class={css['main-container']}>
            <div class='main-title'>查询/采集列表地址:</div>
            <div class='main-content'>
              <div class='content-item' onClick={goStart}>
                <i class='icon icon-add'></i>
                <span>【新建】查询/采集</span>
              </div>
              <div class='content-item'>
                <i class='icon icon-note'></i>
                <span>查询/采集【管理】</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
