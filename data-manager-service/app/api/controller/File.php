<?php

namespace app\api\controller;

use app\api\BaseController;
use think\App;
use app\model\Attach as AttachModel;

class File extends BaseController
{

    public function __construct(App $app)
    {
        parent::__construct($app);
        $this->model = new AttachModel();
    }


    public function upload() {
        $files = $this->request->file();
        $file_paths = [];
        if (count($files)) {
            $save_res = [];
            foreach ($files as $key => $file) {
                $attach_path = str_replace('\\', '/',\think\facade\Filesystem::putFile('file', $file));
                $attach_type = $file->getOriginalMime();
                $attach_extension = $file->getOriginalExtension();
                $attach_filename = $file->getOriginalName();
                $attach_size = $_FILES[$key]['size'];
                $tmp_info = [
                    'attach_path' => $attach_path,
                    'attach_type' => $attach_type,
                    'attach_extension' => $attach_extension,
                    'attach_filename' => $attach_filename,
                    'attach_size' => $attach_size
                ];
                $save_res[] = $tmp_info;
                $file_paths[] = $attach_path;
            }

            $this->model->insertAll($save_res);
            $ids = $this->model->field('attach_id, attach_path')->whereIn('attach_path', $file_paths)->select();

            $return_res = [];
            if (count($files) > 1) {
                foreach ($save_res as $file) {
                    foreach ($ids as $item) {
                        if ($file['attach_path'] === $item['attach_path']) {
                            $file['attach_id'] = $item['attach_id'];
                        }
                    }
                }
                $return_res = $save_res;
            } else {
                $return_res = $save_res[0];
                $return_res['attach_id'] = $ids[0]['attach_id'];
            }

            return jok('上传成功', $return_res);
        } else {
            return jerr('请先上传附件');
        }
    }
}