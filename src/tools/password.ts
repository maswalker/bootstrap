import { process_init } from '../common/utils/process_init';
process_init();

import { hashPassword } from "@common/utils";

const passwd = hashPassword(process.argv[2]);
console.log(passwd);
