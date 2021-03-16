import { process_init } from '../common/utils/process_init';
process_init();

import { sequelize } from '@common/dbs';
import { adminRepository } from '@models/index';
import { hashPassword } from '@common/utils';

async function work() {
  await sequelize.sync({ force: true });

  await adminRepository.create({
    name: 'admin',
    password: hashPassword('123456')
  });
}

work()
.then(() => {
  console.log('done.');
  process.exit(0);
})
.catch(e => {
  console.log(e);
});
