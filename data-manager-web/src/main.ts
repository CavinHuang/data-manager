import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/index.scss'
import components from '@/components'
import 'element-plus/dist/index.css'
import VueClipboard from 'vue-clipboard2'

const app = createApp(App)
app.use(components).use(VueClipboard).use(store).use(router).mount('#app')
console.log(app)
