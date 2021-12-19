import { defineComponent, reactive } from 'vue'
import style from './style.module.scss'
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
export default defineComponent({
  props: {

  },
  setup() {
    const validateAccount = (rule: any, value: any, callback: any) => {
      const reg1 = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      const reg2 = /^(?:0|86|\+86)?1[3456789]\d{9}$/
      if (reg1.test(value) || reg2.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的账号'))
      }
    }
    const state = reactive({
      formType: 'login',
      enableWx: false,
      accountForm: {
        account: '',
        email: '',
        phoneNumber: '',
        password: '',
        code: ''
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
      },
      phoneRegRules: {
        phoneNumber: [
          {required: true, trigger: 'blur', message: '请输入手机号'},
          {
            pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
            message: '请输入正确的手机号'
          }
        ],
        password: [
          {required: true, trigger: 'blur', message: '请输入新密码'},
          {
            pattern: constants.passwordReg,
            message: constants.passwordRegDesc
          }
        ],
        code: {required: true, trigger: 'blur', message: '请输入验证码'}
      },
      emailRegRules: {
        email: [
          {required: true, trigger: 'blur', message: '请输入邮箱'},
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: '请输入正确的邮箱'
          }
        ],
        password: [
          {required: true, trigger: 'blur', message: '请输入新密码'},
          {
            pattern: constants.passwordReg,
            message: constants.passwordRegDesc
          }
        ],
        code: {required: true, trigger: 'blur', message: '请输入验证码'}
      },
      phoneValidateCodeBtnText: '发送验证码',
      emailValidateCodeBtnText: '发送验证码',
      qqLoginAuthorizeUrl: '',
      regType: 'regPhone',
      loginType: 'wx',
      agreeProtocol: '',
      wxQrCodeLoading: false
    })

    function redirectUrl(url: string) {
      console.log(url)
      location.href = url
    }

    return () => (
      <div class={style['login-container']}>
        <el-row class="login-body">
          <el-col offset={4} span={5}>
            <img class="login-img" src={require('@/assets/images/5b968a75b5e42.png')} />
          </el-col>
          <el-col offset={3} span={10}>
            {state.formType=='login' ? <el-tabs
              modelValue={state.loginType} onInput={(val: string) => { state.loginType = val }}
              class="login-form-tab"
            >
              {state.enableWx ? <el-tab-pane label="微信扫码登录" name="wx">
                <div class="wx-login">
                  <div>
                    <el-image
                      v-loading={state.wxQrCodeLoading}
                      src="wxLoginQrCode"
                      class="wx-login-qrcode"
                      fit="fill"
                      onLoad={(e: any)=>{
                        state.wxQrCodeLoading = false
                      }}
                    />
                  </div>
                  <div>
                    <el-link
                      underline={false}
                      icon="el-icon-refresh-left"
                      onclick="getLoginWxQrCode"
                    >刷新二维码</el-link>
                  </div>
                  <el-divider class="divider-width" />
                  <el-row>
                    <el-col span={6}>
                      <el-link class="login-tip" onclick="toForgetPwdHandle">忘记密码</el-link>
                    </el-col>
                    <el-col span={6}>
                      <el-link class="login-tip">
                        <el-link class="login-tip" onclick="()=>{this.formType='reg'}">立即注册</el-link>
                      </el-link>
                    </el-col>
                    <el-col offset={3} span={9}>
                      <div class="other-login">
                        <span onClick={() => { redirectUrl(state.qqLoginAuthorizeUrl) }}>
                          <svg-icon class="other-login-icon" name="loginQQ" />
                        </span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-divider class="divider-width" />
                  <p class="login-tip">关于登录</p>
                  <p class="login-tip">
                    若微信扫码失败，请打开 微信授权页面 登录
                    若QQ登录填鸭云异常，可查阅 帮助文档
                    若因微信、QQ、公众号冻结或账号密码找回失败等无法登录，可 自助申请 登录账号
                  </p>
                </div>
              </el-tab-pane> : ''}
              <el-tab-pane label="账号密码登录" name="account">
                <el-form
                  ref="accountLoginForm"
                  model={state.accountForm}
                  rules={state.accountLoginRules}
                  class="account-login-form"
                  hide-required-asterisk
                  label-position="top"
                  size="small"
                  status-icon
                  // onkeyup.enter.native="loginHandle"
                >
                  <el-form-item label="手机号/邮箱登录" prop="account">
                    <el-input modelValue={state.accountForm.account} onInput={(val: string) => { state.accountForm.account = val }} autocomplete="off" placeholder="请输入手机号/邮箱" />
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input modelValue={state.accountForm.password} onInput={(val: string) => { state.accountForm.password = val }} autocomplete="off" placeholder="请输入密码" show-password />
                  </el-form-item>
                  <el-form-item label="">
                    <el-row align="middle" type="flex">
                      <el-col span={3}>
                        <el-radio modelValue={state.agreeProtocol} onInput={(val: string) => { state.agreeProtocol = val }} label="" />
                      </el-col>
                      <el-col span={4}>
                        <span class="protocol-tip">我已同意</span>
                      </el-col>
                      <el-col span={10}>
                        <el-link underline={false} class="protocol-tip" type="primary">《用户服务协议》</el-link>
                      </el-col>
                      <el-col offset={1} span={6}>
                        <el-link underline={false} class="protocol-tip" type="primary"onclick="toForgetPwdHandle">忘记密码？</el-link>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="width-full" type="primary" onclick="loginHandle">登录</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-row align="middle" type="flex">
                      <el-col offset={6} span={8}>
                        <span class="protocol-tip">使用第三方登录 或 </span>
                      </el-col>
                      <el-col span={6}>
                        <el-link underline={false} class="protocol-tip" type="primary" onclick="()=>{this.formType='reg'}">立即注册</el-link>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col offset={8}>
                        <div class="other-login">
                          <span onClick={() => {redirectUrl(state.qqLoginAuthorizeUrl)}}>
                            <svg-icon class="other-login-icon" name="loginQQ" />
                          </span>
                          <svg-icon
                            class="other-login-icon"
                            name="loginWx"
                            onClick={()=>{
                              state.formType='login'
                              state.loginType='wx'
                            }}
                          />
                        </div>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs> : ''}
            {state.formType === 'reg' ? <><el-tabs
              modelValue={state.regType}
              class="register-form"
            >
              <el-tab-pane label="手机号注册" name="regPhone">
                <el-form ref="phoneRegForm" model={state.accountForm} rules={state.phoneRegRules} label-width="0px">
                  <el-form-item label="" prop="phoneNumber">
                    <el-input modelValue={state.accountForm.phoneNumber} onInput={(val: string) => { state.accountForm.phoneNumber = val }} autocomplete="off" placeholder="请输入手机号" />
                  </el-form-item>
                  <el-form-item label="" prop="password">
                      <el-input modelValue={state.accountForm.password} onInput={(val: string) => { state.accountForm.password = val }} autocomplete="off" placeholder="请输入密码" show-password />
                  </el-form-item>
                  <el-form-item label="" prop="code">
                    <el-input modelValue={state.accountForm.code} onInput={(val: string) => { state.accountForm.code = val }} autocomplete="off" class="code-input" placeholder="请输入验证码" />
                    <el-button disabled="phoneValidateCodeBtn" class="ml-20" type="primary" onclick="sendPhoneCodeHandle" >
                      {state.phoneValidateCodeBtnText }
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="width-full" type="primary" onclick="phoneRegHandle">确定</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="邮箱注册" name="regEmail">
                <el-form ref="emailRegForm" model={state.accountForm} rules={state.emailRegRules} label-width="0px" status-icon>
                  <el-form-item label="" prop="email">
                    <el-input modelValue={state.accountForm.email} onInput={(val: string) => { state.accountForm.email = val }} autocomplete="off" placeholder="请输入邮箱" />
                  </el-form-item>
                  <el-form-item label="" prop="password">
                    <el-input modelValue={state.accountForm.password} onInput={(val: string) => { state.accountForm.password = val }} autocomplete="off" placeholder="请输入密码" show-password />
                  </el-form-item>
                  <el-form-item label="" prop="code">
                    <el-input
                      modelValue={state.accountForm.code} onInput={(val: string) => { state.accountForm.code = val }}
                      autocomplete="off"
                      class="code-input"
                      maxlength="4"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="请输入验证码"
                    />
                    <el-button disabled="emailValidateCodeBtn" class="ml-20" type="primary" onclick="sendEmailCodeHandle">
                      {state.emailValidateCodeBtnText }
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="width-full" type="primary" onclick="emailRegHandle">确定</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <div class="flex-row">
                <el-link class="ml-20 link-btn" onclick="toForgetPwdHandle">忘记密码</el-link>
                <el-link class="ml-20 link-btn" onclick="registerHandleClick">立即注册</el-link>
                <div class="other-login">
                  <span onClick={() => { redirectUrl(state.qqLoginAuthorizeUrl) }}>
                    <svg-icon class="other-login-icon" name="loginQQ" />
                  </span>
                  <svg-icon
                    class="other-login-icon"
                    name="loginWx"
                    onClick={()=>{
                      state.formType='login',
                      state.loginType='wx'
                    }}
                  />
                </div>
              </div>
            </el-tabs></> : ''}
          </el-col>
        </el-row>
      </div>
    )
  }
})
