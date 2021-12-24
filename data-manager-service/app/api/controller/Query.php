<?php

namespace app\api\controller;

use app\api\BaseController;
use app\model\QueryDetail;
use think\App;
use app\model\Query as Model;
use app\model\QueryDetail as DetailModel;
use think\facade\Db;
use utils\StringTools;

class Query extends BaseController
{

    public function __construct(App $app)
    {
        parent::__construct($app);
        //查询字段
        $this->selectList = "*";
        $this->selectDetail = "*";
        //筛选字段
        $this->searchFilter = [
            "id" => "=",
            "user_id" => "=",
            "source_id" => "=",
            "title" => "like",
            "status" => "=",
        ];
        $this->insertFields = [
            "user_id", "source_id", "title", "description", "limit_number", "result_tips", "excel_fields", "excel_fields_config", 'status'
        ];
        $this->updateFields = [
            "user_id", "source_id", "title", "description", "limit_number", "result_tips", "excel_fields", "excel_fields_config", 'status'
        ];
        $this->insertRequire = [
            'title' => "标题必须填写"
        ];
        $this->updateRequire = [
            'title' => "标题必须填写"
        ];
        $this->excelField = [];
        $this->model = new Model();
    }

    public function checkTable($table) {
        return Db::query('show tables like "'. $table .'"');
    }

    public function mastHaveTable($table) {
        if (!$this->checkTable($table)) {
            sleep(1);
            return $this->mastHaveTable($table);
        }
        return true;
    }

    /**
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\DataNotFoundException
     */
    public function create() {
        if (!input('title')) {
            return jerr('请先输入标题', 400);
        }
        try {
           $excel_data = Excel::excuse(input('attach_id'));
        } catch (\Exception $e) {
            return jerr($e->getMessage());
        }

        $excel_fields_data = input('fields', []);
        $excel_fields = $excel_fields_data ? json_encode($excel_fields_data) : '';
        $excel_fields_config = json_encode(input('field_config', []));
        $save_data = [
            'user_id'=> $this->user->user_id,
            'title' => input('title'),
            'source_id' => input('attach_id'),
            'description' => input('description', ''),
            'limit_number' => input('limit_number', 0),
            'result_tips' => input('result_tips', ''),
            'excel_fields' => $excel_fields,
            'excel_fields_config' => $excel_fields_config,
            'excel_total_row' => count($excel_data),
            "updatetime" => time()
        ];
        $id = input('id', '');
        if (!empty($id)) {
            $this->model->startTrans();
            $model = $this->model->find($id);
            $model->save($save_data);
            $hasTable = $this->mastHaveTable('sa_query_data_' . $id);
            if (!$hasTable) {
                \app\model\Query::createDataTable($id, $excel_fields_data);
                $hasTable = $this->mastHaveTable('sa_query_data_' . $id);
                if ($hasTable) {
                    $this->_saveExcelData($id, $excel_fields_data, $excel_data);
                }
            }
            $this->model->commit();
            return jok('保存成功');
        } else {
            $this->model->startTrans();
            try {
                $save_data['createtime'] = time();
                $key = StringTools::create_uuid('QY');
                $save_data['key'] = $key;
                $insert_id = $this->model->insertGetId($save_data);
                $res = \app\model\Query::createDataTable($insert_id, $excel_fields_data);
                $hasTable = $this->mastHaveTable('sa_query_data_' . $insert_id);
                if ($hasTable) {
                    $this->_saveExcelData($insert_id, $excel_fields_data, $excel_data);
                }
                $this->model->commit();
                return jok('保存成功', [ 'id' => $insert_id, 'key' => $key ]);
            } catch (\Exception $e) {
                // 回滚事务
                $this->model->rollback();
                \think\facade\Log::write($e->getMessage() . '\n' . $e->getTraceAsString());
                return jerr('保存失败', ['message' => $e->getMessage(), 'trance' => $e->getTraceAsString()]);
            }
        }
    }

    private function _saveExcelData($query_id, $fields = [], $excel_data = []) {
        $save_data = [];

        foreach ($excel_data as $row) {
            $_tmp_row = [
                "createtime" => time(),
                "updatetime" => time()
            ];
            foreach ($fields as $key => $item) {
                $_tmp_row[$item['field']] = $row[$key];
            }
            $save_data[] = $_tmp_row;
        }
        Db::name('query_data_' . $query_id)->insertAll($save_data);
    }

    public function delete_row($id = '') {
        if (empty($id)) return jerr('不存在的记录');
        $this->model->startTrans();
        try {
            // 删除当条记录
            $this->model->destroy($id);
            // 删除数据记录表
            $this->model::dropDataTable('sa_query_data_' . $id);

            $this->model->commit();
            return jok('删除成功');
        } catch (\Exception $e) {
            $this->model->rollback();
            \think\facade\Log::write($e->getMessage() . '\n' . $e->getTraceAsString());
            return jerr('删除失败', ['message' => $e->getMessage(), 'trance' => $e->getTraceAsString()]);
        }
    }

    public function update_status() {
        $post = $this->request->post();
        if (!isset($post['id']) || empty($post['id'])) return jerr('没有这样的记录');
        $row = $this->model->where('id', $post['id'])->find();

        if (!$row || empty($row)) return jerr('没有这样的记录');

        if ($row->where('id', $post['id'])->update(['status' => $post['status']])) {
            return jok('成功');
        }
        return jerr('失败');
    }

    public function lists($page = 1, $page_size = 10) {
        $lists = $this->model->where(['user_id' => $this->user->user_id, 'is_deleted' => 0])->order('id desc, createtime desc')->paginate(['list_rows' => $page_size, 'query' => ['page' => $page]]);
        return jok('查询成功', $lists);
    }

    public function update() {
        $id = input('query_id');
        if (empty($id)) return jerr('请先确认需要更新的数据');
        $data = input();
        unset($data['query_id']);

        if ($this->model->where('id', $id)->update($data)) {
            return jok('数据更新成功');
        }
        return jerr('数据更新失败');
    }

    /**
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\DbException
     */
    public function get($id = '', $key = '') {
        if (empty($id) && empty($key)) return jerr('没有这样的数据');
        $where = [];
        if (!empty($id)) {
            $where['id'] = $id;
        }

        if (!empty($key)) {
            $where['key'] = $key;
        }
        $detail = $this->model->where($where)->find();

        if ($detail) {
            return jok('查询成功', $detail);
        }
        return jerr('没有这样的数据', 404);
    }

    public function getResult() {
        $query_id = input('query_id');
        if (empty($query_id)) return jerr('没有这样的数据');
        $detail = $this->model->where('id', $query_id)->find();
        if (empty($detail)) return jerr('没有这样的数据');
        $data = input();
        $config = $data['config'] ?? [];
        $where = [];
        foreach ($config as $item) {
            $where[] = [$item['field'], '=', $item['value']];
        }
        $res = Db::name('query_data_' . $query_id)->where($where)->find();
        if ($res) return jok('查询成功', ['query' => $detail, 'row' => $res]);
        else return jerr('没有查询到您的信息, 请先确认！', 404);
    }
}