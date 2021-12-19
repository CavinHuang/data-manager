<?php

namespace app\model;

use app\model\BaseModel;

class Access extends BaseModel
{
    /**
     * 创建一个新的授权
     *
     * @param [int] UserID
     * @param [plat] 授权平台
     * @return 授权信息|false
     */
    public function createAccess($access_user, $access_plat)
    {
        //将该平台下所有授权记录标记为失效
        $this->where([
            "access_user" => $access_user,
            "access_plat" => $access_plat
        ])->update(['access_status' => 1]);
        //生成一个新的Access_token
        $access_token = sha1(time()) . rand(100000, 99999) . sha1(time());
        $access_id = $this->insertGetId([
            "access_user" => $access_user,
            "access_plat" => $access_plat,
            "access_token" => $access_token,
            "access_ip" => request()->ip(),
            "access_createtime" => time(),
            "access_updatetime" => time()
        ]);
        $access = $this->where("access_id", $access_id)->find();
        return $access ?? false;
    }

    /**
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\db\exception\DbException
     * @throws \think\db\exception\DataNotFoundException
     */
    public static function getUserInfo($access_token) {
        $access = (new Access)->field('access_user')->where('access_token', $access_token)->find();
        return (new User())->where('user_id', $access['access_user'])->find();
    }
}
