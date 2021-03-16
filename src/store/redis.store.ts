import * as _ from 'lodash';
import { promisify } from 'util';
import BaseStore from './base.store';
import { redisClient } from '@common/dbs';
import { logger } from '@common/utils';

export enum RedisKeyType {
  STRING,
  HASH,
  LIST,
  SET,
  SORTED_SET
}

class RedisStore extends BaseStore {

  public async exists(key: string) {
    return new Promise((resolve, rejects) => {
      redisClient.exists(key, (err, reply) => {
        if (err)
          rejects(err);
        else
          resolve(reply);
      });
    });
  }

  public async set(key: string, value: string) {
    return promisify(redisClient.set).bind(redisClient)(key, value);
  }

  public async setex(key: string, value: string, seconds: number) {
    return promisify(redisClient.setex).bind(redisClient)(key, seconds, value);
  }

  public async get(key: string) {
    return promisify(redisClient.get).bind(redisClient)(key);
  }

  public async del(key: string) {
    return new Promise((resolve, rejects) => {
      redisClient.del(key, (err, reply) => {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async incr(key: string) {
    return promisify(redisClient.incr).bind(redisClient)(key);
  }

  public async incrby(key: string, increment: number) {
    return promisify(redisClient.incrby).bind(redisClient)(key, increment);
  }

  public async hset(key: string, field: string, value: string) {
    return new Promise((resolve, reject) => {
      redisClient.hset(key, field, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async hget(key: string, field: string) {
    return promisify(redisClient.hget).bind(redisClient)(key, field);
  }

  public async hgetall(key: string) {
    return promisify(redisClient.hgetall).bind(redisClient)(key);
  }

  public async hincrby(key: string, field: string, increment: number) {
    return promisify(redisClient.hincrby).bind(redisClient)(key, field, increment);
  }

  public async zadd(key: string, ...args: Array<string | number>) {
    return new Promise((resolve, rejects) => {
      redisClient.zadd(key, ...args, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async pexpire(key: string, milliseconds: number) {
    return promisify(redisClient.pexpire).bind(redisClient)(key, milliseconds);
  }

  public async expire(key: string, seconds: number) {
    return promisify(redisClient.expire).bind(redisClient)(key, seconds);
  }

  public async zrangebyscore(key: string, min: number | string, max: number | string) {
    return await promisify(redisClient.zrangebyscore).bind(redisClient)(key, min, max) as string[];
  }

  public async zremrangebyscore(key: string, min: number, max: number) {
    return promisify(redisClient.zremrangebyscore).bind(redisClient)(key, min, max);
  }

  public async zrevrange(key: string, start: number, stop: number) {
    return new Promise<string[]>((resolve, rejects) => {
      redisClient.zrevrange(key, start, stop, (err, reply) => {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async zrem(key: string, members: string[]) {
    return new Promise((resolve, rejects) => {
      redisClient.zrem(key, members, (err, reply) => {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async hmget(key: string, args: string[]) {
    return new Promise<string[]>((resolve, rejects) => {
      redisClient.hmget(key, args, (err, reply) => {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async hmset(key: string, args: { [key: string]: string | number }) {
    return new Promise((resolve, rejects) => {
      redisClient.hmset(key, args, (err, reply) => {
        if (err)
          rejects(err);
        else
          resolve(reply);
      });
    });
  }

  public async hmdel(key: string, args: string[]) {
    return new Promise((resolve, rejects) => {
      redisClient.hdel(key, args, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async exist(key: string) {
    return new Promise((resolve, rejects) => {
      redisClient.exists(key, function(err, reply) {
        if (err) {
          rejects(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  public async zscore(key: string, member: string) {
    return promisify(redisClient.zscore).bind(redisClient)(key, member);
  }

  public async remembers(key: string, getCB: Function, expire?: number) {
    const ex = _.defaultTo(expire, 0);
    let ret = await this.get(key);
    if (_.isEmpty(ret)) {
      const data = await getCB();
      if (!_.isNil(data)) {
        const t = typeof(data);
        ret = (t == 'object') ? JSON.stringify(data) : '' + data;
        if (ex > 0)
          await this.setex(key, ret, ex);
        else
          await this.set(key, ret);
      }
    }

    return ret;
  }

  public async remember(key: string, getCB: Function, expire?: number) {
    const ret = await this.remembers(key, getCB, expire);
    if (_.isNil(ret) || _.isEmpty(ret))
      return null;

    try {
      return JSON.parse(ret);
    } catch (e) {
      logger.error(`JSON parse failed, key=${key}`);
      return null;
    }
  }

  public async scard(key: string) {
    return promisify(redisClient.scard).bind(redisClient)(key);
  }

  public async sismember(key: string, member: string) {
    return promisify(redisClient.sismember).bind(redisClient)(key, member);
  }
  public async smembers(key: string) {
    return promisify(redisClient.smembers).bind(redisClient)(key);
  }
  public async sadd(key: string, members: string[]) {
    return new Promise((resolve, rejects) => {
      redisClient.sadd(key, members, (err, reply) => {
        if (err)
          rejects(err);
        else
          resolve(reply);
      });
    });
  }

  public async srem(key: string, members: string[]) {
    return new Promise((resolve, rejects) => {
      redisClient.srem(key, members, (err, reply) => {
        if (err)
          rejects(err);
        else
          resolve(reply);
      });
    });
  }

  public async spop(key: string) {
    return new Promise((resolve, rejects) => {
      redisClient.spop(key, (err, reply) => {
        if (err)
          rejects(err);
        else
          resolve(reply);
      });
    });
  }

  public async srandmember(key: string, count: number) {
  return new Promise<string[]>((resolve, rejects) => {
      redisClient.srandmember(key, count, (err, reply) => {
        if (err)
          rejects(err);
        else
          resolve(reply);
      });
    });
  }

  public zincrby(key: string, increment: number, member: string) {
    return promisify(redisClient.zincrby).bind(redisClient)(key, increment, member);
  }
}

export const redisStore = new RedisStore();