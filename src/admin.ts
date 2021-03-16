import { process_init } from './common/utils/process_init';
process_init();

import os from 'os';
import Koa from 'koa';
import http from 'http';

import { logger } from '@common/utils';
import mysql from '@common/dbs/mysql';
import { handleRouter } from './helpers/http';
import adminRoutes from '@routes/admin.routes';
import { logger as reqLogger, cors, body, realIp, session } from '@middlewares/index';
import { ADMIN_PORT } from '@config/env';

const app = new Koa();

app.keys = ['40a7522c-c862-48c7-a39c-723f631b2e8b'];

app.use(reqLogger({ server: 'admin' }));

app.use(realIp());

app.use(body());

app.use(cors());

app.use(session(app, { prefix: 'admin_' }));

app.use(handleRouter([...adminRoutes ], 'admin').routes());

mysql
  .authenticate()
  .then(() => {
    const server = http.createServer(app.callback());
    server.keepAliveTimeout = 120 * 1000;
    server.headersTimeout = 125 * 1000;
    server.listen(ADMIN_PORT, 65535, () => {
      logger.info(`admin server start, hostname: ${os.hostname()}, port: ${ADMIN_PORT}`);
    });
  })
  .catch(e => {
    logger.error(JSON.stringify(e));
  });
