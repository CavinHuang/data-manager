import { computed, defineComponent, Prop } from 'vue'
export default defineComponent({
  name: 'ResultItem',
  props: {
    projectItemData: {
      type: Object,
      default: () => ({})
    },
    resultData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    fieldItemId: {
      type: Number,
      default: 0
    }
  },
  setup(props: any) {
    const processData = computed(() => {
      return props.resultData ? props.resultData['processData'] : {}
    })
    const getItemValue = computed(() => {
      if (processData.value) {
        if(processData.value[`field${props.fieldItemId}other`]){
          // 如果存在其他的内容，返回lable+内容
          return processData.value[`field${props.fieldItemId}`] + ':'+processData.value[`field${props.fieldItemId}other`]
        }
        return processData.value[`field${props.fieldItemId}`] ? processData.value[`field${props.fieldItemId}`] : ''
      }
      return ''
    })
    return () => (
      <>
        {props.projectItemData.type=='UPLOAD' ? <div>
          {getItemValue.value['files'] ? <div>
            {/* <!-- 图片文件渲染图片栏 --> */}
            {getItemValue.value['type'] === 'image' ? getItemValue.value['files'].map((file: any) => <span key={JSON.stringify(file)}>
                <el-image class="item-thumbnail-image-preview" src={file.url} preview-src-list={getItemValue.value['files'].map((img: any) => img.url)} lazy />
              </span>) :
              /* 其他文件渲染文件下载链接 */
              getItemValue.value['files'].map((file: any) => <el-link
                  key={file}
                  href={file.url}
                  target="_blank"
                  type="primary"
                >
                  <span> { file.fileName }</span>
              </el-link>)
            }
          </div> : <span>/</span>}
        </div> : (props.projectItemData.type=='SIGN_PAD' ? <div><el-image class="item-thumbnail-image-preview" src={getItemValue.value || ''} preview-src-list={[getItemValue.value || '']} lazy /></div> : <div>{ getItemValue.value|| '/' }</div>)}
    </>
    )
  }
})
