import _ from 'lodash';
import BaseStore from './base.store';
import { configRepository } from '@models/index';
import { redisStore } from './redis.store';
import { PROJECT } from '@config/env';

const KEY = `${PROJECT}:config`;

class ConfigStore extends BaseStore {

  private async init() {
    const args: { [key: string]: string } = {};
    const cs = await configRepository.findAll();
    cs.forEach(v => args[v.name] = v.value);
    return redisStore.hmset(KEY, args);
  }

  public async get(name: string, defaultValue: any = null) {
    let ret = await redisStore.hget(KEY, name);
    if (_.isEmpty(ret)) {
      const exists = await redisStore.exists(KEY);
      if (!exists) {
        await this.init();
        ret = await redisStore.hget(KEY, name);
      }
    }

    return !_.isEmpty(ret) ? ret : defaultValue;
  }

  public async getNumber(name: string, defaultValue: number = 0) {
    const v = await this.get(name);
    return !_.isEmpty(v) ? _.toNumber(v) : defaultValue;
  }

  public all() {
    return redisStore.hgetall(KEY);
  }

  public async set(name: string, value: string) {
    const [ rows ] = await configRepository.update({
      value
    }, {
      where: { name }
    });

    return rows === 1;
  }

  public async flush() {
    await redisStore.del(KEY);
  }

  public getAll(){
    return configRepository.findAll()
  }

  public create(data: any){
    return configRepository.create(data)
  }

  public update(data: any, id: number){
    return configRepository.update(data, {where: {id}})
  }

}

export const configStore = new ConfigStore();
