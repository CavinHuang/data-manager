<?php

namespace app\model;

use app\model\BaseModel;

class User extends BaseModel
{
    /**
     * 用户登录
     *
     * @param string 帐号
     * @param string 密码
     * @return void
     */
    public function login($user_account, $user_password)
    {
        $user = $this->where([
            "user_account" => $user_account,
        ])->find();
        if ($user) {
            //判断密码是否正确
            $salt = $user['user_salt'];
            $password = $user['user_password'];
            if ($password != encodePassword($user_password, $salt)) {
                return false;
            }
            return $user->toArray() ?? false;
        } else {
            return false;
        }
    }

    /**
     * 用户注册
     *
     * @param string 手机号
     * @param string 密码
     * @param string 昵称
     * @return void
     */
    public function reg($phone, $password, $name, $user_unit = '', $user_truename = '')
    {
        $salt = getRandString(4);
        $password = encodePassword($password, $salt);
        return $this->insert([
            "user_account" => $phone,
            "user_password" => $password,
            "user_salt" => $salt,
            "user_name" => $name,
            "user_truename" => $user_truename,
            "user_unit" => $user_unit,
            "user_group" => config('startadmin.default_group') ?? 0,
            "user_ipreg" => request()->ip(),
            "user_createtime" => time(),
            "user_updatetime" => time()
        ]);
    }
    public function getListByPage($maps, $order = null, $field = "*")
    {
        $resource = $this->view('user', $field)->view('group', '*', 'group.group_id = user.user_group', 'left');
        foreach ($maps as $map) {
            switch (count($map)) {
                case 1:
                    $resource = $resource->where($map[0]);
                    break;
                case 2:
                    $resource = $resource->where($map[0], $map[1]);
                    break;
                case 3:
                    $resource = $resource->where($map[0], $map[1], $map[2]);
                    break;
                default:
            }
        }
        if ($order) {
            $resource = $resource->order($order);
        }
        return $resource->paginate($this->per_page);
    }

    /**
     * 重置密码
     *
     * @param string UID
     * @param string 密码
     * @return void
     */
    public function motifyPassword($user_id, $password)
    {
        $access = new Access();
        //将所有授权记录标记为失效
        $access->where('access_user', $user_id)->update(['access_status' => 1]);
        $salt = getRandString(4);
        $password = encodePassword($password, $salt);
        return $this->where([
            "user_id" => $user_id
        ])->update([
            "user_password" => $password,
            "user_salt" => $salt,
        ]);
    }

    /**
     * 通过帐号获取用户信息
     *
     * @param  string 帐号/手机号
     * @return void
     */
    public function getUserByAccount($user_account)
    {
        $user = $this->where([
            "user_account" => $user_account
        ])->find();
        if ($user) {
            return $user->toArray() ?? false;
        } else {
            return false;
        }
    }
    /**
     * AccessToken获取用户信息
     *
     * @param string access_token
     * @return void
     */
    public function getUserByAccessToken($access_token)
    {
        $Access = new Access();
        $access = $Access->where([
            "access_token" => $access_token,
            "access_status" => 0,
        ])->find();
        if ($access) {
            if (time() > $access['access_updatetime'] + 7200) {
                return false;
            }
            if ($access['access_updatetime'] - $access['access_createtime'] > 86400) {
                return false;
            }
            $Access->where([
                "access_id" => $access['access_id'],
            ])->update([
                'access_updatetime' => time()
            ]);
            $this->where("user_id", $access['access_user'])->update([
                'user_updatetime' => time()
            ]);
            $user = $this->where("user_id", $access['access_user'])->find();
            return $user->toArray() ?? false;
        } else {
            return false;
        }
    }
}
