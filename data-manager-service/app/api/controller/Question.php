<?php

namespace app\api\controller;

use app\api\BaseController;
use app\model\QuestionItem;
use app\model\UserProjectResult;
use think\App;
use utils\IpTool;
use utils\SortUtil;
use utils\StringTools;

class Question extends BaseController
{
    private $questionModel = null;
    private $questionItemModel = null;
    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->questionModel = new \app\model\Question;
        $this->questionItemModel = new QuestionItem();
    }

    /**
     * 创建问卷
     *
     * @return \json
     */
    public function create() {
        $data = $this->request->post();
        $saveData = [
            'key' => StringTools::create_uuid('QS'),
            'name' => $data['name'] ?? '问卷名称',
            'describe' => $data['describe'] ?? '问卷描述',
            'create_time' => time(),
            'update_time' => time(),
            'status' => 1,
            'user_id' => $this->user->user_id
        ];

        if ($this->questionModel->save($saveData)) {
            return jok('创建成功', ['key' => $saveData['key']]);
        }
        return jerr('创建失败,请重试~');
    }

    /**
     * 查询单个
     *
     * @param string $key
     * @return \json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function getQuestion($key = '') {
        if (!$key) return jerr('没有这样的项目');
        $res = $this->questionModel->with(['items' => function($query) {
            $query->order('sort', 'asc');
        }])->where('key', $key)->find();
        if ($res) return jok('查询成功', $res);
        return jerr('没有这样的数据');
    }

    /**
     * 查询单个
     *
     * @param string $key
     * @return \json|void
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function detail($key = '') {
        if (!$key) return jerr('没有这样的项目');
        $res = $this->questionModel->with(['items' => function($query) {
            $query->order('sort', 'asc');
        }, 'theme.detail'])->where('key', $key)->find();
        if ($res) return jok('查询成功', $res);
        return jerr('没有这样的数据');
    }

    public function publish($key = '') {
        $item = $this->questionModel->where('key', $key)->find();

        if (!$item) return jerr('不存在的项目');

        if ($item->save(['status' => 2])) {
            return jok('发布成功');
        }
        return jerr('发布失败');
    }

    public function stop_publish($key = '') {
        $item = $this->questionModel->where('key', $key)->find();

        if (!$item) return jerr('不存在的项目');

        if ($item->save(['status' => 3])) {
            return jok('撤回成功');
        }
        return jerr('撤回失败');
    }

    /**
     * 创建单项
     *
     * @return \json
     */
    public function create_item() {
        $data = $this->request->post();
        $maxSort = $this->questionItemModel->where('question_key', $data['questionKey'])->max('sort') ?? 1;
        $maxSort ++;

        $defaultValue = isset($data['defaultValue']) ? (is_array($data['defaultValue']) ? json_encode(['json' => $data['defaultValue']]) : json_encode(['value' => $data['defaultValue']])) :  '';

        $saveData = [
            'question_key' => $data['questionKey'],
            'form_item_id' => $data['formItemId'],
            'type' => $data['type'],
            'label' => $data['label'],
            'is_display_type' => $data['isDisplayType'] ?? 0,
            'show_label' => $data['showLabel'] ?? 0,
            'default_value' => $defaultValue,
            'required' => $data['required'] ?? 0,
            'placeholder' => $data['placeholder'] ?? '',
            'sort' => $maxSort,
            'span' => $data['span'] ?? 24,
            'expand' => isset($data['expand']) ? json_encode($data['expand']) : '',
            'reg_list' => isset($data['regList']) ? json_encode($data['regList']) : '',
            'update_time' => time(),
            'create_time' => time()
        ];


        if ($this->questionItemModel->save($saveData)) {
            return jok('创建成功', ['itemDataId' => $this->questionItemModel->getLastInsID(), 'operateSuccess' => true, 'sort' => $maxSort]);
        }
        return jerr('创建失败');
    }

    /**
     * 查询最大的formId
     *
     * @param $key
     * @return \json
     */
    public function max_form_id($key) {
        if (empty($key)) return jok('查询成功');
        $id = $this->questionItemModel->where('question_key', $key)->max('form_item_id');
        return jok('查询成功', $id);
    }

    public function update_item() {
        $data = $this->request->post();
        $item = $this->questionItemModel->where(['form_item_id' => $data['formItemId'], 'question_key' => $data['questionKey']])->find();
        $defaultValue = isset($data['defaultValue']) ? (is_array($data['defaultValue']) ? json_encode(['json' => $data['defaultValue']]) : json_encode(['value' => $data['defaultValue']])) :  $item->default_value;
        $saveData = [
            'type' => $data['type'] ?? $item->type,
            'label' => $data['label'] ?? $item->label,
            'is_display_type' => $data['isDisplayType'] ?? $item->is_display_type,
            'show_label' => $data['showLabel'] ?? $item->show_label,
            'default_value' => $defaultValue,
            'required' => $data['required'] ?? $item->required,
            'placeholder' => $data['placeholder'] ?? $item->placeholder,
            'span' => $data['span'] ?? $item->span,
            'expand' => isset($data['expand']) ? json_encode($data['expand']) : $item->expand,
            'reg_list' => isset($data['regList']) ? json_encode($data['regList']) : $item->reg_list,
            'update_time' => time()
        ];

        if ($item->save($saveData)) {
            return jok('更新成功');
        }
        return jerr('更新失败');
    }

    public function item_lists($projectKey = '', $displayType = false) {
        $items = $this->questionItemModel->where(['question_key' => $projectKey, 'is_display_type' => $displayType])->select();

        return jok('查询成功', $items);
    }

    /**
     * 删除项
     *
     * @param array $ids
     * @return \json
     */
    public function delete_item() {
        $ids = $this->request->post('ids', []);
        if (empty($ids)) {
            return jerr('没有要删除的项');
        }

        if ($this->questionItemModel->whereIn('id', $ids)->delete()) {
            return jok('删除成功');
        }
        return jerr('删除失败');
    }

    /**
     * 排序
     *
     * @return \json
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\ModelNotFoundException
     */
    public function sort() {
        $post = $this->request->post();

        $item = $this->questionItemModel->where(['question_key' => $post['questionKey'], 'form_item_id' => $post['formItemId']])->find();

        if (!$item) return jok('成功');

        $beforePosition = $post['beforePosition'] ?? 0;
        $afterPosition = $post['afterPosition'] ?? 0;
        $sort = SortUtil::calcSortPosition($beforePosition, $afterPosition);
        $item->sort = $sort;
        if ($item->save()) {
            return jok('成功', ['sort' => $sort, 'itemDataId' => $item->id, 'operateSuccess' => true]);
        }
        return jerr('失败');
    }

    public function lists($page = 1, $page_size = 15) {
        $result = $this->questionModel->where(['user_id' => $this->user->user_id, 'is_deleted' => 0])->order('update_time desc, id desc')->paginate(['list_rows' => $page_size, 'query' => ['page' => $page]]);
        return jok('查询成功', $result);
    }

    public function result_create() {
        $entry = $this->request->post();
        $entry['submit_request_ip'] = $this->request->ip();
        $submitAddress = IpTool::fetch_address($entry['submit_request_ip']);
        $userProjectResult = new UserProjectResult();
        $serial_number = $userProjectResult->where(['project_key' => $entry['projectKey']])->max('serial_number');
        $saveData = [
            'project_key' => $entry['projectKey'],
            'serial_number' => $serial_number ? $serial_number + 1 : 1,
            'original_data' => isset($entry['originalData']) ? json_encode($entry['originalData']) : '',
            'process_data' => isset($entry['processData']) ? json_encode($entry['processData']) : '',
            'submit_ua' => isset($entry['submitUa']) ? json_encode($entry['submitUa']) : '',
            'submit_browser' => $entry['submitBrowser'] ?? '',
            'submit_os' => $entry['submitOs'] ?? '',
            'submit_request_ip' => $entry['submit_request_ip'],
            'submit_address' =>  $submitAddress,
            'complete_time' => $entry['completeTime'] ?? -1,
            'wx_open_id' =>  $entry['wxOpenId'] ?? '',
            'wx_user_info' =>  isset($entry['wxUserInfo']) ? json_encode($entry['wxUserInfo']) : '',
            'create_time' => time(),
            'update_time' => time()
        ];

        if ($userProjectResult->save($saveData)) {
            return jok('提交成功');
        }
        return jerr('提交失败，请重试~');
    }

    public function result_list() {
        $post = $this->request->post();
        $key = $post['projectKey'] ?? '';

        $result = (new UserProjectResult())->where(['project_key' => $key])->paginate(['list_rows' => $post['page_size'], 'query' => [ 'page' => $post['page'] ]]);

        if ($result) {
            return jok('查询成功', $result);
        }
        return jerr('查询失败');
    }
}