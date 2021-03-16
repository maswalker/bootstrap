import { process_init } from '../common/utils/process_init';
process_init();

import _ from 'lodash';
import cron from 'node-cron';
import { logger } from '@common/utils';

const timezone = 'Asia/Shanghai';
const { env } = process;

interface CRON {
  schedule: string;
  callback: () => Promise<void>;
}

const CRONS: CRON[] = [

];

function run() {
  CRONS.forEach(c => {
    const v = _.get(env, c.schedule);
    if (!_.isNil(v) && !_.isEmpty(v)) {
      const task = cron.schedule(v, async () => {
        try {
          await c.callback();
        } catch (e) {
          logger.error(e.toString());
        }
      }, { timezone });
      task.start();
      console.log(`startd ${c.schedule}: ${v}`);
    }
  });
}

if (require.main === module) {
  try {
    run();
    logger.info('cron run');
  } catch(e) {
    logger.error(`cron: ${e.toString()}`);
  }
}
