<?php

namespace app\api\controller;

use app\api\BaseController;
use think\App;

class Setting extends BaseController
{

    private $setting_model = null;

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->setting_model = new \app\model\UserProjectSetting();
    }

    public function detail($key = '') {
        $result = $this->setting_model->where('project_key', $key)->find();
        return jok('查询成功', $result);
    }

    /**
     * 保存
     *
     * @return \json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function save_setting() {
        $postData = $this->request->post();

        $detail = $this->setting_model->where('project_key', $postData['projectKey'])->find();

        $saveData = [
            'everyone_day_write_once' => $postData['everyoneDayWriteOnce'],
            'everyone_write_once' => $postData['everyoneWriteOnce'],
            'new_write_notify_email' => $postData['newWriteNotifyEmail'],
            'new_write_notify_wx' => $postData['newWriteNotifyWx'],
            'project_key'=> $postData['projectKey'],
            'public_result'=> $postData['publicResult'],
            'record_wx_user'=> $postData['recordWxUser'],
            'share_desc'=> $postData['shareDesc'],
            'share_img'=> $postData['shareImg'],
            'share_title'=> $postData['shareTitle'],
            'submit_jump_url'=> $postData['submitJumpUrl'],
            'submit_prompt_Img'=> $postData['submitPromptImg'],
            'submit_prompt_text'=> $postData['submitPromptText'],
            'timed_collection_begin_time'=> $postData['timedCollectionBeginTime'],
            'timed_collection_end_time'=> $postData['timedCollectionEndTime'],
            'timed_deactivate_prompt_text'=> $postData['timedDeactivatePromptText'],
            'timed_end_prompt_text'=> $postData['timedEndPromptText'],
            'timed_not_enabled_prompt_text'=> $postData['timedNotEnabledPromptText'],
            'timed_quantitative_quantity'=> $postData['timedQuantitativeQuantity'],
            'write_once_prompt_text'=> $postData['writeOncePromptText'],
            'wx_write'=> $postData['wxWrite'],
            'wx_write_once'=> $postData['wxWriteOnce'],
        ];
        $res = false;
        if ($detail) {
            $res = $detail->save($saveData);
        } else {
            $res = $this->setting_model->save($saveData);
        }

        if ($res) {
            return jok('操作成功');
        }
        return jerr('操作失败');
    }
}