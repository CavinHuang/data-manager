import { saveSetting, settingDetail } from '@/apis/modules/setting'
import { Setting } from '@/apis/types/setting'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import style from './style.module.scss'
export default defineComponent({
  props: {

  },
  setup() {
    const route = useRoute()
    const setting = ref(null)
    const userProjectSettingData = reactive<Setting>({
      submitPromptImg: '',
      wxWriteOnce: false,
      submitPromptText: '提交成功 !',
      submitJumpUrl: '',
      wxWrite: false,
      publicResult: false,
      timedNotEnabledPromptText: '填写尚未启用',
      timedDeactivatePromptText: '填写尚已经停用',
      timedQuantitativeQuantity: null,
      timedEndPromptText: '',
      everyoneWriteOnce: false,
      everyoneDayWriteOnce: false,
      timedCollectionBeginTime: '',
      timedCollectionEndTime: '',
      writeOncePromptText: '',
      newWriteNotifyEmail: '',
      newWriteNotifyWx: '',
      recordWxUser: false,
      shareImg: '',
      shareTitle: '',
      shareDesc: '',
      projectKey: ''
    })
    const settingRules = {
      newWriteNotifyEmail: [
        {
          trigger: 'blur',
          pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
          message: '请输入正确发送的邮箱'
        }
      ]
    }
    const projectSetting = reactive({
      showPromptImg: false,
      showPromptText: true,
      showSubmitJumpUrl: false,
      timingCollectForm: false,
      timingQuantitativeForm: false,
      newFeedbackRemind: false,
      newFeedbackRemindEmail: false,
      newFeedbackRemindWx: false,
      customizeShareIcon: false,
      customizeShareTitle: false,
      customizeShareDesc: false
    })
    const projectKey = computed(() => route.query.key as string)
    const logoUpload = ref<HTMLDivElement | null>(null)
    const saveUserProjectSetting = () => {
      userProjectSettingData.projectKey = projectKey.value
      saveSetting(userProjectSettingData).then(res => {
      })
    }
    const clearFieldHandle = (fields: string[]) => {}

    function queryUserProjectSetting() {
      userProjectSettingData.projectKey = projectKey.value
      settingDetail(projectKey.value).then(res => {
        if (res) {
          Object.assign(userProjectSettingData, res)
          let {
              submitPromptImg, submitPromptText, submitJumpUrl, timedCollectionBeginTime,
              timedQuantitativeQuantity, newWriteNotifyEmail, newWriteNotifyWx,
              shareImg, shareTitle, shareDesc, publicResult
          } = res
          // if (newWriteNotifyWx) {
          //     querySubNotifyWxUser(newWriteNotifyWx)
          // }
          Object.assign(projectSetting, {
            showPromptImg: !!submitPromptImg,
            showPromptText: !!submitPromptText,
            showSubmitJumpUrl: !!submitJumpUrl,
            timingCollectForm: !!timedCollectionBeginTime && !!timedQuantitativeQuantity,
            timingCollectTimeRange: !!timedQuantitativeQuantity,
            newFeedbackRemind: !!newWriteNotifyEmail || !!newWriteNotifyWx,
            newFeedbackRemindEmail: !!newWriteNotifyEmail,
            newFeedbackRemindWx: !!newWriteNotifyWx,
            customizeShareIcon: !!shareImg,
            customizeShareTitle: !!shareTitle,
            customizeShareDesc: !!shareDesc
          })
        }
      })
    }
    queryUserProjectSetting()

    return () => (
      <el-form ref={setting} model={userProjectSettingData} rules={settingRules}>
        <el-row align="top" class={style['project-setting-container']} justify="center" type="flex">
          <el-col offset={3} span={5} class="project-setting-view">
            <p class="project-setting-title">提交设置</p>
            {/* <el-row align="middle" type="flex">
              <el-col span={12}>
                <p class="project-setting-label">显示提示图片</p>
              </el-col>
              <el-col span={12}>
                  <el-switch
                    modelValue={projectSetting.showPromptImg}
                    onChange={(value: boolean)=>{
                      userProjectSettingData.submitPromptImg=''
                      projectSetting.showPromptImg = value
                    }}
                  />
              </el-col>
            </el-row> */}
            {projectSetting.showPromptImg ? <div>
              <div class="block">
                <el-image
                  src={userProjectSettingData.submitPromptImg}
                  class="submit-prompt-img"
                  fit="cover"
                  v-slots={{
                    error: () => {
                      return (
                        <div class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      )
                    }
                  }}
                >
                </el-image>
              </div>
              <el-upload
                ref={logoUpload}
                action="getUploadUrl"
                headers="getUploadHeader"
                on-success="uploadSubmitPromptHandle"
                show-file-list={false}
                accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                v-slots={{
                  trigger: () => <el-button size="small" type="text">请上传提示图片 *</el-button>
                }}
              >
              </el-upload>
            </div> : ''}
            <el-row align="middle" type="flex">
              <el-col span={12}>
                <p class="project-setting-label">显示提示文字</p>
              </el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={projectSetting.showPromptText}
                  onChange={(value: boolean)=>{
                    projectSetting.showPromptText = value
                    userProjectSettingData.submitPromptText=''
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row>
            {projectSetting.showPromptText ? <el-row>
              <el-col span={20} class="setting-input">
                <el-input
                  modelValue={userProjectSettingData.submitPromptText}
                  maxlength={50}
                  show-word-limit={true}
                  onInput={(val: string) => { userProjectSettingData.submitPromptText = val }}
                  onChange={saveUserProjectSetting}
                />
              </el-col>
            </el-row> : ''}
            {projectSetting.showSubmitJumpUrl ? <el-row>
              <el-col span={20} class="setting-input">
                <el-input
                  modelValue={userProjectSettingData.submitJumpUrl}
                  show-word-limit={true}
                  placeholder="https://demo.tduckapp.com"
                  onChange={saveUserProjectSetting}
                />
              </el-col>
            </el-row>  : ''}
            <el-row align="middle" type="flex">
              <el-col span={12}>
                <p class="project-setting-label">公开反馈结果</p>
              </el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={Boolean(userProjectSettingData.publicResult)}
                  onChange={(value: boolean)=>{
                    userProjectSettingData.publicResult = Boolean(value)
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col span={6} class="project-setting-view text-center">
            <p class="project-setting-title">回收设置</p>
            {/* <el-row align="middle" type="flex">
                <el-col span={12}><p class="project-setting-label">只在微信中填写</p></el-col>
                <el-col span={12}>
                  <el-switch
                    modelValue={userProjectSettingData.wxWrite}
                    onChange={(value: boolean) => {
                      userProjectSettingData.wxWrite = value
                      saveUserProjectSetting()
                    }}
                  />
                </el-col>
            </el-row> */}
            <el-row align="middle" type="flex">
              <el-col span={12}>
                <p class="project-setting-label">定时收集表单</p>
              </el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={projectSetting.timingCollectForm}
                  onChange={(value: boolean)=>{
                    projectSetting.timingCollectForm = value
                    projectSetting.timingQuantitativeForm=false
                    clearFieldHandle(['timedCollectionBeginTime','timedCollectionEndTime','timedNotEnabledPromptText','timedDeactivatePromptText'])
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row>
            {projectSetting.timingCollectForm ? <div>
              <el-row align="middle" type="flex">
                <el-col span={5}>
                  <p class="project-setting-sub-label">收集时间：</p>
                </el-col>
                <el-col span={8}>
                  <el-date-picker
                    modelValue={userProjectSettingData.timedCollectionBeginTime}
                    align="center"
                    class="collection-date-picker"
                    placeholder="选择开始时间"
                    style="width: 100%; border: none;"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    onChange={(value: string) => {
                      userProjectSettingData.timedCollectionBeginTime = value
                      saveUserProjectSetting()
                    }}
                  />
                </el-col>
                <el-col span={1}><span>  至</span></el-col>
                <el-col span={8}>
                  <el-date-picker
                    modelValue={userProjectSettingData.timedCollectionEndTime}
                    align="center"
                    class="collection-date-picker"
                    placeholder="结束日期"
                    style="width: 100%; border: none;"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    onChange={(value: string) => {
                      userProjectSettingData.timedCollectionEndTime = value
                      saveUserProjectSetting()
                    }}
                  />
                </el-col>
              </el-row>
              <el-row align="middle" type="flex">
                <el-col span={8}><p class="project-setting-sub-label">未启用提示语：</p></el-col>
                <el-col span={15}>
                  <el-input
                    modelValue={userProjectSettingData.timedNotEnabledPromptText}
                    maxlength="50"
                    show-word-limit={true}
                    class="setting-input"
                    style="width: 80%;"
                    onInput={(value: string) => { userProjectSettingData.timedNotEnabledPromptText = value }}
                    onChange={saveUserProjectSetting}
                  />
                </el-col>
              </el-row>
              <el-row align="middle" type="flex">
                <el-col span={8}><p class="project-setting-sub-label">停用后提示语：</p></el-col>
                <el-col span={15}>
                  <el-input
                    modelValue={userProjectSettingData.timedDeactivatePromptText}
                    maxlength="50"
                    show-word-limit={true}
                    class="setting-input"
                    style="width: 80%;"
                    onInput={(val: string) => { userProjectSettingData.timedDeactivatePromptText = val }}
                    onChange={saveUserProjectSetting}
                  />
                </el-col>
              </el-row>
            </div> : ''}
            <el-row align="middle" type="flex">
              <el-col span={12}><p class="project-setting-label">定时定量表单</p></el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={projectSetting.timingQuantitativeForm}
                  onChange={(value: boolean)=>{
                    projectSetting.timingQuantitativeForm = value
                    projectSetting.timingCollectForm=false
                    clearFieldHandle(['timedCollectionBeginTime','timedCollectionEndTime','timedNotEnabledPromptText','timedDeactivatePromptText','timedQuantitativeQuantity','timedEndPromptText'])
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row>
            {projectSetting.timingQuantitativeForm ? <div>
              <el-row align="middle" type="flex">
                <el-col span={5}><p class="project-setting-sub-label">收集时间：</p></el-col>
                <el-col span={8}>
                  <el-date-picker
                    modelValue={userProjectSettingData.timedCollectionBeginTime}
                    align="center"
                    class="collection-date-picker"
                    placeholder="选择开始时间"
                    style="width: 100%; border: none;"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    onChange={(value: string) => {
                      userProjectSettingData.timedCollectionBeginTime = value
                      saveUserProjectSetting()
                    }}
                  />
                </el-col>
                <el-col span={1}><span>  至</span></el-col>
                  <el-col span={8}>
                    <el-date-picker
                      modelValue={userProjectSettingData.timedCollectionEndTime}
                      align="center"
                      class="collection-date-picker"
                      placeholder="结束日期"
                      style="width: 100%; border: none;"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      onChange={(value: string) => {
                        userProjectSettingData.timedCollectionEndTime = value
                        saveUserProjectSetting()
                      }}
                    />
                  </el-col>
              </el-row>
              <el-row align="middle" type="flex">
                <el-col span={8}><p class="project-setting-sub-label">未启用提示语：</p> </el-col>
                <el-col span={15}>
                  <el-input
                    modelValue={userProjectSettingData.timedNotEnabledPromptText}
                    maxlength="50"
                    show-word-limit={true}
                    class="setting-input"
                    style="width: 80%;"
                    onInput={(value: string) => { userProjectSettingData.timedNotEnabledPromptText = value }}
                    onChange={saveUserProjectSetting}
                  />
                </el-col>
              </el-row>
              <el-row align="middle" type="flex">
                <el-col span={8}><p class="project-setting-sub-label">停用后提示语：</p> </el-col>
                <el-col span={15}>
                  <el-input
                    modelValue={userProjectSettingData.timedDeactivatePromptText}
                    maxlength="50"
                    show-word-limit={true}
                    class="setting-input"
                    style="width: 80%;"
                    onInput={(value: string) => { userProjectSettingData.timedDeactivatePromptText = value }}
                    onChange={saveUserProjectSetting}
                  />
                </el-col>
              </el-row>
              {projectSetting.timingQuantitativeForm ? <el-row align="middle" type="flex">
                <el-col span={8}><p class="project-setting-sub-label">定量表单填写数量：</p> </el-col>
                <el-col span={15}>
                  <el-input
                    modelValue={userProjectSettingData.timedQuantitativeQuantity}
                    maxlength="50"
                    show-word-limit={true}
                    class="setting-input"
                    style="width: 80%;"
                    onInput={(value: string) => { value=value.replace(/[^\d]/g,''), userProjectSettingData.timedDeactivatePromptText = value }}
                    onChange={saveUserProjectSetting}
                  />
                </el-col>
              </el-row> : ''}
            </div> : ''}
            {projectSetting.timingQuantitativeForm ?<el-row align="middle" type="flex">
              <el-col span={8}><p class="project-setting-sub-label">收集完成后提示：</p> </el-col>
              <el-col span={15}>
                <el-input
                  modelValue={userProjectSettingData.timedEndPromptText}
                  maxlength="50"
                  show-word-limit={true}
                  class="setting-input"
                  style="width: 80%;"
                  onInput={(value: string) => { userProjectSettingData.timedEndPromptText = value }}
                  onChange={saveUserProjectSetting}
                />
              </el-col>
            </el-row> : ''}
            <el-row align="middle" type="flex">
              <el-col span={12}>
                <p class="project-setting-label ">每人限制填写1次
                  <el-tooltip class="item" content="根据IP地址限制填写" effect="dark" placement="top-start">
                    <i class="el-icon-warning" />
                  </el-tooltip>
                </p>
              </el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={Boolean(userProjectSettingData.everyoneWriteOnce)}
                  onChange={(value: boolean) => {
                    userProjectSettingData.everyoneWriteOnce = value
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row>
            <el-row align="middle" type="flex">
              <el-col span={12}><p class="project-setting-label">每人每天限制填写1次</p></el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={Boolean(userProjectSettingData.everyoneDayWriteOnce)}
                  onChange={(value: boolean) => {
                    userProjectSettingData.everyoneDayWriteOnce = value
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row>
            {userProjectSettingData.everyoneDayWriteOnce||userProjectSettingData.everyoneWriteOnce ?
            <el-row align="middle" type="flex">
              <el-col span={12}><p class="project-setting-label">重复填写后提示：</p></el-col>
              <el-col span={12}>
                <el-input
                  modelValue={userProjectSettingData.writeOncePromptText}
                  maxlength="50"
                  show-word-limit={true}
                  class="setting-input"
                  style="width: 80%;"
                  onInput={(value: string) => { userProjectSettingData.writeOncePromptText = value }}
                  onChange={saveUserProjectSetting}
                />
              </el-col>
            </el-row> : ''}
            <el-row align="middle" type="flex">
              <el-col span={12}><p class="project-setting-label">新反馈提醒我</p></el-col>
              <el-col span={12}>
                <el-switch
                  modelValue={Boolean(projectSetting.newFeedbackRemind)}
                  onChange={(value: boolean) => {
                    projectSetting.newFeedbackRemind = value
                  }}
                />
              </el-col>
            </el-row>
            {projectSetting.newFeedbackRemind ? <el-row align="middle" type="flex">
              <el-col span={5}><p class="project-setting-sub-label">发邮件提醒我</p></el-col>
              <el-col span={3}>
                <el-checkbox
                  modelValue={projectSetting.newFeedbackRemindEmail}
                  onChange={(val: boolean)=>{
                    projectSetting.newFeedbackRemindEmail = val
                    clearFieldHandle(['newWriteNotifyEmail'])
                    saveUserProjectSetting()
                  }}
                />
              </el-col>
            </el-row> : ''}
            {projectSetting.newFeedbackRemindEmail ? <el-row align="middle" type="flex">
              <el-col offset={3} span={5}><p class="project-setting-sub-label">请填写邮箱：</p></el-col>
              <el-col span={12}>
                <el-form-item prop="newWriteNotifyEmail" style="margin-bottom: 0;">
                  <el-input
                    modelValue={userProjectSettingData.newWriteNotifyEmail}
                    class="setting-input"
                    placeholder="多个邮箱用 ; 隔开"
                    style="width: 80%;"
                    onInput={(val: string) => {userProjectSettingData.newWriteNotifyEmail = val}}
                    onChange={saveUserProjectSetting}
                  />
                </el-form-item>
              </el-col>
            </el-row> : ''}
          </el-col>
        </el-row>
      </el-form>
    )
  }
})
