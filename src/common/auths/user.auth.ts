import { Next, Middleware } from 'koa';
import * as _ from 'lodash';
import { Code } from '../enums';

interface Opts {}

export function userAuth(opts?: Opts): Middleware {
  return async (ctx: any, next: Next) => {
    if (!ctx.session || !ctx.session.user) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: { code: Code.UNAUTHORIZATION, message: 'unauthorization' },
      };
      return;
    }

    if (!ctx.session.user.enabled) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: { code: Code.UNAUTHORIZATION, message: '账号已被禁止使用' },
      };
      return;
    }

    ctx.user = ctx.session.user;
    ctx.uid = ctx.user.id;
    await next();
  };
}
