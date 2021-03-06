import { IObj } from '../app/extend/helper'

declare module 'egg' {
  interface Application {
    redis: any,
    /**
     * 数据库连接对象
     */
    connection: any,
    /**
     * 生成二维码
     * @param code - 二维码内容
     * @param options - options in `qrcode` module
     * @see https://www.npmjs.com/package/qrcode#options
     */
    generateQRCode(code: string, options?: Object): Promise<string>
  }

  interface IHelper {
    /**
     * @method Helper#toCamelObj - 将对象或者数组内对象的key转为小驼峰命名
     * @param obj - 要进行转换的对象或者数组
     */
    toCamelObj(obj: IObj): Object | Object[],

    /**
     * @method Helper#toSnakeObj - 将对象或者数组内对象的key转为下划线分割命名
     * @param obj - 要进行转换的对象或者数组
     */
    toSnakeObj(obj: IObj): Object | Object[],

    /**
     * 日期补全时间
     * @param dateRange - 一个包含起止日期的数组
     * @example
     * ['2018-06-05', '2018-06-08']
     * =>
     * ['2018-06-05 00:00:00', '2018-06-08 23:59:59']
     */
    transformDateRange(dateRange: string[]): string[],

    /**
     * 进行sha1加密
     * @param str - 要加密的串
     */
    encryptSha1(str: string): string,

    /**
     * @method Helper#prefixZero - 对指定数值进行前置补 '0'
     * @param num - 要进行处理的原始数字
     * @param len - 转换后的总长度
     * @example
     * ```js
     * ctx.helper.prefixZero(1, 4)
     * => '0001'
     * ```
     */
    prefixZero(num: number | string, len: number): string,

    /**
     * @method Helper#uuid - 生成随机ID
     * @param len - 生成长度
     * @param radix - 基于几进制生成
     */
    uuid(len: number, radix: number): string
  }

  function startCluster(options: any)
}
