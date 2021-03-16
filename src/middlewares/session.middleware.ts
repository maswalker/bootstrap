import koaSession from 'koa-session';
import Koa from 'koa';

import { adminService } from '@service/index';

const domain = process.env.DOMAIN || undefined;

interface Opts extends Partial<koaSession.opts> {
  prefix: 'api_' | 'admin_' | 'agent_';
}

export function session(app: Koa, opts: Opts) {
  return koaSession(
    {
      key: process.env.SESSION_KEY || 'apisession',
      maxAge: 86400000 * 3,
      overwrite: true,
      httpOnly: true,
      signed: true,
      rolling: false,
      renew: true,
      store: new Store(opts.prefix),
      secure: false,
      domain,
      ...opts,
    },
    app,
  );
}

class Store {
  constructor(private prefix: string) {}

  public getService(key: string) {
    if (this.prefix === 'admin_') {
      return { service: adminService, name: 'admin' };
    } else {
      throw new Error(`key is invalid, get key: ${key}`);
    }
  }

  public async get(key: string) {
    const { service, name } = this.getService(key);
    const sess = await service.getSession(key);
    if (!sess) {
      return undefined;
    }

    return { ...sess.sess, [name]: sess.user };
  }

  public async set(key: string, sess: any) {
    const { service, name } = this.getService(key);
    await service.updateSession(sess[name].id, key, sess);
  }

  public async destroy(key: string) {
    const { service } = this.getService(key);
    await service.destroySession(key);
  }
}
