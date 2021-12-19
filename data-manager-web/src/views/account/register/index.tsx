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
    onSuccess: Function,
    toReg: Function
  },
  setup(props) {
    const state = reactive({
      regType: 'regPhone',
      accountForm: {
        email: '',
        phoneNumber: '',
        password: '',
        code: ''
      },
      phoneValidateCodeBtnText: '发送验证码',
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
        // code: {required: true, trigger: 'blur', message: '请输入验证码'}
      },
      formType: ''
    })

    const sendPhoneCodeHandle = () => {}
    const phoneRegHandle = () => {}
    const toForgetPwdHandle = () => {}
    return () => (
      <div class={style['register-container']}>
        <p class="tips">注册成为xxx信息系统用户~</p>
        <el-tabs modelValue={state.regType} onInput={(val: string) => { state.regType = val }} class="register-form">
          <el-tab-pane label="手机号注册" name="regPhone">
            <el-form ref="phoneRegForm" model={state.accountForm} rules={state.phoneRegRules} label-width="0px">
              <el-form-item label="" prop="phoneNumber">
                <el-input
                  modelValue={state.accountForm.phoneNumber}
                  onInput={(val: string) => { state.accountForm.phoneNumber = val}}
                  prefix-icon="el-icon-user-solid"
                  autocomplete="off"
                  placeholder="请输入手机号"
                />
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  modelValue={state.accountForm.password}
                  onInput={(val: string) => { state.accountForm.password = val}}
                  autocomplete="off"
                  placeholder="请输入密码"
                  show-password
                  prefix-icon="el-icon-lock"
                />
              </el-form-item>
              {/* <el-form-item label="" prop="code">
                <el-input
                  modelValue={state.accountForm.code}
                  onInput={(val: string) => { state.accountForm.code = val}}
                  autocomplete="off"
                  class="code-input"
                  placeholder="请输入验证码"
                >
                  <font-icon
                    slot="prefix"
                    class=" el-input__icon fa fa-shield"
                  />
                </el-input>
                <el-button
                  disabled="phoneValidateCodeBtn"
                  class="ml-20"
                  type="primary"
                  onClick={sendPhoneCodeHandle}
                >
                  { state.phoneValidateCodeBtnText }
                </el-button>
              </el-form-item> */}
              <el-form-item>
                <el-button class="width-full" type="primary" onClick={phoneRegHandle}>注册</el-button>
                {/* <el-link class="ml-20 link-btn" onClick={toForgetPwdHandle}>忘记密码</el-link> */}
                <el-link class="ml-20 link-btn" onClick={() => { props.toReg && props.toReg() }}>有账号，去登录!</el-link>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          {/* <el-tab-pane label="邮箱注册" name="regEmail">
            <el-form
              ref="emailRegForm"
              model="accountForm"
              rules="emailRegRules"
              label-width="0px"
              status-icon
            >
              <el-form-item label="" prop="email">
                <el-input v-model="accountForm.email" prefix-icon="el-icon-user-solid" autocomplete="off" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  v-model="accountForm.password"
                  autocomplete="off"
                  placeholder="请输入密码"
                  prefix-icon="el-icon-lock"
                  show-password
                />
              </el-form-item>
              <el-form-item label="" prop="code">
                <el-input
                  v-model="accountForm.code"
                  autocomplete="off"
                  class="code-input"
                  maxlength="4"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入验证码"
                >
                  <font-icon
                    slot="prefix"
                    class=" el-input__icon fa fa-shield"
                  />
                </el-input>
                <el-button
                  disabled="emailValidateCodeBtn"
                  class="ml-20"
                  type="primary"
                  @click="sendEmailCodeHandle"
                >
                  { emailValidateCodeBtnText }
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="width-full" type="primary" @click="emailRegHandle">确定</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane> */}
        </el-tabs>
      </div>
    )
  }
})
