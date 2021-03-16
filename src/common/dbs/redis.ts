import redis from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '@config/env';

const redisClient = redis.createClient({
   host: REDIS_HOST,
   port: REDIS_PORT,
   password: REDIS_PASSWORD
});

export default redisClient;