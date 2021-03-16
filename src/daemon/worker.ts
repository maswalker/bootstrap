import { process_init } from '../common/utils/process_init';
process_init();

import _ from 'lodash';
import { logger } from '@common/utils';
import { popTask, Channel, ConsumeMessage } from '@common/mq';
import { WORKER_QUEUE } from '@config/env';

const WORKERS: { [key: string]: (data: any) => Promise<void> } = {

};

async function worker(ch: Channel, msg: ConsumeMessage | null) {
  if (!msg)
    return;

  try {
    const { action, data } = JSON.parse(msg.content.toString());
    const fn = _.get(WORKERS, action);

    if (!_.isNil(fn)) {
      try {
        await fn(data);
      } catch (e) {
        logger.error(`worker error: ${e.toString()} ${msg.content}`);
      }
    } else {
     logger.error('undefined action: ' + action);
    }

    await ch.ack(msg);
  } catch (e) {
    logger.error(`worker error2: ${e.toString()} ${msg.content}`);
  }
}

async function run() {
  await popTask(WORKER_QUEUE, worker);
}

if (require.main === module) {
  run()
  .then(() => logger.info('work queue run'))
  .catch(e => {
    logger.error(`worker: ${e.toString()}`);
  });
}
