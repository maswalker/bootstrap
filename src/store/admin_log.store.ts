import _ from 'lodash';
import BaseStore from './base.store';
import { adminLogRepository } from '@models/index';

class AdminLogStore extends BaseStore {

  public add(admin_id: number, type: number, target_id: number, params: any) {
    return adminLogRepository.create({
      admin_id,
      type,
      target_id,
      params
    });
  }

  public bulkCreate(data: any[]) {
    return adminLogRepository.bulkCreate(data);
  }

  public findAndCountAll(options: any) {
    const { admin_id, type, page, pageSize } = options;
    const where: any = {};
    if (!_.isNil(admin_id)) _.assign(where, { admin_id });
    if (!_.isNil(type)) _.assign(where, { type });

    return adminLogRepository.findAndCountAll({
      where,
      offset: page * pageSize,
      limit: pageSize,
      order: [['id','DESC']]
    });
  }

}

export const adminLogStore = new AdminLogStore();
