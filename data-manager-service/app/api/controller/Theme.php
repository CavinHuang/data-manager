<?php

namespace app\api\controller;

use app\api\BaseController;
use app\model\ProjectTheme;
use app\model\UserProjectTheme;
use think\App;

class Theme extends BaseController
{

    private $theme_model = null;
    private $user_theme_model = null;

    public function __construct(App $app)
    {
        parent::__construct($app);

        $this->theme_model = new ProjectTheme();
        $this->user_theme_model = new UserProjectTheme();
    }

    /**
     * 查询所有的主题
     *
     * @param string $color
     * @param string $style
     * @return \json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function lists($color = '', $style='') {
        $where = [];
        if (!empty($color)) {
            $where[] = ['color', 'like', "%" . urldecode($color) ."%"];
        }
        if (!empty($style)) {
            $where[] = ['style', 'like', "%" . urldecode($style) ."%"];
        }
        $result = $this->theme_model->where($where)->select();
        return jok('查询成功', $result);
    }

    public function save() {
        $postData = $this->request->post();
        $user_theme = $this->user_theme_model->where('project_key', $postData['projectKey'])->find();
        $saveData = [
            'background_color' => $postData['backgroundColor'],
            'background_img' => $postData['backgroundImg'],
            'logo_img' => $postData['logoImg'],
            'logo_position' => $postData['logoPosition'],
            'project_key' => $postData['projectKey'],
            'show_describe' => $postData['showDescribe'],
            'show_number' => $postData['showNumber'],
            'show_title' => $postData['showTitle'],
            'submit_btn_text' => $postData['submitBtnText'],
            'theme_id' => $postData['themeId']
        ];
        $flag = false;
        if ($user_theme) {
            $flag = $user_theme->save($saveData);
        } else {
            $flag = $this->user_theme_model->save($saveData);
        }
        if ($flag) {
            return jok('保存成功');
        }
        return jerr('保存失败');
    }

    public function detail($key = '') {
        $result = $this->user_theme_model->where('project_key', $key)->find();
        if ($result) {
            return jok('查询成功', $result);
        }
        return jerr('查询失败');
    }
}