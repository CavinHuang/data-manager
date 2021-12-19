/*
 * @Author: your name
 * @Date: 2021-10-24 09:43:44
 * @LastEditTime: 2021-10-25 21:40:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\collections\preview\ProjectForm.tsx
 */
import { getQuestionDetail } from '@/apis/modules/question'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { dbDataConvertForItemJson } from '../creator/utils/convert'
import _ from 'lodash'
import { useRoute } from 'vue-router'
import Parser from '@/components/Parser'
import '@/assets/styles/form/index.scss'
import '@/assets/styles/form/home.scss'
import '@/assets/styles/elementui-mobile.scss'

export default defineComponent({
  components: {
    Parser
  },
  props: {
    projectConfig: {
      type: Object,
      default: () => {
        return {
          projectKey: '',
          showBtns: true,
          // 项目种类  1 普通  2模板
          projectKind: 1
        }
      }
    },
    onSubmit: Function
  },
  setup (props) {
    const route = useRoute()
    const state = reactive({
      projectTheme: {
        headImgUrl: '',
        logoImg: '',
        logoPosition: 'left',
        showTitle: true,
        showDescribe: true,
        backgroundColor: '',
        backgroundImg: ''
      },
      formModel: {}
    })
    const formConf = reactive({
      title: '',
      description: '',
      fields: [] as any[],
      logicShowRule: {},
      projectKey: '',
      projectKind: 1,
      __methods__: {},
      formRef: 'elForm',
      formModel: 'formData',
      labelFormModel: 'labelFormData',
      size: 'small',
      labelPosition: 'top',
      labelWidth: 100,
      formRules: 'rules',
      gutter: 15,
      disabled: false,
      span: 24,
      formBtns: true,
      resetBtn: false,
      submitBtnText: '提交',
      submitBtnColor: '#409EFF',
      showNumber: false,
      unFocusedComponentBorder: true
    })
    const startParser = ref(false)
    const parserKey = ref(+new Date())
    const labelFormModel = ref({})

    // let url = `/user/project/details/${formConf.projectKey}`
    // if (formConf.projectKind == 2) {
    //     url = `/project/template/details/${formConf.projectKey}`
    // }
    let logicItemList = []
    // if (formConf.projectKind == 1) {
    //   let res = await this.queryLogicItemList()
    //   logicItemList = res.data
    // }
    let logicItemMap = new Map()
    // logicItemList.forEach(item => {
    //     logicItemMap.set(item.formItemId, item)
    //     this.logicShowTriggerHandle(item)
    // })

    // 每页数据
    const perPageFields = ref({})
    const logicShowTriggerRule = reactive({})

    onBeforeMount(() => {
      document.querySelector('body')!.className = 'project-body'
    })

    if (props.projectConfig && props.projectConfig.projectKey) {
      formConf.projectKey = props.projectConfig.projectKey
      if (props.projectConfig.projectKind) {
        formConf.projectKind = props.projectConfig.projectKind
      }
    } else if (route.query.key) {
      // 不存去路由中尝试获取 iframe
      formConf.projectKey = route.query.key as string
      if (route.query.kind) {
        formConf.projectKind = +route.query.kind
      }
      formConf.formBtns = true
    }
    formConf.size = window.innerWidth < 480 ? 'medium' : 'small'

    getQuestionDetail(formConf.projectKey).then(res => {
      let serialNumber = 1
      let fields = res.items.map(item => {
          let projectItem = dbDataConvertForItemJson(item)
          projectItem.serialNumber = serialNumber
          projectItem.logicShow = !logicItemMap.get(projectItem.formItemId)
          serialNumber++
          return projectItem
      })
      // pageShowHandle(fields)
      if (_.keys(perPageFields.value).length != 0) {
        formConf.fields = _.get(perPageFields.value, 1)
        formConf.formBtns = false
      } else {
        formConf.fields = fields
      }
      formConf.title = res.name
      document.title = res.name
      formConf.description = res.describe
      formConf.logicShowRule = logicShowTriggerRule
      if (res.theme) {
        state.projectTheme = res.theme
        let {submitBtnText, showNumber, btnsColor} = res.theme
        if (submitBtnText) formConf.submitBtnText = submitBtnText
        if (showNumber) formConf.showNumber = showNumber
        if (btnsColor) formConf.submitBtnColor = btnsColor
      }
      startParser.value = true
    })

    const nextPage = (params: any) => {
      switchPage(params.page + 1, params)
    }
    const prevPage = (params: any) => {
      switchPage(params.page - 1, params)
    }
    const submitForm = (data: any) => {
      props.onSubmit && props.onSubmit(data)
    }
    const switchPage = (page: number, params: any) => {
      let {labelFormModel, formModel} = params
      state.formModel = formModel
      labelFormModel.value = labelFormModel
      formConf.formBtns = _.keys(perPageFields.value).length == page
      formConf.fields = _.get(perPageFields.value, page)
      parserKey.value = +new Date()
    }
    return () => (
      <div class="project-form"
        style={
          {
            backgroundColor: state.projectTheme.backgroundColor,
            backgroundImage: state.projectTheme.backgroundImg ? 'url(' + state.projectTheme.backgroundImg + ')' : '',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }
        }
      >
        <div class="">
          <div style={{textAlign: state.projectTheme.logoPosition as any}}>
            <img src={state.projectTheme.logoImg} class="logo-img" />
          </div>
          {state.projectTheme.headImgUrl ? <el-image
            src={state.projectTheme.headImgUrl}
            style="width: 100%;"
            fit="scale-down"
          /> : ''}
          {state.projectTheme.showTitle ? <h4 class="form-name-text" style="text-align: center;">{formConf.title}</h4> : ''}
          <div
            class="form-name-text describe-html"
            innerHTML={formConf.description}
            style={{ display: state.projectTheme.showDescribe ? 'block' : 'none' }}
          />
          <el-divider />
          {startParser.value ? <parser
            key={parserKey}
            form-model={state.formModel}
            label-form-model={labelFormModel.value}
            form-conf={formConf}
            onNext={nextPage}
            onPrev={prevPage}
            onSubmit={submitForm}
          /> : ''}
        </div>
    </div>
    )
  }
})
