import _ from 'lodash';
import BaseService from './base.service';
import { UniqueConstraintError } from 'sequelize';
import { hashPassword } from '@common/utils';
import { Assert, Exception } from '@common/exceptions';
import { Code } from '@common/enums';
import { AdminModel } from '@models/admin.model';
import {
  adminStore,
  adminAllowIpStore
} from '@store/index';
import { CHECK_IP } from '@config/env';

class AdminService extends BaseService {

  public async updateSession(id: number, sid: string, sess: any) {
    await adminStore.updateSession(id, sid, sess);
  }

  public async getSession(sid: string) {
    return adminStore.getSession(sid);
  }

  public async destroySession(sid: string) {
    await adminStore.destorySession(sid);
  }

  public async login(params: any, ip: string) {
    const { name, password } = params;

    const u = await adminStore.findByUsername(name);
    if (!u) throw new Exception(Code.USERNAME_NOT_FOUND, '账户不存在');

    const allowIps = u.allowIps.map(v => v.ip);
    if (CHECK_IP && !allowIps.includes(ip))
      throw new Exception(Code.INVALID_IP, 'IP不允许被登录，请联系管理员.');

    const { locked, retries } = u;
    Assert(!locked, Code.USER_LOCKED, '账户已锁定，请联系管理员');

    const checked = adminStore.checkPassword(u, password);
    if (checked) {
      await adminStore.login(u.id, ip);
      return u.serializer({ exclude: ['password'] });
    } else {
      if (retries >= 4)
        await adminStore.lock(u.id);

      throw new Exception(Code.SERVER_ERROR, '密码错误');
    }
  }

  public async logout(admin_id: number, ip: string) {

  }

  public async listAdmin(params: any) {
    const { name, page, pageSize } = params;
    const where: any = {};
    if (!_.isNil(name)) _.assign(where, { name })

    const { rows, count } = await adminStore.findAndCountAll({
      where,
      limit: pageSize,
      offset: page * pageSize,
      order: [['id', 'DESC']]
    });

    return {
      list: rows.map(v => v.serializer({ exclude: ['password','secret'] })),
      total: count
    };
  }

  public async addAdmin(admin_id: number, params: any) {
    const { name, password } = params;
    const exist = await adminStore.findByUsername(name);
    Assert(!exist, Code.USER_EXIST, '用户已存在');

    const admin = await adminStore.create({
      name,
      password: hashPassword(password)
    });

    return admin.serializer({ exclude: ['password'] });
  }

  public async removeAdmin(admin_id: number, params: any) {
    const { id } = params;
    const removed = await adminStore.destroy(id);
    Assert(removed, Code.SERVER_ERROR, 'remove admin failed');
  }

  public async updateAdmin(admin: AdminModel, params: any) {
    const admin_id = _.get(admin, 'id');
    const { id, password, locked } = params;
    const data: any = {};

    Assert(admin_id == id, Code.OPERATION_FORBIDDEN, '权限不够');

    if (!_.isNil(password)) _.assign(data, { password: hashPassword(password) });
    if (!_.isNil(locked)) _.assign(data, { locked });

    const ret = await adminStore.update(id, data);
    Assert(ret, Code.SERVER_ERROR, 'update admin failed');
  }

  public listAdminIp(params: any) {
    const { admin_id, page, pageSize } = params;
    const where: any = {};
    if (!_.isNil(admin_id)) _.assign(where, { uid: admin_id });

    return adminAllowIpStore.findAndCountAll({
      where,
      offset: page * pageSize,
      limit: pageSize,
      order: [['id', 'DESC']]
    });
  }

  public async addAdminIp(admin_id: number, params: any) {
    const { admin_id: uid, ip } = params;
    const data = await adminAllowIpStore.create(uid, ip);
    Assert(data != null, Code.SERVER_ERROR, '增加管理员IP失败');
  }

  public async delAdminIp(admin_id: number, params: any) {
    const { id } = params;
    const allowIp = await adminAllowIpStore.findById(id);
    if (!allowIp) throw new Exception(Code.BAD_PARAMS, '管理员IP记录不存在');

    const row = await adminAllowIpStore.remove(id);
    Assert(row == 1, Code.SERVER_ERROR, '删除管理员IP失败');
  }

}

export const adminService = new AdminService();
