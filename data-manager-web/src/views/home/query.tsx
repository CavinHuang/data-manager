import { getExcelInfo, upload } from '@/apis/modules/file'
import { submit } from '@/apis/modules/query'
import { TFileInfo } from '@/apis/types/file'
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import UserHeader from './components/userHeader'
import css from './index.module.scss'
import QuerySetting from './components/querySetting'
import { cloneDeep } from 'lodash'

export type TFieldConfig = {
  field: string
  label: string
  show: boolean
  title: string
}

type TAllSubmitData = {
  id?: number
  title: string
  attach_id: number
  description: string
  fields: Array<{ field: string, label: string }>
  field_config: TFieldConfig[]
  limit_number: number
  result_tips: string
}

export default defineComponent({
  name: 'HomeUser',
  setup () {
    const router = useRouter()
    const uploadState = ref(false)
    const fileInfo = ref<TFileInfo | null>(null)
    const inputElement = ref<HTMLInputElement | null>(null)
    const mobilePreviewUrl = ref('')
    const triggerUpload = () => {
      if (inputElement.value) {
        inputElement.value.click()
      }
    }
    const fileChange = (e: Event) => {
      console.log(e)
      const target = e.target as HTMLInputElement
      const files = target.files

      if (files?.length) {
        const file = files[0]
        upload(file).then(res => {
          console.log(res)
          fileInfo.value = res
          uploadState.value = true
        })
      }
    }

    const excelFields = ref<Array<{ label: string, field: string }>>([])
    const excelFieldConfigs = ref<TFieldConfig[]>([])
    const setup = ref(1)
    const allSubmitData = reactive<TAllSubmitData>({
      title: '',
      attach_id: 0,
      description: '',
      limit_number: 0,
      fields: [],
      field_config: [],
      result_tips: ''
    })
    const next = async (nextSetup: number) => {
      if (nextSetup === 2 && !allSubmitData.title.length) {
        ElMessage.warning('????????????????????????')
        return
      }
      if (nextSetup === 3 && !uploadState.value) {
        ElMessage.warning('?????????????????????excel??????')
        return
      }
      if (nextSetup === 3 && fileInfo.value) {
        if (fileInfo.value) {
          try {
            const postData = allSubmitData
            postData.attach_id = fileInfo.value.attach_id
            postData.field_config = excelFieldConfigs.value
            postData.fields = excelFields.value

            const res = await submit(postData)
            allSubmitData.id = res.id

            // ??????excel???????????????
            const fileRes = await getExcelInfo(fileInfo.value.attach_id)
            excelFields.value = fileRes.fields
            const config: TFieldConfig[] = []
            fileRes.fields.map(({ field, label }) => {
              config.push({
                field,
                label,
                title: '',
                show: false
              })
            })
            excelFieldConfigs.value = config
            mobilePreviewUrl.value = '/#/q/' + res.key
          } catch (e) {
            console.error('????????????', e)
            return
          }
        }
      }
      setup.value = nextSetup
    }

    // ????????????
    onBeforeRouteLeave((to, from) => {
      if (setup.value > 0 && +(to.query.is_leave as string) !== 1) {
        next(setup.value - 1)
        return false
      }
      return true
    })

    watch(excelFieldConfigs, () => {
      allSubmitData.field_config = excelFieldConfigs.value
    }, { deep: true })

    const submitAllData = () => {
      if (fileInfo.value) {
        const postData = cloneDeep(allSubmitData)
        postData.attach_id = fileInfo.value.attach_id
        postData.field_config = excelFieldConfigs.value
        postData.fields = excelFields.value

        submit(postData).then(() => {
          router.push({
            path: '/home/queryList',
            query: {
              is_leave: 1
            }
          })
        })
      }
    }

    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class='page-content'>
          <div class={[css['main-container'], 'mt_20']}>
            <div class='query-setup' style={{ display: setup.value === 1 ? 'block' : 'none' }}>
              <div class='setup-title'>?????????: ??????????????????</div>
              <div class='setup-form-block'>
                <div class='form-label'>????????????</div>
                <div class='form-input-wrapper'>
                  <el-input class='form-input' modelValue={allSubmitData.title} onInput={(val: string) => { allSubmitData.title = val }} placeholder='??????:2020????????????????????????????????????' />
                </div>
                <div class='form-button'>
                  <el-button class='form-button-primary' onClick={() => next(2)}>???????????????</el-button>
                </div>
              </div>
            </div>
            <div class='query-setup' style={{ display: setup.value === 2 ? 'block' : 'none' }}>
              <div class='setup-title'><span>?????????: ??????????????????</span> <span class='title-tip'>??????????????????????????????????????????????????????????????????</span></div>
              <div class='setup-form-block'>
                <div class='excel-demo'>
                  <img src={require('../../assets/images/excel-demo.png')} alt='excel-demo' />
                  <div class='tip-txt'>??????????????????excel??????????????????????????????</div>
                  {uploadState.value ? <div class='upload-info'>????????????!{fileInfo.value?.attach_filename}</div> : ''}
                </div>
                <div class='form-button' style='margin-top: 20px;'>
                  <el-button class='form-button-primary' style='width: 90%' onClick={triggerUpload}>????????????excel????????????</el-button>
                  <input type='file' hidden style='opacity: 0' ref={inputElement} onChange={fileChange} />
                </div>
                <div class='form-button'>
                  <el-button class='form-button-primary' onClick={() => next(3)}>???????????????</el-button>
                </div>
              </div>
            </div>
            <div class='query-setup' style={{ display: setup.value === 3 ? 'block' : 'none' }}>
              <div class='setup-title'><span>?????????: ??????????????????</span></div>
              <QuerySetting allSubmitData={allSubmitData} excelFieldConfigs={excelFieldConfigs.value} />
            </div>
            <el-button style={{ display: setup.value === 3 ? 'block' : 'none' }} class='query-btn' onClick={submitAllData}>???????????????</el-button>
          </div>
        </div>
      </div>
    )
  }
})
