/*
 * @Author: your name
 * @Date: 2021-09-14 22:30:20
 * @LastEditTime: 2021-09-15 22:08:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\front\query\index.tsx
 */
import { getQuery, getResult } from '@/apis/modules/query'
import { TQueryItem, TQueryConfig as BaseQueryConfig } from '@/apis/types/query'
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import css from './style.module.scss'

type TQueryInfo = Pick<TQueryItem, 'title' | 'description' | 'excel_fields' | 'excel_fields_config' | 'result_tips'>

type TQueryConfig = BaseQueryConfig & { show: boolean }

export default defineComponent({
  name: 'QueryIndex',
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  setup (props) {
    const route = useRoute()
    const id = route.query.id as string
    const key = route.params.key as string
    const queryInfo = reactive<TQueryInfo>({
      title: '',
      description: '',
      excel_fields: '',
      excel_fields_config: '',
      result_tips: ''
    })

    const queryConfig = ref<TQueryConfig[]>([])
    const allQueryConfig = ref<Omit<TQueryConfig, 'value'>[]>([])

    watch(props.data, () => {
      if (props.isPreview) {
        console.log(props.data)
        if (props.data) {
          const { title, description, excel_fields, field_config, excel_fields_config, result_tips } = props.data
          queryInfo.title = title
          queryInfo.description = description
          queryInfo.excel_fields = excel_fields
          queryInfo.excel_fields_config = excel_fields_config ? excel_fields_config : field_config
          queryInfo.result_tips = result_tips
          allQueryConfig.value = field_config
          queryConfig.value = (() => {
            if (queryInfo.excel_fields_config) {
              const _config: TQueryConfig[] = queryInfo.excel_fields_config as any
              return _config.filter(item => item.show).map(item => {
                item.value = ''
                return item
              }) || []
            }
            return []
          })()
        }
      }
    }, { immediate: true })
    if (!props.isPreview) {
      // @ts-ignore
      getQuery({ id: id ? +id : undefined, key: key ? key : undefined }).then(res => {
        const { title, description, excel_fields, excel_fields_config, result_tips } = res
        queryInfo.title = title
        queryInfo.description = description
        queryInfo.excel_fields = excel_fields
        queryInfo.excel_fields_config = excel_fields_config
        queryInfo.result_tips = result_tips
        allQueryConfig.value = JSON.parse(queryInfo.excel_fields_config)
        queryConfig.value = (() => {
          if (queryInfo.excel_fields_config) {
            const _config: TQueryConfig[] = JSON.parse(queryInfo.excel_fields_config)
            return _config.filter(item => item.show).map(item => {
              item.value = ''
              return item
            }) || []
          }
          return []
        })()
      })
    }

    const valueChange = (item: TQueryConfig, val: string) => {
      console.log(item, val)
      item.value = val
    }

    const showResult = ref(false)
    const result = ref<any>(null)
    const onSubmit = () => {
      if (props.isPreview) return
      getResult({
        config: queryConfig.value,
        query_id: +id
      }).then(res => {
        console.log(res)
        result.value = res.row
        showResult.value = true
      })
    }
    return () => (
      <div class={css['wap-container']}>
        <div class='query-header'>
          <div class='query-title'>{queryInfo.title}</div>
        </div>
        <div style={{display: showResult.value ? 'none' : 'block'}}>
          <div class='query-description'>{queryInfo.description}</div>
          <div class='query-form'>
            <el-form ref='form' label-width='80px' size='mini'>
              {queryConfig.value.map((item,index) => {
                return (
                  <el-form-item label={item.title || item.label}>
                    <el-input modelValue={item.value} onInput={(val: string) => valueChange(item,val)} placeholder={`请输入${item.title}`}></el-input>
                  </el-form-item>
                )
              })}
              <el-form-item style='margin-bottom: 0'>
                <el-button class='query-result-btn' size='medium' type='primary' onClick={onSubmit}>立即查询</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        {result.value ? (
          <div class='query-result' style={{ display: showResult.value ? 'block' : 'none' }}>
            <div class='result-container'>
              {allQueryConfig.value.map(item => {
                return (
                  <div class='result-item'>
                    <div class='result-label'>{item.title ? item.title : item.label}</div>
                    <div class='result-value'>{ result.value[item.field] }</div>
                  </div>
                )
              })}
            </div>
            <div class='result-tip'>{queryInfo.result_tips}</div>
          </div>) : ''
        }
      </div>
    )
  }
})
