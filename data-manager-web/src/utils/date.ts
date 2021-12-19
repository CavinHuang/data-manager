/*
 * @Author: your name
 * @Date: 2021-09-13 21:40:50
 * @LastEditTime: 2021-09-13 21:50:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-manager-web\src\utils\date.ts
 */
type TDateOption = {
  short?: boolean
  chainese?: boolean
}

/**
 * 模仿PHP的date()函数
 * strtotime('Y-m-d H:i:s');
 * @param format 只支持 'Y-m-d H:i:s','Y-m-d','H:i:s' 三种调用方式
 *        实现 Y m d H i s
 * @param time 为空时，取当前时间
 * @return 日期格式化的字符串
 */
export function date(format: string, time: number, option?: TDateOption) {
  var _temp = (time != null) ? new Date(time * 1000) : new Date();
  // var _return = '';
  const defaultOptions: TDateOption = {
    short: false,
    chainese: true
  }

  option = Object.assign(defaultOptions, option)

  var Year = _temp.getFullYear().toString();
  var Month = _temp.getMonth();
  var Day = _temp.getDate();
  var Hour = _temp.getHours();
  var Minte = _temp.getMinutes();
  var Sencond = _temp.getSeconds();
  var Week = _temp.getDay();


  format = format.replace('Y', Year);
  format = format.replace('m', addZero(Month));
  format = format.replace('M', monthNote(Month, option.short!));
  format = format.replace('d', addZero(Day));
  format = format.replace('H', addZero(Hour));
  format = format.replace('i', addZero(Minte));
  format = format.replace('s', addZero(Sencond));
  format = format.replace('w', String(Week + 1));
  format = format.replace('W', weekNote(Week, option.short!, option.chainese!));

  return format;
}

function addZero(n: number): string {
  return n >= 10 ? String(n) : '0' + n
}

/**
 * 返回中文星期
 * @param  {[type]} w [description]
 * @return {[type]}   [description]
 */
function weekNote(w: number, short: boolean, chainese: boolean){
  var chaineseWeek = ['日', '一', '二', '三', '四', '五', '六'];
  var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  var DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if(short) return DAY_SHORT_NAMES[w];
  else if(chainese) return chaineseWeek[w];
  else return DAY_NAMES[w];
}

/**
 * 返回英文全称或者简写月份
 * @param  {[type]} m     [description]
 * @param  {[type]} short [description]
 * @return {[type]}       [description]
 */
function monthNote(m: number, short: boolean){
  var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  var MONTH_SHORT_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if(short) return MONTH_SHORT_NAMES[m];
  else return MONTH_NAMES[m];
}
