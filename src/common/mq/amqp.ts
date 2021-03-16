
import { connect, Channel, ConsumeMessage, credentials } from 'amqplib';
import * as _ from 'lodash';
import { logger, hmacSha1 } from '@common/utils';
import { AMQP_HOST, AMQP_VHOST, AMQP_USER, AMQP_PASSWD, AMQP_PORT } from '@config/env';

const hostname = AMQP_HOST;
const vhost = AMQP_VHOST;
const username = AMQP_USER;
const password = AMQP_PASSWD;
const port = AMQP_PORT;

interface Task {
  action: string;
  time?: Date;
  data?: any;
}

function connectMQ() {
  const options = { hostname, vhost, port, username, password };
  return connect(options);
}

async function pushTask(queue: string, task: Task) {
  let conn;

  if (_.isNil(task.time))
    task.time = new Date();

  try {
    conn = await connectMQ();
    const ch = await conn.createChannel();
    await ch.assertQueue(queue, { durable: true });
    
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(task)), { deliveryMode: true });

    await ch.close();
  } catch (e) {
    logger.error(`pushTask: ${e.toString()}`);
  } finally {
    conn?.close();
  }
}

async function popTask(queue: string, worker: (ch: Channel, msg: ConsumeMessage | null) => Promise<void>) {
  const conn = await connectMQ();

  const ch = await conn.createChannel();
  await ch.prefetch(1);
  await ch.assertQueue(queue, { durable: true });

  ch.consume(queue, async (msg) => await worker(ch, msg), { noAck: false });
}

export { pushTask, popTask, Task, Channel, ConsumeMessage };
