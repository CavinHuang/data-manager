<?php

namespace app\model;

class UserProjectTheme extends BaseModel
{
    protected $convertNameToCamel = true;

    public function detail() {
        return $this->hasOne('\\app\\model\\ProjectTheme', 'id', 'theme_id')->bind(['name', 'style', 'head_img_url', 'color', 'btns_color']);
    }
}