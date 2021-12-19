<?php

namespace app\model;

class UserProjectResult extends BaseModel
{
    protected $convertNameToCamel = true;

    public function getProcessDataAttr($value, $data) {
        if (!empty($value)) return json_decode($value);
        return [];
    }
}