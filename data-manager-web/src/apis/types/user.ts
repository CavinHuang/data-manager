/**
 * 登录相关的api接口管理
 */

export type TRegisterParams = {
  phone: string
  password: string
  password_confirm: string
  unit: string
  true_name?:string
}

export type TUserInfo = {
  user_account: string;
  user_createtime: number;
  user_email: string;
  user_group: number;
  user_id: number;
  user_idcard: string;
  user_ipreg: string;
  user_money: string;
  user_name: string;
  user_password: string;
  user_qq: number;
  user_salt: string;
  user_status: number;
  user_truename: string;
  user_unit: string;
  user_updatetime: number;
  user_wechat: number;
  user_wxapp: number;
}

export type TLoginRes = {
  access_token: string
  user: TUserInfo
}
