import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
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
    const $router = useRouter()
    const state = reactive({
      retrieveStep: 1,
      retrieveType: 'phone',
      retrieveAccountForm: {
        phoneNumber: '',
        email: '',
        password: '',
        code: ''
      },
      phoneRules: {
        phoneNumber: [
          { required: true, trigger: 'blur', message: '请输入手机号' },
          {
            pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
            message: '请输入正确的手机号'
          }
        ],
        code: { required: true, trigger: 'blur', message: '请输入验证码' }
      },
      emailRules: {
        email: [
          { required: true, trigger: 'blur', message: '请输入邮箱' },
          {
            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            message: '请输入正确的邮箱'
          }
        ]
      },
      resetPwdForm: {
        code: '',
        password: '',
        rePassword: ''
      },
      pwdRules: {
        password: [
          { required: true, trigger: 'blur', message: '请输入新密码' },
          {
            pattern: constants.passwordReg,
            message: constants.passwordRegDesc
          }
        ],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRePass }]
      },
      resetAccount: ''
    })
    function validateRePass (rule: any, value: any, callback: any) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== state.resetPwdForm.rePassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const phoneRetrievePassWordHandle = () => {}
    const sendEmailValidateHandle = () => {}
    return () => (
      <div class="app-container">
        <>
          {state.retrieveStep === 1 ? <div class="pwd-container">
            <img
              class="header-logo-img"
              src={require('@/assets/images/indexLogo.svg')}
              onClick={() => {
                $router.push({path:'/'})
              }}
            />
            <h4 class="title">找回密码</h4>
            <el-tabs
              modelValue={state.retrieveType}
              onInput={(val: string) => { state.retrieveType = val }}
              class="login-form"
            >
              <el-tab-pane label="手机找回" name="phone">
                <el-form ref="phoneForm" model={state.retrieveAccountForm} rules={state.phoneRules} label-width="0px">
                  <el-form-item prop="phoneNumber">
                    <el-input
                      modelValue={state.retrieveAccountForm.phoneNumber}
                      onInput={(val: string) => { state.retrieveAccountForm.phoneNumber = val }}
                      autocomplete="off"
                      placeholder="请输入手机号"
                    />
                  </el-form-item>
                  {/* <el-form-item label="" prop="code">
                    <el-input modelValue={state.retrieveAccountForm.code} class="width50" autocomplete="off" placeholder="请输入验证码" />
                    <el-button
                        disabled="emailValidateCodeBtn"
                        class="ml-20"
                        type="primary"
                        onClick={sendPhoneValidateCodeHandle}
                    >
                        {{ emailValidateCodeBtnText }}
                    </el-button>
                  </el-form-item> */}
                  <el-form-item>
                    <el-button class="width-full" type="primary" onClick={phoneRetrievePassWordHandle}>
                      找回密码
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="邮箱找回" name="email">
                <el-form
                  ref="emailForm"
                  model={state.retrieveAccountForm}
                  rules={state.emailRules}
                  label-width="0px"
                  status-icon
                >
                    <el-form-item label="" prop="email">
                      <el-input v-model="retrieveAccountForm.email" autocomplete="off" placeholder="请输入邮箱" />
                    </el-form-item>
                    <el-form-item>
                      <el-button class="width-full" type="primary" onClick={sendEmailValidateHandle}>
                          找回密码
                      </el-button>
                    </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div> : ''}
          {state.retrieveStep === 2 ? <div class="reset-pwd-view">
            <img
              class="header-logo-img"
              src={require('@/assets/images/indexLogo.svg')}
              onClick={() => {
                $router.push({path:'/'})
              }}
            />
            <h4 class="title">重置密码</h4>
              <div class="rest-pwd-user-view">
                <i class="el-icon-user" />
                <span>{state.resetAccount}</span>
              </div>
              <el-form ref="resetPwdForm" model={state.resetPwdForm} rules={state.pwdRules} label-width="0px">
                <el-form-item label="" prop="password">
                  <el-input
                    modelValue={state.resetPwdForm.password}
                    autocomplete="off"
                    placeholder="请输入密码"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="" prop="rePassword">
                  <el-input
                    modelValue={state.resetPwdForm.rePassword}
                    autocomplete="off"
                    placeholder="请再次输入密码"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" onclick="resetPasswordHandle">提交</el-button>
                </el-form-item>
              </el-form>
          </div> : ''}
          <div v-if="retrieveStep==3" class="msg-view">
            <p>
              我们已向你的邮箱中发送了重置密码的邮件，请查看并点击邮件中的链接。
              没有收到邮件？请检查您的垃圾邮件或者重新发送
            </p>
          </div>
        </>
      </div>
    )
  }
})
