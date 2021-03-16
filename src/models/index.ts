import mysql from '@common/dbs/mysql';

import { AdminAllowIpModel } from './admin_allow_ip.model';
import { AdminLogModel } from './admin_log.model';
import { AdminSessionModel } from './admin_session.model';
import { AdminModel } from './admin.model';
import { ConfigModel } from './config.model';

export const adminAllowIpRepository = mysql.getRepository(AdminAllowIpModel);
export const adminLogRepository = mysql.getRepository(AdminLogModel);
export const adminSessionRepository = mysql.getRepository(AdminSessionModel);
export const adminRepository = mysql.getRepository(AdminModel);
export const configRepository = mysql.getRepository(ConfigModel);