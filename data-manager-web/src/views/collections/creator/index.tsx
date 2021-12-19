/*
 * @Author: your name
 * @Date: 2021-09-19 13:34:35
 * @LastEditTime: 2021-11-05 22:38:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\views\collections\creator\index.tsx
 */
import { defineComponent, ref,computed } from 'vue'
import style from './style.module.scss'
import '@/assets/styles/form/index.scss'
import '@/assets/styles/form/home.scss'
import PreView from '../preview'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Creator',
  setup() {
    const previewDialogVisible = ref(false)
    const router = useRouter()
    const route = useRoute()

    const headerRender = () => {
      return (
        <el-card class="header-container">
          <el-row align="middle" class='el-row--flex' gutter={5} style='margin-top: 5px; margin-right: 32px;'>
            <i class="el-icon-back" onClick={() => {router.go(-1)}} />
            <el-col style='flex: 1;' />
            <el-button size='medium' type="primary" icon="el-icon-view" onClick={() => { previewDialogVisible.value = true }}>预览</el-button>
            {/* <el-button size='medium' type="success" icon="el-icon-folder-add" onClick={() => {}} >保存为模板</el-button > */}
          </el-row >
        </el-card >
      )
    }
    const isCollapse = ref(false)
    const collapseHandle = () => {
      let _isCollapse = !isCollapse.value
      isCollapse.value = _isCollapse
    }
    const defaultActiveMenu = ref(route.path)
    const menuSelectHandle = (path: string) => {
      router.replace({ path: path, query: { key: route.query.key } })
    }
    const previewKey = computed(() => +new Date())
    const menuItemList = [
      {
        title: '编辑',
        icon: 'el-icon-edit',
        route: '/creator/form'
      },
      // {
      //   title: '逻辑',
      //   icon: 'el-icon-menu',
      //   route: '/project/form/logic'
      // },
      {
        title: '外观',
        icon: 'el-icon-view',
        route: '/creator/theme'
      },
      {
        title: '设置',
        icon: 'el-icon-setting',
        route: '/creator/setting'
      },
      {
        title: '发布',
        icon: 'el-icon-video-play',
        route: '/creator/publish'
      },
      // {
      //   title: '统计',
      //   icon: 'el-icon-data-line',
      //   route: '/project/form/statistics'
      // }
    ]
    return () => (
      <div class={style['form-index-container']}>
        {headerRender()}
        <div class='main-container'>
          <div class='left-menu-container'>
            <el-menu collapse={isCollapse.value} default-active={defaultActiveMenu.value} class='el-menu-vertical' onSelect={menuSelectHandle}>
              {menuItemList.map((menuItem, index) => {
                return (
                  <el-menu-item key={menuItem.route} index={menuItem.route} v-slots={{
                    default: () => <>
                      <i class={menuItem.icon} />
                      <span>{menuItem.title}</span>
                    </>
                  }}>
                  </el-menu-item>
                )
              })}
            </el-menu>
            {isCollapse.value ? <i class='el-icon-d-arrow-left' onClick={collapseHandle} /> : <i class='el-icon-d-arrow-right' onClick={collapseHandle} />}
          </div>
          <div class='right-content-container'>
            <router-view />
          </div>
        </div>
        <el-dialog
          modelValue={previewDialogVisible.value}
          onClosed={() => { previewDialogVisible.value = false }}
          destroy-on-close
          fullscreen
        >
          <PreView key={previewKey.value} preview-qrcode={true} />
        </el-dialog>
      </div>
    )
  }
})
