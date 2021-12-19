import { defineComponent, reactive, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue'
import { useRouter } from 'vue-router'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Controller } from 'swiper'
import Header from './components/header'
import './home.scss'
// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/modules/pagination/pagination.scss'
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Controller])
export default defineComponent({
  setup () {
    const router = useRouter()
    const style = reactive({
      content: {
        overflow: 'hidden',
        position: 'relative'
      },
      footer: {
        height: 'auto',
        background: 'linear-gradient( 163deg, rgba(32, 84, 241, 0.67), rgba(34, 78, 243, 0.67), rgba(56, 234, 255, 0.67))',
        marginTop: '100px'
      }
    })

    function onStart () {
      router.push({
        path: '/home/start'
      })
    }

    const cuurentSlideIndex = ref(0)
    const controlledSwiper = ref<any>(null)
    function setControlledSwiper(swiper: any) {
      controlledSwiper.value = swiper
    }

    function onSlideChange() {}

    function slideTo(index: number) {
      controlledSwiper.value.slideTo(index)
      cuurentSlideIndex.value = index
    }

    const mainContainer = () => {
      return (
        <el-main style={style.content}>
          <div id='back-box' class='back-box' />
          <div id='content-page' class='content-page'>
            <div class='content-explain'>
              <h1 data-aos='fade-up' data-aos-duration='1000'>让企业和个人都能轻松拥有信息系统</h1>
              <h1 data-aos='fade-up' data-aos-duration='1100'>TDuck - Have what you want, get you income.</h1>
              <div data-aos='fade-up' data-aos-duration='1200'>
                <el-button class='banner-button-start' onClick={onStart}>开始使用</el-button>
                {/* <el-button class='banner-button-preview' click='$router.push({path'/home'})'>在线预览</el-button> */}
              </div>
            </div>
            <div id='image' data-aos='fade-up' class='image'><img src={require('@/assets/images/official/banner02.svg')} />
            </div>
          </div>
          <div class='content-wrapper'>
            <div class='en-title' data-aos='fade-down' data-aos-easing='linear' data-aos-duration='1000'>OUR STRENGTHS</div>
            <el-row gutter={2} class='content-wrapper-features'>
              <el-col xs={24} md={8} data-aos='fade-right'>
                <p class='title'>xxxxx</p>
                <p>xxxxxx</p>
              </el-col>
              <el-col xs={24} md={8} data-aos='fade-up'>
                <p class='title'>简洁，不失强大</p>
                <p>界面简洁，独特美感</p>
              </el-col>
              <el-col xs={24} md={8} data-aos='fade-left'>
                <p class='title'>所见，即所得</p>
                <p>无需编程，拖拽可视化模板或组件，即可生成精美信息收集系统</p>
              </el-col>
            </el-row>
            {/* <div data-aos='zoom-in' data-aos-duration='1000' class='content-wrapper-image'>
              <img src={require('@/assets/images/undraw_fitness_stats_sht6.png')} />
            </div> */}
            <div class='four_part'>
              <div class='four'>
                <p class='four_titles'>可视化配置按步完成</p>
                <div class='items'>
                  <div class='develop-to'>
                    <div class='four_item' onClick={() => { slideTo(0) }}>
                      <div class={['item_img', cuurentSlideIndex.value === 0 ? 'b' : '']}><img src='https://cdn.jnpfsoft.com/img/icon/icon69.png' alt='开放源代码' /></div>
                      <p class={['four_title', cuurentSlideIndex.value === 0 ? 'c' : '']}>信息录入</p>
                      <div class='line'></div>
                    </div>
                    <div class='four_item' onClick={() => { slideTo(1) }}>
                      <div class={['item_img', cuurentSlideIndex.value === 1 ? 'b' : '']}><img src='https://cdn.jnpfsoft.com/img/icon/icon70.png' alt='开放源代码' /></div>
                      <p class={['four_title', cuurentSlideIndex.value === 1 ? 'c' : '']}>拖拽控件</p>
                      <div class='line'></div>
                    </div>
                    <div class='four_item' onClick={() => { slideTo(2) }}>
                      <div class={['item_img', cuurentSlideIndex.value === 2 ? 'b' : '']}><img src='https://cdn.jnpfsoft.com/img/icon/icon71.png' alt='开放源代码' /></div>
                      <p class={['four_title', cuurentSlideIndex.value === 2 ? 'c' : '']}>属性设置</p>
                      <div class='line'></div>
                    </div>
                    <div class='four_item' onClick={() => { slideTo(3) }}>
                      <div class={['item_img', cuurentSlideIndex.value === 3 ? 'b' : '']}><img src='https://cdn.jnpfsoft.com/img/icon/icon72.png' alt='开放源代码' /></div>
                      <p class={['four_title', cuurentSlideIndex.value === 3 ? 'c' : '']}>发布功能</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="develop1">
              <Swiper
                modules={[ Navigation, Pagination, Scrollbar, A11y ]}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                controller={{ control: controlledSwiper }}
                slides-per-view={1}
                space-between={50}
                onSwiper={setControlledSwiper}
                onSlideChange={onSlideChange}
              >

                <SwiperSlide>
                  <div class="develop_item">
                    <div class="de_left">
                      <img src="https://cdn.jnpfsoft.com/img/icon/dev_icon2.png" alt="" />
                    </div>
                    <div class="de_right">
                      <div class="title">信息录入</div>
                      <p>名称、编码、分类、状态等信息填写，也可增加数据表，控件属性字段读取表</p>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div class="develop_item">
                    <div class="de_left">
                      <img src="https://cdn.jnpfsoft.com/img/icon/dev_icon1.png" alt="" />
                    </div>
                    <div class="de_right">
                      <div class="title">拖拽控件</div>
                      <p>配有丰富的组件，通过点选或拖拽形式配置出所需表单，并且有多种表单展示样式选择</p>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div class="develop_item">
                    <div class="de_left">
                      <img src="https://cdn.jnpfsoft.com/img/icon/dev_icon.png" alt="" />
                    </div>
                    <div class="de_right">
                      <div class="title">属性设置</div>
                      <p>不同的控件对应着不同的属性配置，根据表单特点编辑属性内容</p>
                    </div>
                </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div class="develop_item">
                    <div class="de_left">
                      <img src="https://cdn.jnpfsoft.com/img/icon/banner1.png" alt="" />
                    </div>
                    <div class="de_right">
                      <div class="title">发布功能</div>
                      <p>表单权限和数据管理设置，搭建好的表单应用在系统菜单中可以直接调用，也可复制使用</p>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <div class='content-wrapper-solutions'>
              <p class='title'>我们的解决方案</p>
              <div style='display: flex; flex-wrap: no-wrap;'>
                <div data-aos='zoom-out-up' style='flex: 1;'>
                  <div class='solution-item' data-aos='zoom-out-up' data-aos-duration='1000'>
                    <p class='title'>客户体验</p>
                    <img src={require('@/assets/images/official/solution1.png')} />
                    <p class='desc'>客户满意度 宾馆服务满意度</p>
                    <p class='desc'>餐厅满意度调查 公共服务满意度</p>
                    <p class='desc'>旅游服务满意度 经销商满意度</p>
                    <p onClick={() => { router.push({ path: '/home' }) }}>前往体验 &gt; </p>
                  </div>
                </div>
                <div data-aos='zoom-out-up' style='flex: 1;'>
                  <div class='solution-item' data-aos-duration='1000'>
                    <p class='title'>市场调研</p>
                    <img src={require('@/assets/images/official/solution2.png')} />
                    <p class='desc'>餐饮市场调查 手机市场调查</p>
                    <p class='desc'>培训市场调查 消费者调查</p>
                    <p class='desc'>APP市场调查 女性消费者偏好调查</p>
                    <p onClick={() => { router.push({ path: '/home' }) }}>前往体验 &gt; </p>
                  </div>
                </div>
                <div data-aos='zoom-out-up' style='flex: 1;'>
                  <div class='solution-item' data-aos-duration='1000'>
                    <p class='title'>报名登记</p>
                    <img src={require('@/assets/images/official/solution3.png')} />
                    <p class='desc'>才艺比赛报名 粉丝活动报名</p>
                    <p class='desc'>聚餐出游报名 活动/会务微信报名</p>
                    <p class='desc'>讲座公开课报名 商品订单</p>
                    <p onClick={() => { router.push({ path: '/home' }) }}>前往体验 &gt; </p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div class='content-wrapper-company'>
              <p class='title'>他们都在使用</p>
              <img data-aos='zoom-in' src={require('@/assets/images/official/use-commony.png')} />
            </div> */}
          </div>
        </el-main>
      )
    }

    const footer = () => {
      return (
        <el-footer style={style.footer}>
          <div class='footer-page'>
            <el-row gutter={20} class='footer-content'>
              <el-col xs={24} md={6} data-aos='fade-up' data-aos-delay='100'>
                <h1>关于我们</h1>
                <p>
                  xxx — 是一款能够帮助
                  你进行信息收集、市场开拓、
                  客户挖掘并展开持续营销活 动的管理平台。
                </p>
              </el-col>
              {/* <el-col xs={24} md={4} offset={1} class='project-url' data-aos='fade-up' data-aos-delay='200'>
                  <h1>项目地址</h1>
                  <a href='https://gitee.com/TDuckApp/tduck-platform' target='_blank'>Gitee码云</a>
                  <a href='https://github.com/TDuckCloud/tduck-platform' target='_blank'>Github</a>
              </el-col> */}
              <el-col xs={24} md={5} data-aos='fade-up' data-aos-delay='300'>
                <h1>联系方式</h1>
                <span>xxxx</span>
                <span>+86 xxxx</span>
                <span> 加入团队 xxxx</span>
              </el-col>
              <el-col xs={24} md={4} data-aos='fade-up' data-aos-delay='400'>
                <h1>友情地址</h1>
                <a href='https://element.eleme.cn/#/zh-CN/' target='_blank'>ElementUI</a>
                <a href='https://gitee.com/mrhj/form-generator' target='_blank'> form-generator</a>
              </el-col>
              <el-col xs={24} md={4} data-aos='fade-up' data-aos-delay='500'>
                <div class='qrcode'>
                  <div>
                    {/* <img src='@/assets/images/official/wxmpqrcode.png' /> */}
                    <p class='desc'>公众号</p>
                  </div>
                  <div>
                    {/* <img src='@/assets/images/official/contact_me_qr.png' /> */}
                    <p class='desc'>官方社群</p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class='footer-copyright' data-aos='fade-down' data-aos-anchor-placement='top-bottom'>
              <p>Copyright © 2021 xxxxx. All Rights Reserved.xxxxxx 版权所有</p>
            </div>
          </div>
        </el-footer>
      )
    }

    return () => {
      return (
        <div class='page-container'>
          <Header />
          {/* <div class={css['banner']}>
            <div class='page-content'>
              <Login />
            </div>
          </div> */}
          {mainContainer()}
          {/* <div class='article-container'>
            <div class='page-content'>
              <div class={css['article-block']}>
                <div class='block-title'></div>
              </div>
            </div>
          </div> */}
          {footer()}
        </div>
      )
    }
  }
})
