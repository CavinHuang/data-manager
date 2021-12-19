import { defineComponent } from 'vue'
import UserHeader from './components/userHeader'
import css from './index.module.scss'

export default defineComponent({
  name: 'HomeUser',
  setup() {
    return () => (
      <div class='page-container'>
        <UserHeader />
        <div class='page-content'>
          <div class={[css['main-container'],'mt_20']}>
            <div class='query-setup' style='display: none'>
              <div class='setup-title'>第一步: 设置采集名称</div>
              <div class='setup-form-block'>
                <div class='form-label'>采集名称</div>
                <div class='form-input-wrapper'>
                  <el-input class='form-input' placeholder='例如:2020学年第一学期期末考试成绩' />
                </div>
                <div class='form-button'>
                  <el-button class='form-button-primary'>点击下一步</el-button>
                </div>
              </div>
            </div>
            <div class='query-setup' style='display: none'>
              <div class='setup-title'><span>第二步: 上传采集内容</span> <span class='title-tip'>若无法上传，请更换浏览器或者切换“极速模式”</span></div>
              <div class='setup-form-block'>
                <div class='excel-demo'>
                  <img src={require('../../assets/images/excel-demo2.png')} alt='excel-demo' />
                  <div class='tip-txt'>确认你上传的excel表格没有上图的缺陷。</div>
                  <div class='upload-info'>上传成功!xxxxx.xlsx</div>
                </div>
                <div class='form-button' style='margin-top: 10px;'>
                  <el-button class='form-button-primary'>在线编辑表头</el-button>
                  <el-button class='form-button-primary'>点击上传excel表格文件</el-button>
                </div>
                <div class='form-button' style='margin-top: 10px;'>
                  <el-button class='form-button-primary' style='width: 90%'>点击下一步</el-button>
                </div>
              </div>
            </div>
            <div class='query-setup' style='display: block'>
              <div class='setup-title'><span>第三步: 采集条件设置</span></div>
              <div class='setup-container'>
                <div class='setup-left'>
                  <div class='query-block'>
                    <div class='query-tip'>请选择查询页需要输入的内容</div>
                  </div>
                  <div class='setup-form'>
                    <div class='setup-content'>
                      <div class='setup-block'>
                        <div class='setup-block__title'>说明:(提示语)</div>
                        <div class='setup-block__input'>
                          <el-input type='textarea' size='medium' row={3} placeholder='请输入提示语'></el-input>
                        </div>
                      </div>
                      <div class='setup-block'>
                        <div class='add-collection'>
                          <i class='icon-add-collection'></i>
                          <span>新建收集</span>
                        </div>
                      </div>
                    </div>

                    <div class='setup-content'>
                      <div class='setup-block'>
                        <div class='setup-block__title red-txt'>采集条件:(必选)</div>
                        <div class='setup-block__content'>
                          <div class='setup-block__item'>
                            <div class='field'>
                              <el-checkbox />
                              <span>班级</span>
                            </div>
                          </div>
                          <div class='setup-block__item'>
                            <div class='field'>
                              <el-checkbox />
                              <span>姓名</span>
                            </div>
                          </div>
                          <div class='setup-block__item'>
                            <div class='field'>
                              <el-checkbox />
                              <span>性别</span>
                            </div>
                          </div>
                          <div class='setup-block__item'>
                            <div class='field'>
                              <el-checkbox />
                              <span>毕业院校</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class='quey-setup-tip'>
                    <div class='setup-block'>
                      <div class='setup-block__title'>查询结果页提示文字：</div>
                      <div class='setup-block__input'>
                        <el-input type='textarea' size='medium' row={3} placeholder='请输入提示语'></el-input>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='setup-right'>
                  <div class='preview'>此处需要增加预览</div>
                </div>
              </div>
              <el-button class='query-btn'>提交并生成</el-button>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
