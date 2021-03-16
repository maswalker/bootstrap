import * as Sequelize from 'sequelize';

import { Exception } from '../exceptions';
import { Code } from '../enums';
import fieldReg from '../field_reg';

const antAccount: Sequelize.ModelValidateOptions = {
  isValid(value: string) {
    if (!value || !value.match(fieldReg.username.reg())) {
      throw new Exception(Code.BAD_PARAMS, fieldReg.username.message());
    }
  },
};

const antPassword: Sequelize.ModelValidateOptions = {
  isValid(value: string) {
    if (!value || !value.match(fieldReg.password.reg())) {
      throw new Exception(Code.BAD_PARAMS, fieldReg.password.message());
    }
  },
};

const phone: Sequelize.ModelValidateOptions = {
  isValid(value: string) {
    if (!value || !value.match(fieldReg.phone.reg())) {
      throw new Exception(Code.BAD_PARAMS, fieldReg.phone.message());
    }
  },
};

const ip: Sequelize.ModelValidateOptions = {
  isValid(value: string) {
    if (!value || !value.match(fieldReg.ip.reg())) {
      throw new Exception(Code.BAD_PARAMS, fieldReg.ip.message());
    }
  },
};

const adminUsername: Sequelize.ModelValidateOptions = {
  isValid(value: string) {
    if (!value || !value.match(fieldReg.username.reg())) {
      throw new Exception(Code.BAD_PARAMS, fieldReg.username.message());
    }
  },
};

const adminPassword: Sequelize.ModelValidateOptions = {
  isValid(value: string) {
    if (!value || !value.match(fieldReg.password.reg())) {
      throw new Exception(Code.BAD_PARAMS, fieldReg.password.message());
    }
  },
};

export default {
  antAccount,
  antPassword,
  phone,
  ip,
  adminUsername,
  adminPassword,
};
