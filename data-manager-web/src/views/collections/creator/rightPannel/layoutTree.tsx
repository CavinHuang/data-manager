import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'LayoutTree',
  props: {
    activeData: {
      type: Object as PropType<any>
    }
  },
  setup(props) {
    const layoutTreeProps = {
      label(data: any, node: any) {
        const config = data.__config__
        return data.componentName || `${config.label}: ${data.__vModel__}`
      }
    }
    return () => (
      <>
        <el-divider>布局结构树</el-divider>
        <el-tree
          data={[(props.activeData as any).__config__]}
          props={layoutTreeProps}
          default-expand-all
          draggable={true}
          node-key="renderKey"
          v-slots={{
            default: ({ node, data }: any) => {
              <span class="node-label">
                <svg-icon
                  name={data.__config__ ? data.__config__.tagIcon : data.tagIcon}
                  class="node-icon"
                />
                { node.label }
              </span>
            }
          }}
        />
      </>
    )
  }
})
