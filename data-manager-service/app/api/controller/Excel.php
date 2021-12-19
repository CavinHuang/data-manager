<?php

namespace app\api\controller;

use app\api\BaseController;
use Overtrue\Pinyin\Pinyin;
use think\App;
use app\model\Attach as model;
use PhpOffice\PhpSpreadsheet\IOFactory;
use think\facade\Cache;

class Excel extends BaseController
{

    protected $reader;

    /**
     * @throws \PhpOffice\PhpSpreadsheet\Reader\Exception
     */
    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new model();
    }

    public function excuseFields() {
        try {
            $attach_id = input('attach_id');
            if (empty($attach_id)) {
                return jerr('没有需要读取的excel');
            }
            $fileInfo = $this->model->where('attach_id', $attach_id)->find();
            if (empty($fileInfo) || !$fileInfo) {
                return jerr('没有需要读取的excel');
            }
            $spreadsheet = IOFactory::load(PUBLIC_PATH . '/uploads/' . $fileInfo['attach_path']);

            // 获取活动工作簿
            $sheet = $spreadsheet->getActiveSheet();

            // 获取内容的最大列 如 D
            $highest = $sheet->getHighestDataColumn();

            // 获取内容的最大行 如 4
            // $row = $sheet->getHighestRow();

            // 获取字段
            $fields = [];
            $i = 1;
            $pingYin = new Pinyin();
            for ($column = 'A'; $column <= $highest; $column++) {
                $field = $sheet->getCellByColumnAndRow($i, 1)->getFormattedValue();
                $fields[] = [
                    'label' => $field,
                    'field' => $pingYin->permalink($field, '_')
                ];
                $i++;
            }
            if (empty($fields)) return jerr('您的excel是空的');
            else return jok('解析成功', ['fields' => $fields]);
        } catch (\Exception $e) {
            \think\facade\Log::write($e->getMessage() . '\n' . $e->getTraceAsString());
            return jerr('解析excel失败，请先确认你的excel是否正常！', $e);
        }
    }

    /**
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\DataNotFoundException
     * @throws \Exception
     */
    public static function excuse($attach_id) {
        if (empty($attach_id)) {
            throw new \Exception('没有附件ID');
        }
        $fileInfo = (new model())->where('attach_id', $attach_id)->find();
        if (empty($fileInfo) || !$fileInfo) {
            throw new \Exception('不存在该附件');
        }
        $spreadsheet = IOFactory::load(PUBLIC_PATH . '/uploads/' . $fileInfo['attach_path']);

        // 获取活动工作簿
        $sheet = $spreadsheet->getActiveSheet();

        // 获取内容的最大列 如 D
        $highest = $sheet->getHighestDataColumn();

        // 获取内容的最大行 如 4
        $row = $sheet->getHighestDataRow();

        // 获取字段
        $data = [];
        $columns = 0;
        for ($column = 'A'; $column <= $highest; $column++) {
            $columns++;
        }
        for ($i = 2; $i <= $row; $i++) {
            // D 1234 C 123
            $row_data = [];
            for ($j = 1; $j <= $columns; $j++) {
                $row_data[] = $sheet->getCellByColumnAndRow($j, $i)->getFormattedValue();
            }
            $data[] = $row_data;
        }
        if (empty($data)) throw new \Exception('没有读取到数据');
        else return $data;
    }
}