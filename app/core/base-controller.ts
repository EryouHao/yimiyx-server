import { Controller } from 'egg';
/**
 * 业务码说明
 * 50000 操作成功
 * 50001 操作失败
 * 50002 待定
 * 50003 待定
 * 50004 待定
 * 50005 待定
 */
export default class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data = {}, msg = '操作成功') {
    this.ctx.body = {
      code: 50000,
      data,
      msg
    };
    return data;
  }

  fail(data = {}, code = 50001, msg = '操作失败') {
    this.ctx.body = {
      code,
      data,
      msg
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}