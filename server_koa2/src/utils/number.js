// utils/number.js
'use strict';

/**
 * 数字工具类
 */
class NumberUtil {
  /**
   * 将数字转换为中文大写金额
   * @param {Number} number - 需要转换的数字
   * @returns {String} - 中文大写金额
   */
  static convertToChinese(number) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ];
    const head = number < 0 ? '欠' : '';
    number = Math.abs(number);

    let s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(number * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    number = Math.floor(number);

    for (let i = 0; i < unit[0].length && number > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && number > 0; j++) {
        p = digit[number % 10] + unit[1][j] + p;
        number = Math.floor(number / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
  }

  /**
   * 格式化金额（保留2位小数）
   * @param {Number} number - 需要格式化的数字
   * @returns {Number} - 格式化后的数字
   */
  static formatAmount(number) {
    return Number(number.toFixed(2));
  }
}

module.exports = NumberUtil;