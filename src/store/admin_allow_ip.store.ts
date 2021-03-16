import _ from 'lodash';
import BaseStore from './base.store';
import { adminAllowIpRepository } from '@models/index';

class AdminAllowIpStore extends BaseStore {

  public findAndCountAll(options: any) {
    return adminAllowIpRepository.findAndCountAll(options);
  }

  public findById(id: number) {
    return adminAllowIpRepository.findByPk(id);
  }

  public remove(id: number) {
    return adminAllowIpRepository.destroy({
      where: { id }
    });
  }

  public create(uid: number, ip: string) {
    return adminAllowIpRepository.create({
      uid, ip
    });
  }
}

export const adminAllowIpStore = new AdminAllowIpStore();
