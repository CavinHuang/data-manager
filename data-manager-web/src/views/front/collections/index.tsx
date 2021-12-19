import { saveResult } from '@/apis/modules/question'
import { defineComponent, reactive } from 'vue'
import ProjectForm from '../../collections/preview/ProjectForm'
import uaParser from 'ua-parser-js'
import { useRoute } from 'vue-router'
import { settingDetail } from '@/apis/modules/setting'
import { Setting } from '@/apis/types/setting'
import style from './style.module.scss'
import '@/utils/ut'
const ua = uaParser(navigator.userAgent)
const defaultValue = {
    projectShareTitle: '表单',
    projectShareDesc: '快来填写吧',
    projectShareImg: 'https://qiniu.smileyi.top/c4ca4238a0b923820dcc509a6f75849b/4b2c7071f3f543549907b9e3b41df1ed.png',
    projectSubmitPromptText: '您已完成本次填写，感谢您的帮助与支持'
}
type TState = {
  writeNotStartPrompt: string
  userProjectSetting: Setting
  projectConfig: {
    projectKey: string
    preview: boolean
    showBtns: boolean
  }
  writeStatus: number
  globalDefaultValue: typeof defaultValue
}
export default defineComponent({
  props: {

  },
  setup() {
    const route = useRoute()
    const state = reactive<TState>({
      writeNotStartPrompt: '',
      userProjectSetting: {
        projectKey: '',
        submitPromptImg: '',
        submitPromptText: '',
        submitJumpUrl: '',
        publicResult: false,
        wxWrite: false,
        wxWriteOnce: false,
        everyoneWriteOnce: false,
        everyoneDayWriteOnce: false,
        writeOncePromptText: '',
        newWriteNotifyEmail: '',
        newWriteNotifyWx: '',
        recordWxUser: false,
        timedCollectionBeginTime: '',
        timedCollectionEndTime: '',
        timedNotEnabledPromptText: '',
        timedDeactivatePromptText: '',
        timedQuantitativeQuantity: '',
        timedEndPromptText: '',
        shareImg: '',
        shareTitle: '',
        shareDesc: '',
      },
      projectConfig: {
        projectKey: route.params.key as string,
        preview: false,
        showBtns: true
      },
      writeStatus: 1,
      globalDefaultValue: defaultValue
    })
    function queryProjectSetting() {
      settingDetail(state.projectConfig.projectKey).then(res => {
        state.userProjectSetting = res
        // state.writeStatus = 0
        // state.writeNotStartPrompt = res.writeOncePromptText
        // 仅在微信环境打开
        // if (res.data && res.data.wxWrite) {
        //   // 记录微信用户信息
        //   if (res.data.recordWxUser && !this.wxAuthorizationCode) {
        //     location.href = this.wxAuthorizationUrl
        //   } else {
        //     this.onlyWxOpenHandle()
        //   }
        // }
      })
    }
    queryProjectSetting()
    function queryProjectSettingStatus() {
      // 是否能进入填写
      // this.$api.get('/user/project/setting-status', {
      //   params: {
      //     projectKey: this.projectConfig.projectKey,
      //     wxOpenId: this.wxUserInfo ? this.wxUserInfo.openid : ''
      //   }
      // }).then(res => {
      //   if (res.msg) {
      //     this.writeNotStartPrompt = res.msg
      //     this.writeStatus = 0
      //   }
      // })
    }

    const submitForm = (data: any) => {
      // 完成时间
      let inActiveTime = document.getElementById('inActiveTime')!.innerText
      saveResult({
        'completeTime': inActiveTime,
        'projectKey': state.projectConfig.projectKey,
        'submitOs': ua.os.name,
        'submitBrowser': ua.browser.name,
        'submitUa': ua,
        // 'wxUserInfo': state.wxUserInfo,
        // 'wxOpenId': state.wxUserInfo ? state.wxUserInfo.openid : '',
        'originalData': data.formModel,
        'processData': data.labelFormModel
      }).then(() => {
        state.writeStatus = 2
        if (state.userProjectSetting.submitJumpUrl) {
          setTimeout(() => {
            window.location.replace(state.userProjectSetting.submitJumpUrl)
          }, 1000)
        }
      })
    }

    const openPublicResultHandle = () => {}

    return () => (
      <div class={style['write-container']}>
        <h1 id="inActiveTime" style="display: none;" />
        {state.writeStatus === 0? <div class="title-icon-view">
          <div class="icon-view">
            <i class="el-icon-check success-icon" />
          </div>
          {state.writeNotStartPrompt ? <p style="text-align: center;">
            <span>{state.writeNotStartPrompt}</span>
          </p> : ''}
        </div> : ''}
        {state.writeStatus === 1 ? <div>
          {state.projectConfig.projectKey ? <ProjectForm
            project-config={state.projectConfig}
            onSubmit={submitForm}
          /> : ''}
        </div> : ''}
        {state.writeStatus === 2 ? <div class="title-icon-view">
          <div class="icon-view">
            <i class="el-icon-check success-icon" />
          </div>
          <p style="text-align: center;">
            {state.userProjectSetting.submitPromptText ? <span>{state.userProjectSetting.submitPromptText}</span> : <span>{ state.globalDefaultValue.projectSubmitPromptText }</span>}
          </p>
          <div>
            {state.userProjectSetting.submitPromptImg ? <el-image
              src={state.userProjectSetting.submitPromptImg}
              fit="cover"
            /> : ''}
          </div>
          {state.userProjectSetting.publicResult ? <el-button type="primary" onClick={openPublicResultHandle}>查看数据</el-button> : ''}
        </div> : ''}
      </div>
    )
  }
})
