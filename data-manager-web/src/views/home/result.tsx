import { defineComponent } from 'vue'
import UserHeader from './components/userHeader'
import css from './index.module.scss'

export default defineComponent({
  name: 'HomeUser',
  setup() {
    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class='page-content' style='width: 600px'>
          <div class={[css['main-container'],'mt_20']}>
            <div class='result-block'>
              <div class='success-title'>
                <i class='icon icon-success'></i>
                <span>发布成功</span>
              </div>
              <div class='content'>
                <p>查询网址</p>
                <div class='qrcode-wrapper'>
                  <img src={require('../../assets/images/qr-code.png')} alt='' />
                </div>
                <p class='tip'>请将上面的二维码保存发给要查询的用户进行查询.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
