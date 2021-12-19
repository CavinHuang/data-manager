import { defineComponent,onMounted,reactive,ref } from 'vue'
import LoginWrapper from './loginWrapper'
import css from './index.module.scss'
import { TRegisterParams } from '@/apis/types/user'
import { login, regsiter } from '@/apis/modules/user'
import { accessPlat } from '@/config'
import { store } from '@/utils'
import { TOKEN_NAME, USER_INFO } from '@/config/consts'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'

export type LoginFormData = {
  phone: string
  password: string,
  plat: string
}

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const user = useUser()
    const loginState = ref(true)

    onMounted(() => {
      if (!user) loginState.value = false
    })

    const loginFormData = ref<LoginFormData>({
      phone: '',
      password: '',
      plat: accessPlat
    })
    const isLogin = ref(true)
    const loginForm = ref<any>(null)
    const checkLoginRule = {
      phone: [
        { required: true,message: '手机号码不能为空',trigger: 'blur' },
      ],
      password: [
        { required: true,message: '密码不能为空',trigger: 'blur' }
      ]
    }
    const goStart = () => {
      router.push({
        path: '/home/user'
      })
    }
    const toRegister = () => {
      isLogin.value = false
    }
    const doLogin = () => {
      if (loginForm) {
        loginForm.value.validate((valided: any) => {
          if (valided) {
            login(loginFormData.value).then(res => {
              console.log(res)
              // 保存用户信息
              store.set(TOKEN_NAME, res.access_token)
              store.set(USER_INFO, res.user)
              loginState.value = true
              goStart()
            })
          }
        })
      }
    }
    const renderLogin = () => {
      return (
        <LoginWrapper title='账号登录'>
          <el-form
            model={loginFormData}
            status-icon
            rules={checkLoginRule}
            ref={loginForm}
            label-width="0"
            class="demo-ruleForm"
          >
            <div class={css['login-content']}>
              <el-form-item label="" prop="phone">
                <div class='form-item'>
                  <el-input modelValue={loginFormData.value.phone} placeholder='请输入您的手机号' onInput={(val: string) => { loginFormData.value.phone = val }} />
                </div>
              </el-form-item>
              <el-form-item label="" prop="password">
                <div class='form-item'>
                  <el-input modelValue={loginFormData.value.password} show-password  placeholder='请输入您的密码' onInput={(val: string) => { loginFormData.value.password = val }} />
                </div>
              </el-form-item>
            </div>
            <el-button class='login-btn' onClick={doLogin}>登录</el-button>
            <div class='login-wrapper-footer'>
              <div class='login-item' onClick={toRegister}>新用户注册</div>
              <div class='login-item'>找回密码</div>
            </div>
          </el-form>
        </LoginWrapper>
      )
    }

    const renderUserInfo = () => {
      return (
        <LoginWrapper>
          <div class={css['user-card']}>
            <div class='user-name'>用户姓名：{user!.user_truename}({user!.user_account})</div>
            <div class='user-name'>用户账号：{user!.user_account}</div>
            <div class='user-name'>单位：{ user?.user_unit }</div>
            <el-button class='user-btn' type='primary' size='medium' onClick={goStart}>开始查询/采集</el-button>
          </div>
        </LoginWrapper>
      )
    }

    const registerData = ref<TRegisterParams>({
      phone: '',
      password: '',
      password_confirm: '',
      true_name: '',
      unit: ''
    })
    const validatorPhone = function (rule: any,value: string,callback: any) {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    const userPassWord = (rule: any,value: string,callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== registerData.value.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    const checkRegisterRule = {
      phone: [
        { required: true,message: '手机号码不能为空',trigger: 'blur' },
        { validator: validatorPhone,trigger: 'blur' },
      ],
      true_name: [
        { required: true,message: '姓名不能为空',trigger: 'blur' }
      ],
      unit: [
        { required: true,message: '单位不能为空',trigger: 'blur' }
      ],
      password: [
        { required: true,message: '密码不能为空',trigger: 'blur' }
      ],
      password_confirm: [
        { required: true,validator: userPassWord,trigger: 'blur' }
      ],
    }
    const form = ref<any>(null)
    const doRegister = () => {
      if (form) {
        console.log(form)
        form.value.validate((valid: any) => {
          if (valid) {
            regsiter(registerData.value).then(res => {
              console.log(res)
              isLogin.value = true
            })
          }
        })
      }
    }

    const fieldInput = (field: keyof TRegisterParams,val: string) => {
      registerData.value[field] = val
    }
    const renderRegister = () => {
      return (
        <LoginWrapper>
          <div class={css['register-wrapper']}>
            <div class='tips'>注:只有单位才能发布查询和收集</div>
            <div class='title-block'>
              <h1>单位注册</h1>
              <span class='back-login'>返回登录</span>
            </div>
          </div>
          <div class={css['login-content']}>
            <el-form
              model={registerData}
              status-icon
              rules={checkRegisterRule}
              ref={form}
              label-width="0"
              class="demo-ruleForm"
            >
              <el-form-item label="" prop="phone">
                <div class='form-item'>
                  <el-input size='medium' modelValue={registerData.value.phone} placeholder='请输入您的手机号' onInput={(val: string) => fieldInput('phone',val)} />
                </div>
              </el-form-item>
              <el-form-item label="" prop="true_name">
                <div class='form-item'>
                  <el-input modelValue={registerData.value.true_name} placeholder='请输入您的姓名' onInput={(val: string) => { registerData.value.true_name = val }} />
                </div>
              </el-form-item>
              <el-form-item label="" prop="unit">
                <div class='form-item'>
                  <el-input modelValue={registerData.value.unit} placeholder='请确认您的单位' onInput={(val: string) => { registerData.value.unit = val }} />
                </div>
              </el-form-item>
              <el-form-item label="" prop="password">
                <div class='form-item'>
                  <el-input show-password modelValue={registerData.value.password} placeholder='请输入您的密码' onInput={(val: string) => { registerData.value.password = val }} />
                </div>
              </el-form-item>
              <el-form-item label="" prop="password_confirm">
                <div class='form-item'>
                  <el-input show-password modelValue={registerData.value.password_confirm} placeholder='请确认您的密码' onInput={(val: string) => { registerData.value.password_confirm = val }} />
                </div>
              </el-form-item>
              <el-button class='login-btn' onClick={doRegister}>注  册</el-button>
            </el-form>
          </div>
        </LoginWrapper>
      )
    }

    return () => loginState.value ? renderUserInfo() : (isLogin.value ? renderLogin() : renderRegister())
  }
})
