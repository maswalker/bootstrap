import { Pagination } from '@common/interfaces';

class BaseStore {
  protected offsetAndLimit(pagination?: Pagination) {
    const { page = 1, pageSize = 20 } = pagination || {};
    const offset = (page - 1) * pageSize;
    return { offset, limit: pageSize };
  }
}

export default BaseStore;