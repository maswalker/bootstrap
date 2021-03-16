import { get } from 'lodash';
import { Next, Middleware } from 'koa';
import { Code } from '@common/enums';
import { CHECK_IP } from '@config/env';

interface Opts {

}

export function adminAuth(opts?: Opts): Middleware {
  // @types/koa-session, 导致type不兼容，暂时定义ctx为any
  return async (ctx: any, next: Next) => {
    const admin = get(ctx, 'session.admin');
    if (!admin) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        error: { code: Code.UNAUTHORIZATION, message: '账号未登录' },
      };
      return;
    }

    if (CHECK_IP && !admin.allowIps.includes(ctx.realIp)) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        error: { code: Code.UNAUTHORIZATION, message: 'IP未授权' },
      };
      return;
    }

    ctx.admin = ctx.user = admin;
    ctx.uid = ctx.user.id;
    await next();
  };
}
