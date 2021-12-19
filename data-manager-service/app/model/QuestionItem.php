<?php

namespace app\model;

class QuestionItem extends BaseModel
{
    protected $convertNameToCamel = true;

    /**
     * @param $value
     * @param $data
     * @return bool
     */
    public function getIsDisplayTypeAttr($value,$data)
    {
        if ($value === 1) return true;
        return false;
    }

    public function getShowLabelAttr($value,$data) {
        if ($value === 1) return true;
        return false;
    }

    public function getRequiredAttr($value,$data) {
        if ($value === 1) return true;
        return false;
    }

    public function getExpandAttr($value, $data) {
        if (!empty($value)) return json_decode($value);
        return [];
    }

    public function getDefaultValueAttr($value, $data) {
        if (!empty($value)) return json_decode($value);
        return [];
    }

    public function getRegListAttr($value, $data) {
        if (!empty($value)) return json_decode($value);
        return [];
    }
}