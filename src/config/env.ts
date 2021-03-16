import _ from 'lodash';

const { env } = process;

const get = (name: string, _default: string = '') => {
  return _.get(env, name, _default);
}

const getNumber = (name: string, _default: number = 0) => {
  const n = get(name);
  const num = (!_.isNil(n) && !_.isEmpty(n)) ? _.toNumber(n) : undefined;
  return _.defaultTo(num, _default);
}

export const NODE_ENV = env.NODE_ENV;

export const PROJECT = get('PROJECT', 'xxx');

export const DB_HOST = get('MYSQL_HOST', '127.0.0.1');
export const DB_PORT = getNumber('MYSQL_PORT', 3306);
export const DB_USERNAME = get('MYSQL_USERNAME', 'root');
export const DB_PASSWORD = get('MYSQL_PASSWORD', '123456');
export const DB_NAME = get('MYSQL_DATABASE', `${PROJECT}`);
export const REDIS_HOST = get('REDIS_HOST', '127.0.0.1');
export const REDIS_PORT = getNumber('REDIS_PORT', 6379);
export const REDIS_PASSWORD = get('REDIS_PASSWORD', '123456');
export const AMQP_HOST = get('AMQP_HOST', '127.0.0.1');
export const AMQP_VHOST = get('AMQP_VHOST', '/');
export const AMQP_USER = get('AMQP_USER', 'guest');
export const AMQP_PASSWD = get('AMQP_PASSWD', 'guest');
export const AMQP_PORT = getNumber('AMQP_PORT', 5672);

export const SYSLOG_HOST = get('SYSLOGD_HOST');
export const SYSLOG_PORT = getNumber('SYSLOGD_PORT', 514);
export const SYSLOG_PROTOCOL = get('SYSLOGD_PROTOCOL', 'U');
export const SYSLOG_TAG = get('SYSLOGD_TAG', `${PROJECT}`);

export const API_PORT = getNumber('API_PORT', 9000);
export const ADMIN_PORT = getNumber('ADMIN_PORT', 9001);

export const WORKER_QUEUE = get('WORKER_QUEUE', `${PROJECT}q`);
export const LOG_LEVEL = get('LOG_LEVEL', 'error');
export const CHECK_CAPTCHA = getNumber('CHECK_CAPTCHA', 1) > 0;
export const DB_LOG = getNumber('DB_LOG', 0) > 0;
export const CHECK_IP = getNumber('CHECK_IP', 1) > 0;
