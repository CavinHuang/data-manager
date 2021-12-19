import { defineComponent, reactive, ref } from 'vue'
import style from './style.module.scss'
import Register from '../register'
import { accessPlat } from '@/config'
import { login } from '@/apis/modules/user'
import { store } from '@/utils'
import { TOKEN_NAME, USER_INFO } from '@/config/consts'
import { useRoute, useRouter } from 'vue-router'

const constants = {
  // 签名秘钥
  signSecret: '916lWh2WMcbSWiHv',
  // 密码正则
  passwordReg: /^.{6,}$/,
  passwordRegDesc: '密码最少为6位字符',
  userUploadUrl: `${process.env.VUE_APP_API_ROOT}/user/file/upload`,
  // 启用微信功能
  enableWx: process.env.VUE_APP_WX == 'ON'
}

const validateAccount = (rule: any, value: any, callback: any) => {
  const reg1 = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  const reg2 = /^(?:0|86|\+86)?1[3456789]\d{9}$/
  if (reg1.test(value) || reg2.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的账号'))
  }
}

export default defineComponent({
  props: {

  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      formType: 'login',
      loginType: 'account',
      enableWx: false,
      wxQrCodeLoading: false,
      wxLoginQrCode: '',
      qqLoginAuthorizeUrl: '',
      accountForm: {
        account: '',
        email: '',
        phoneNumber: '',
        password: ''
      },
      accountLoginRules: {
        account: [
          {required: true, trigger: 'blur', message: '请输入账号'}, {trigger: 'blur', validator: validateAccount}],
        password: [
          {required: true, trigger: 'blur', message: '请输入新密码'},
          {
            pattern: constants.passwordReg,
            message: constants.passwordRegDesc
          }
        ]
      }
    })
    const accountLoginForm = ref<any>(null)
    const getLoginWxQrCode = () => {}
    const goStart = () => {
      const to = route.query.to as string
      if (to) {
        router.push({
          path: decodeURIComponent(to)
        })
      } else {
        router.push({
          path: '/home/user'
        })
      }
    }
    const loginHandle = () => {
      if (accountLoginForm) {
        accountLoginForm.value.validate((valided: any) => {
          if (valided) {
            const postData = {
              phone: state.accountForm.account,
              password: state.accountForm.password,
              plat: accessPlat
            }
            login(postData).then(res => {
              console.log(res)
              // 保存用户信息
              store.set(TOKEN_NAME, res.access_token)
              store.set(USER_INFO, res.user)
              goStart()
            })
          }
        })
      }
    }
    const toForgetPwdHandle = () => {}
    const redirectUrl = (url: string) => { location.href = url }
    const registerSuccessHandle = () => {}
    return () => (
      <div class={style['login-container']}>
        <div class="logo-banner">
          <img src={require('@/assets/images/logo_banner.png')} />
        </div>
        <div class="logo-content">
          <span class="hello">Hello ，</span>
          <span class="tips">欢迎使用XXX信息系统！</span>
          {state.formType=='login' ? <><el-tabs modelValue={state.loginType} class="login-form-tab">
            {state.enableWx ? <el-tab-pane label="微信扫码登录" name="wx">
              <div class="wx-login">
                <div class="flex-center">
                  <el-image
                    v-loading={state.wxQrCodeLoading}
                    src={state.wxLoginQrCode}
                    class="wx-login-qrcode"
                    fit="fill"
                    onLoad={(e: any)=>{
                      state.wxQrCodeLoading=false
                    }}
                  />
                </div>
                <div class="text-center">
                  <el-link
                    underline={false}
                    icon="el-icon-refresh-left"
                    onClick={getLoginWxQrCode}
                  >刷新二维码</el-link>
                </div>
              </div>
            </el-tab-pane> : ''}
            <el-tab-pane label="账号密码登录" name="account">
              <el-form
                ref={accountLoginForm}
                model={state.accountForm}
                rules={state.accountLoginRules}
                class="account-login-form"
                hide-required-asterisk
                label-position="top"
                size="small"
                status-icon
                // @keyup.enter.native="loginHandle"
              >
                <el-form-item prop="account">
                  <el-input
                    modelValue={state.accountForm.account}
                    onInput={(val: string) => { state.accountForm.account = val }}
                    autocomplete="off"
                    placeholder="请输入手机号/邮箱"
                    prefix-icon="el-icon-user-solid"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    modelValue={state.accountForm.password}
                    onInput={(val: string) => { state.accountForm.password = val }}
                    autocomplete="off"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" onClick={loginHandle}>登录</el-button>
                  {/* <el-link class="ml-20 link-btn" onClick={toForgetPwdHandle}>忘记密码</el-link> */}
                  <el-link class="ml-20 link-btn" onClick={() => { state.formType='reg' }}>立即注册</el-link>
                </el-form-item>
                <div class="other-login" style='display: none;'>
                  <span onClick={() => { redirectUrl(state.qqLoginAuthorizeUrl) }}>
                    <svg-icon class="other-login-icon" name="loginQQ" />
                  </span>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs></> : <Register onSuccess={registerSuccessHandle} toReg={() => { state.formType='login' }} />}
          <p class="desc">
              关于XXX信息系统登录
          </p>
          <p class="desc">
              {/* 若微信扫码失败，请打开 微信授权页面 登录 若QQ登录填鸭云异常，
              可查阅 帮助文档 若因微信、QQ、公众号冻结或账号密码找回失败等
              无法登录，可 自助申请 登录账号 */}
          </p>
        </div>
      </div>
    )
  }
})
