import { useUser } from '@/composables/useUser'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import css from './index.module.scss'

export default defineComponent({
  name: 'Home',
  setup () {
    const { user, isLogin } = useUser()
    const router = useRouter()
    return () => (
      <div class={css['home-header']}>
        <div class='header-content'>
          <div class='header-logo'>
            <h1>LOGO</h1>
          </div>
          <ul class='header-nav'>
            <router-link tag='li' to={{ path: '/' }} class='header-nav__item'><span>视频教程</span></router-link>
            <router-link tag='li' to={{ path: '/' }} class='header-nav__item'><span>操作教程</span></router-link>
            <router-link tag='li' to={{ path: '/' }} class='header-nav__item'><span>常见问题</span></router-link>
          </ul>
          <div class='header-left'>
            {isLogin.value ? <div class='create-button' onClick={() => { router.push({ path: '/home/start' }) }}>开始创建</div> : <div class='create-button' onClick={() => { router.push({ path: '/account/login' }) }}>登录</div>}
          </div>
        </div>
      </div>
    )
  }
})
