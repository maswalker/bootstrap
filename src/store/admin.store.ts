import * as _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import BaseStore from './base.store';
import {
  adminRepository,
  adminSessionRepository,
  adminAllowIpRepository
} from '@models/index';
import { AdminModel } from '@models/admin.model';
import { hashPassword } from '@common/utils';

class AdminStore extends BaseStore {

  public async updateSession(id: number, sid: string, sess: any) {
    await adminSessionRepository.upsert({ admin_id: id, id: sid, sess }, { fields: ['id', 'sess'] });
  }

  public async getSession(sid: string) {
    const session = await adminSessionRepository.findOne({
      where: { id: sid },
      include: [{ model: adminRepository, include: [{ model: adminAllowIpRepository }] }],
    });
    return (
      session && {
        sess: session.sess,
        user: {
          ...session.admin.serializer(),
          allowIps: session.admin.allowIps.map(v => v.ip)
        },
      }
    );
  }

  public async destorySession(sid: string) {
    await adminSessionRepository.destroy({ where: { id: sid } });
  }

  public findById(id: number) {
    return adminRepository.findByPk(id);
  }

  public findByUsername(name: string) {
    return adminRepository.findOne({ where: { name }, include: ['allowIps'] });
  }

  public checkPassword(u: AdminModel, password: string) {
    return u.password === hashPassword(password);
  }

  public async login(id: number, ip: string) {
    await adminRepository.update({
      retries: 0,
      last_login: new Date(),
      login_ip: ip
    }, { where: { id } });
  }

  public async lock(uid: string) {
    await adminRepository.update({
      locked: 1
    }, { where: { id: uid } });
  }

  public findAndCountAll(options: any) {
    return adminRepository.findAndCountAll(options);
  }

  public create(data: any, transaction?: Transaction) {
    return adminRepository.create(data, { transaction });
  }

  public async destroy(id: number) {
    const rows = await adminRepository.destroy({ where: { id } });
    return rows === 1;
  }

  public async update(id: number, data: any) {
    const [ rows ] = await adminRepository.update(data, { where: { id } });
    return rows === 1;
  }

}

export const adminStore = new AdminStore();
