import { useUser } from '@/composables/useUser'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import css from './index.module.scss'

type TCommand = 'profile' | 'logout'

export default defineComponent({
  name: 'Home',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { logOut, user, isLogin } = useUser()
    function handleCommand(command: TCommand) {
      if (command === 'profile') {
        router.push({
          path: '/account/profile'
        })
      } else if (command === 'logout') {
        logOut()
      }
    }

    return () => (
      <div class={css['home-header']}>
        <div class='header-content'>
          <div class='header-logo'>
            <h1>LOGO</h1>
          </div>
          <ul class='header-nav'>
            <router-link tag='li' to={{ path: '/' }} class={['header-nav__item', route.path === '/' ? 'link-active' : '']}><span>首页</span></router-link>
            <router-link tag='li' to={{ path: '/home/start' }} class={['header-nav__item', route.path === '/home/start' ? 'link-active' : '']}><span>【新建】查询/采集</span></router-link>
            <router-link tag='li' to={{ path: '/home/queryList' }} class={['header-nav__item', route.path === '/home/queryList' ? 'link-active' : '']}><span>查询列表</span></router-link>
            <router-link tag='li' to={{ path: '/home/collection/list' }} class={['header-nav__item', route.path === '/home/collection/list' ? 'link-active' : '']}><span>信息采集列表</span></router-link>
          </ul>
          <div class='header-left'>
            {isLogin.value ? <el-dropdown onCommand={handleCommand}
              v-slots={{
                dropdown: () => {
                  return <el-dropdown-menu>
                  {/* <el-dropdown-item command="">修改密码</el-dropdown-item> */}
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
                }
              }}
            >
              <span class="el-dropdown-link">
               {user!.user_name ? user!.user_name : user?.user_account}<el-icon class="el-icon--right"><i class='el-icon-arrow-down' /></el-icon>
              </span>
            </el-dropdown> : <div class='create-button' onClick={() => { router.push({path: '/account/login'}) }}>立即登录</div>}
          </div>
        </div>
      </div>
    )
  }
})
