import { defineComponent, reactive, ref } from 'vue'
import style from './style.module.scss'
import PreView from '../preview'
import { ElMessageBox } from 'element-plus'
import { saveTheme, themeDetail, themeLists } from '@/apis/modules/theme'
import { ThemeType } from '@/apis/types/theme'
import { useRoute } from 'vue-router'

export default defineComponent({
  props: {

  },
  setup() {
    const route = useRoute()
    const styleList = [
      {'label': '全部', 'key': ''},
      {'label': '节日', 'key': 'festival'},
      {'label': '亲子', 'key': 'parent_child'},
      {'label': '风景', 'key': 'scenery'},
      {'label': '职业', 'key': 'occupation'},
      {'label': '校园', 'key': 'school'},
      {'label': '商务', 'key': 'commerce'},
      {'label': '其他', 'key': 'others'},
      {'label': '餐饮', 'key': 'catering'},
      {'label': '防疫', 'key': 'fangyi'}
    ]

    const activeStyle = ref('')
    const activeStyleHandle = (item: any) => {
      activeStyle.value = item.key
      queryProjectTheme()
    }
    const activeColor = ref('')
    const activeColorHandle = (item: string) => {
      console.log(item)
      activeColor.value = item
      queryProjectTheme()
    }
    const colorList = [
      '#FF6D56',
      '#F8E71C',
      '#00BF6F',
      '#2672FF ',
      '#7464FF',
      '#484848',
      '#EAEAEA',
      '#804000'
    ]
    const themeList = ref<ThemeType[]>([])
    const activeTheme = ref<ThemeType| null>(null)
    const activeThemeHandle = (item: any) => {
      if (item) {
        ElMessageBox.confirm('切换主题，系统将不会保存您在上一主题所做的修改，请知悉。', '切换主题提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消操作',
          type: 'info'
        }).then(() => {
          activeTheme.value = item
          console.log('aaaa', activeTheme, item)
          saveUserTheme()
        }).catch(() => {
        })
      }
    }

    function leftContainer () {
      return (
        <div class="left-container">
          <el-scrollbar class="left-scrollbar-container">
            <p class="theme-title">外观主题</p>
            <el-row>
              <el-col span={3}>
                <span class="theme-prompt-text">风格</span>
              </el-col>
              {
                styleList.map((item, index) => {
                  return (
                    <el-col key={item.key} span={3}>
                      <span
                        class={{ 'style-btn-active': activeStyle.value == item.key, 'style-btn': true }}
                        onClick={() => { activeStyleHandle(item) }}
                      >{ item.label }</span>
                    </el-col>
                  )
                })
              }
            </el-row>
            <el-row>
              <el-col span={3}>
                <span class="theme-prompt-text">颜色</span>
              </el-col>
              <el-col span={3}>
                <span
                  class={{'style-btn-active': activeColor.value=='', 'style-btn': true }}
                  onClick={() => { activeColorHandle('') }}
                >全部</span>
              </el-col>
              {
                colorList.map(c => {
                  return <el-col
                    key={c}
                    class={{'style-btn-active': activeColor.value == c, 'color-btn': true}}
                    span={3}
                    style={{backgroundColor: c}}
                    onClick={() => { activeColorHandle(c) }}
                  />
                })
              }
            </el-row>
            <el-row>
              {
                themeList.value.map((t: any) => {
                  return (
                    <el-col
                      key={t.id}
                      span={8}
                      class='theme-img-view'
                      onClick={() => {activeThemeHandle(t)}}
                    >
                      <p class={{ 'head-list-view-select': activeTheme.value && activeTheme.value.id == t.id }}>
                        <el-image
                          class={{ 'head-list-img-active': activeTheme.value && activeTheme.value.id == t.id, 'head-list-img': true }}
                          src={t.headImgUrl}
                          fit="cover"
                          style="width: 100px; height: 100px;"
                        />
                      </p>
                    </el-col>
                  )
                })}
            </el-row>
          </el-scrollbar>
        </div>
      )
    }

    const projectFormKey = ref(+(new Date()))
    const projectKey = ref(route.query.key as string)
    // 外观设置
    const showSettings = reactive({
      logoSetting: false, // 打开logo
      backgroundSetting: false,
      btnSetting: false,
      backgroundType: 'color'
    })
    // 用户主题设置
    const userProjectTheme = reactive({
      projectKey: '',
      themeId: 0,
      showTitle: true,
      showDescribe: true,
      showNumber: false,
      backgroundColor: '',
      backgroundImg: '',
      logoImg: '',
      logoPosition: 'left',
      submitBtnText: '提交'
    })
    const uploadLogoHandle = (response: any) => {
      userProjectTheme.logoImg = response.data
      saveUserTheme()
    }
    const logoUpload = ref(null)
    const upload = ref(null)
    const saveUserTheme = () => {
      userProjectTheme.projectKey = projectKey.value
      userProjectTheme.themeId = activeTheme.value ? activeTheme.value.id : 0
      saveTheme(userProjectTheme).then(() => {
        projectFormKey.value = +new Date()
      })
      // this.$api.post('/user/project/theme/save', this.userProjectTheme).then(() => {
      //   this.projectFormKey = +new Date()
      // })
    }
    const rightContainer = () => {
      return (
        <div class="right-container">
          <p class="right-title">外观设置</p>
          {/* <el-row align="middle" class="option-line-view" type="flex">
            <el-col span={8}>
              <span class="option-line-title">添加logo</span>
            </el-col>
            <el-col offset={8} span={8}>
              <el-switch
                modelValue={showSettings.logoSetting}
                onChange={(value: boolean) => { showSettings.logoSetting = value, value === false && uploadLogoHandle({ data:'' }) }}
              />
            </el-col>
          </el-row> */}
          {showSettings.logoSetting ? (
          <>
            <el-row align="middle" type="flex">
              <el-col span={6}>
                <span class="option-line-sub-title">logo设置</span>
              </el-col>
              <el-col span={4}>
                { userProjectTheme.logoImg ? <img
                  src={userProjectTheme.logoImg}
                  style="width 30px; height 30px;"
                />: ''}
              </el-col>
              <el-col offset={6} span={8}>
                <el-upload
                  ref={logoUpload}
                  action="getUploadUrl"
                  headers="getUploadHeader"
                  on-success="uploadLogoHandle"
                  show-file-list={false}
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                  v-slots={{
                    trigger: () => <el-button size="small" type="text">上传Logo</el-button>,
                    default: () => ''
                  }}
                />
              </el-col>
            </el-row>
            <el-row align="middle" type="flex">
              <el-col span={6}>
                <span class="option-line-sub-title">logo位置</span>
              </el-col>
              <el-col span={18}>
                <el-radio-group
                  modelValue={userProjectTheme.logoPosition}
                  size="mini"
                  onChange={saveUserTheme}
                >
                  <el-radio-button label="left">左对齐</el-radio-button>
                  <el-radio-button label="center">居中</el-radio-button>
                  <el-radio-button label="right">右对齐</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </>
          ) : ''}
          <el-row align="middle" class="option-line-view" type="flex">
            <el-col span={8}>
              <span class="option-line-title">背景设置</span>
            </el-col>
            <el-col offset={8} span={8}>
              <el-switch
                modelValue={showSettings.backgroundSetting}
                onChange={(val:boolean) => {
                  showSettings.backgroundSetting = val
                  console.log(val)
                  userProjectTheme.backgroundImg=''
                  userProjectTheme.backgroundColor=''
                  saveUserTheme()
                }}
              />
            </el-col>
          </el-row>
          {/* showSettings.backgroundSetting ? <el-row>
            <el-row align="middle" type="flex">
                <el-col span={8}>
                  <span class="option-line-sub-title">背景类型</span>
                </el-col>
                <el-col spvan={18}>
                  <el-radio-group
                    modelValue={showSettings.backgroundType}
                    size="mini"
                    onChange={()=>{
                      userProjectTheme.backgroundImg=''
                      userProjectTheme.backgroundColor=''
                    }}
                  >
                    <el-radio-button label="color">颜色</el-radio-button>
                    <el-radio-button label="img">图片</el-radio-button>
                  </el-radio-group>
                </el-col>
            </el-row>
          </el-row> : '' */}
          {showSettings.backgroundSetting&&showSettings.backgroundType=='color' ?
          <el-row align="middle" type="flex">
            <el-col span={12}>
              <span class="option-line-sub-title">选择颜色</span>
            </el-col>
            <el-col span={12}>
              <el-color-picker
                modelValue={userProjectTheme.backgroundColor}
                size="mini"
                onChange={(color: string) => {
                  userProjectTheme.backgroundColor = color
                  saveUserTheme()
                }}
              />
            </el-col>
          </el-row> : ''}
          {showSettings.backgroundType=='img' ? <el-row>
            <el-row align="middle" type="flex">
              <el-col span={8}>
                <span class="option-line-sub-title">选择图片</span>
              </el-col>
              <el-col span={18}>
                <el-upload
                  ref={upload}
                  action="getUploadUrl"
                  headers="getUploadHeader"
                  on-success="uploadBackgroundHandle"
                  show-file-list="false"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                  class="upload-demo"
                  v-slots={{
                    trigger: () => <el-button size="small" type="text">上传背景</el-button>
                  }}
                />
              </el-col>
            </el-row>
          </el-row> : ''}
          <el-row align="middle" class="option-line-view" type="flex">
            <el-col span={8}>
              <span class="option-line-title">按钮设置</span>
            </el-col>
            <el-col offset={8} span={8}>
              <el-switch modelValue={showSettings.btnSetting} onChange={(val: boolean) => { showSettings.btnSetting = val }}/>
            </el-col>
          </el-row>
          {showSettings.btnSetting ?
          <el-row align="middle" type="flex">
            <el-col span={12}>
              <span class="option-line-sub-title">按钮提示文字</span>
            </el-col>
            <el-col span={10}>
              <el-input
                modelValue={userProjectTheme.submitBtnText}
                placeholder="请输入内容"
                size="mini"
                style="width 80%;"
                onInput={(value: string) => {
                  userProjectTheme.submitBtnText = value
                }}
                onChange={saveUserTheme}
              />
            </el-col>
          </el-row> : ''}
          <el-row align="middle" class="option-line-view" type="flex">
            <el-col span={8}>
              <span class="option-line-title">显示标题</span>
            </el-col>
            <el-col offset={8} span={8}>
              <el-switch
                modelValue={userProjectTheme.showTitle}
                onChange={(value: boolean) => {
                  userProjectTheme.showTitle = value
                  saveUserTheme()
                }}
              />
            </el-col>
          </el-row>
          <el-row align="middle" class="option-line-view" type="flex">
            <el-col span={8}>
              <span class="option-line-title">显示描述</span>
            </el-col>
            <el-col offset={8} span={8}>
              <el-switch
                modelValue={userProjectTheme.showDescribe}
                onChange={(value: boolean) => {
                  userProjectTheme.showDescribe = value
                  saveUserTheme()
                }}
              />
            </el-col>
          </el-row>
          <el-row align="middle" class="option-line-view" type="flex">
            <el-col span={8}>
              <span class="option-line-title">显示序号</span>
            </el-col>
            <el-col offset={8} span={8}>
              <el-switch
                modelValue={userProjectTheme.showNumber}
                onChange={(value: boolean) => {
                  userProjectTheme.showNumber = value
                  saveUserTheme()
                }}
              />
            </el-col>
        </el-row>
      </div>
      )
    }

    function queryProjectTheme() {
      themeLists({
        color: activeColor.value,
        style: activeStyle.value
      }).then(res => {
        themeList.value = res
      })
    }
    queryProjectTheme()

    function queryUserProjectTheme() {
      themeDetail(projectKey.value).then(res => {
        userProjectTheme.backgroundColor = res.backgroundColor
        userProjectTheme.backgroundImg = res.backgroundImg
        userProjectTheme.logoImg = res.logoImg
        userProjectTheme.logoPosition = res.logoPosition
        userProjectTheme.themeId = res.themeId
        userProjectTheme.showDescribe = Boolean(res.showDescribe)
        userProjectTheme.showTitle = Boolean(res.showTitle)
        userProjectTheme.showNumber = Boolean(res.showNumber)
        let {themeId, logoImg, backgroundImg, backgroundColor, submitBtnText} = res
        activeTheme.value = {
          'id': themeId
        } as any
        showSettings.logoSetting = !!logoImg
        showSettings.btnSetting = !!submitBtnText
        if (backgroundImg || backgroundColor) {
          showSettings.backgroundSetting = true
          showSettings.backgroundType = backgroundImg ? 'img' : 'color'
        }
      })
    }
    queryUserProjectTheme()

    return () => (
      <div class={style['theme-container']}>
        {leftContainer()}
        <PreView class={style['preview-container']} key={projectFormKey.value} project-key="projectKey" />
        {rightContainer()}
      </div>
    )
  }
})
