import { computed, defineComponent, ref } from 'vue'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import { ElMessage } from 'element-plus'
import style from './style.module.scss'
import { getQuestion, publish, stopPublish } from '@/apis/modules/question'
import { useRoute } from 'vue-router'
import Clipboard from 'clipboard/dist/clipboard.min.js'
const VueClipboardConfig = {
  autoSetContainer: false,
  appendToBody: true // This fixes IE, see #50
}
export default defineComponent({
  name: 'ProjectPublish',
  directives: {
    clipboard: {
      created: function (el, binding, vnode) {
        console.log('=======================================', el, binding)
        el._vClipboard_success = binding.value.success
        el._vClipboard_error = binding.value.error
        var clipboard = new Clipboard(el, {
          text: function () { return binding.value },
          action: function () { return binding.arg === 'cut' ? 'cut' : 'copy' },
          container: VueClipboardConfig.autoSetContainer ? el : undefined
        })
        clipboard.on('success', function (e: any) {
          var callback = el._vClipboard_success
          callback && callback(e)
        })
        clipboard.on('error', function (e: any) {
          var callback = el._vClipboard_error
          callback && callback(e)
        })
        el._vClipboard = clipboard
      },
      updated: function (el, binding) {
        if (binding.arg === 'success') {
          el._vClipboard_success = binding.value
        } else if (binding.arg === 'error') {
          el._vClipboard_error = binding.value
        } else {
          el._vClipboard.text = function () { return binding.value }
          el._vClipboard.action = function () { return binding.arg === 'cut' ? 'cut' : 'copy' }
        }
      },
      unmounted: function (el, binding) {
        // FIXME: investigate why $element._vClipboard was missing
        if (!el._vClipboard) return
        if (binding.arg === 'success') {
          delete el._vClipboard_success
        } else if (binding.arg === 'error') {
          delete el._vClipboard_error
        } else {
          el._vClipboard.destroy()
          delete el._vClipboard
        }
      }
    }
  },
  components: {
    VueQr
  },
  props: {

  },
  setup() {
    const route = useRoute()
    const publishStatus = ref(false)
    const projectKey = ref(route.query.key as string)
    let url = window.location.protocol + '//' + window.location.host
    const writeLink = computed(() => `${url}/s/${projectKey.value}`)
    const qrCodeUrl = ref('')
    const publishProject = () =>{
      publish(projectKey.value).then(res => {
        publishStatus.value = true
      })
      // this.$api.post('/user/project/publish', {key: this.projectKey}).then(() => {
      //   publishStatus = true
      //   this.msgSuccess('发布成功')
      // })
    }
    const stopPublishProject = () => {
      stopPublish(projectKey.value).then(res => {
        getProjectStatus()
      })
      // this.$api.post('/user/project/stop', {'key': this.projectKey}).then(res => {
      //     if (res.data) {
      //         this.msgSuccess('停止成功')
      //         this.getProjectStatus()
      //     }
      // })
    }

    function getProjectStatus() {
      getQuestion(projectKey.value).then(res => {
        if (res.status === 2) {
          publishStatus.value = true
        } else {
          publishStatus.value = false
        }
      })
    }
    getProjectStatus()

    const toFeedbackPageHandle = () => {
      // this.$router.replace({path: '/project/form/statistics', query: {key: this.projectKey}})
    }

    const qrCodeGenSuccess = (dataUrl: string) => {
      qrCodeUrl.value = dataUrl
    }
    // base64转blob
    const base64ToBlob = (code: string) => {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {type: contentType})
    }

    const downloadFile = (fileName: string, content: string) => {
      let aLink = document.createElement('a')
      let blob = base64ToBlob(content) // new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      // aLink.dispatchEvent(evt);
      aLink.click()
    }
    const startPublish = () => {
      return !publishStatus.value ? <div class="publish-btn-view">
        <el-button
          class="publish-btn"
          size="medium"
          type="primary"
          onClick={publishProject}
        >
          <i class="el-icon-document-checked el-icon--right">开始发布</i>
        </el-button>
      </div> : ''
    }

    const publishSuccess = () => {
      return publishStatus.value ? <div class="publish-finish-view">
        <el-row gutter={10} align="middle" type="flex">
          <div style="width: 220px;">
            <div>{writeLink.value ? <vue-qr callback={qrCodeGenSuccess} size={194} text={writeLink.value} /> : ''}</div>
            <div style="text-align center;">
              <el-link type="primary" onClick={()=>{downloadFile('qrcode.png', qrCodeUrl.value)}}>下载分享二维码</el-link>
            </div>
          </div>
          <div style="margin-left: 75px;">
            <div style="display: flex; justify-content: center;">
              <div class="icon-view"><i class="el-icon-check success-icon" /></div>
            </div>
            <div><p class="success-title">恭喜您，发布成功！</p></div>
            <div><p class="link-text"> { writeLink.value }</p></div>
            <el-row>
              <el-col offset={3} span={6}>
                <el-button
                  v-clipboard={[{
                    value: writeLink.value,
                    error: () => { ElMessage.error('复制失败') },
                    success: () => { ElMessage.success('复制成功')}
                  }, 'copy', []]}
                  // v-clipboard={[
                  //   [writeLink.value, 'copy', ['modifier']],
                  //   [() => { ElMessage.error('复制失败') }, 'error', ['modifier']],
                  //   [() => { ElMessage.success('复制成功')}, 'success', ['modifier']]
                  // ]}
                  type="primary"
                >复制链接</el-button>
              </el-col>
              <el-col span={6}>
                <el-button
                  type="danger"
                  onClick={stopPublishProject}
                >停止发布</el-button>
              </el-col>
              <el-col span={6}>
                <el-button
                  type="warning"
                  onClick={toFeedbackPageHandle}
                >查看反馈</el-button>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div> : ''
    }

    return () => (
      <div class={style['publish-container']}>
        <div>
          {startPublish()}
          {publishSuccess()}
        </div>
      </div>
    )
  }
})
