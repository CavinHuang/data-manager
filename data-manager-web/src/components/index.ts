import { App } from 'vue'
import { ElButton, ElOption, ElSelect, ElInput, ElCheckbox, ElCheckboxGroup, ElRadio, ElRadioGroup, ElTable, ElTableColumn, ElForm, ElFormItem, ElRow, ElCol, ElDialog, ElScrollbar, ElDivider, ElInputNumber, ElRate, ElSlider, ElUpload, ElDatePicker, ElTimePicker, ElColorPicker, ElSwitch, ElTabs, ElTabPane, ElTree, ElCascader, ElCard, ElMenu, ElMenuItem, ElImage, ElTooltip, ElLink, ElMain, ElFooter, ElDrawer, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElPagination} from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import SvgIcon from './SvgIcon/index.vue'
import FormComponent from './form'

export default {
  install (app: App) {
    const elementComponents = [ElButton, ElOption, ElSelect, ElInput, ElCheckboxGroup, ElRadio, ElRadioGroup, ElCheckbox, ElTable, ElTableColumn, ElForm, ElFormItem, ElRow, ElCol, ElDialog, ElScrollbar, ElDivider, ElInputNumber, FormComponent, ElRate, ElSlider, ElUpload, ElCascader, ElDatePicker, ElTimePicker, ElColorPicker, ElSwitch, ElTabs, ElTabPane, ElTree, ElCard, ElMenu, ElMenuItem, ElImage, ElTooltip, ElLink, ElMain, ElFooter, ElDrawer, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElPagination]

    elementComponents.forEach((sfc: any) => {
      app.use(sfc)
    })
    app.component('el-main', ElMain)
    app.component('el-footer', ElFooter)
    app.component('svg-icon', SvgIcon)
  }
}
