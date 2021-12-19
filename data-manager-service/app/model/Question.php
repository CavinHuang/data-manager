<?php

namespace app\model;

class Question extends BaseModel
{
    protected $convertNameToCamel = true;

    public function items() {
        return $this->hasMany('\\app\\model\\QuestionItem', 'question_key', 'key');
    }

    public function theme() {
        return $this->hasOne('\\app\\model\\UserProjectTheme', 'project_key', 'key');
    }

    public function getCreateTimeAttr($value, $data) {
        if (!empty($value)) return date('Y-m-d H:i:s', $value);
        return date('Y-m-d H:i:s');
    }
    public function getUpdateTimeAttr($value, $data) {
        if (!empty($value)) return date('Y-m-d H:i:s', $value);
        return date('Y-m-d H:i:s');
    }
}