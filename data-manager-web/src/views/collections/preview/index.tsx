/*
 * @Author: your name
 * @Date: 2021-10-17 11:43:00
 * @LastEditTime: 2021-10-17 12:27:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\collections\preview\index.ts
 */

import { defineComponent, reactive, ref } from 'vue'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import style from './style.module.scss'
import { useRoute } from 'vue-router'
import ProjectForm from './ProjectForm'
export default defineComponent({
  components: {
    VueQr
  },
  props: {
    previewQrcode: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const route = useRoute()
    const mobilePreviewUrl = ref('')
    const previewQrcode = ref(false)
    const projectConfig = reactive({
      projectKey: '',
      showBtns: true
    })

    projectConfig.projectKey = route.query.key as string
    let url = window.location.protocol + '//' + window.location.host
    mobilePreviewUrl.value = `${url}/#/front/question?key=${projectConfig.projectKey}`

    return () => (
      <div class={style['preview-container']}>
        {projectConfig.projectKey ? <el-tabs type="card">
          <el-tab-pane v-slots={{
            label: () => <span><i class="el-icon-mobile" />手机</span>,
            default: () => {
              return (
                <>
                  <div class="preview-layer">
                    <div class="preview-bg" />
                    <div class="preview-phone">
                      <iframe id="preview-html"
                        src={mobilePreviewUrl.value}
                        class="preview-html"
                        frameborder="0"
                        name="preview-html"
                        scrolling="auto"
                      />
                    </div>
                  </div>
                  {mobilePreviewUrl.value && previewQrcode.value ? <div class="qrcode-view">
                    <p>手机扫码查看效果</p>
                    <vue-qr size="194" text={mobilePreviewUrl.value} />
                  </div> : ''}
                </>
              )
            }
          }}>
          </el-tab-pane>
          <el-tab-pane v-slots={{
            label: () => <>
              <i class="el-icon-monitor" />电脑
            </>,
            default: () => {
              return (
                <el-scrollbar style="height 77vh;overflow-x hidden!important;">
                  {projectConfig.projectKey ? <ProjectForm project-config={projectConfig} />: ''}
                </el-scrollbar>
              )
            }
          }}>
          </el-tab-pane>
        </el-tabs> : ''}
      </div>
    )
  }
})
