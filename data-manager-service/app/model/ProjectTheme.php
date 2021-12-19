<?php

namespace app\model;

class ProjectTheme extends BaseModel
{
    protected $convertNameToCamel = true;

    public function getStyleAttr($value, $data) {
        if (!empty($value)) return json_decode($value);
        return [];
    }

    public function getColorAttr($value, $data) {
        if (!empty($value)) return json_decode($value);
        return [];
    }
}