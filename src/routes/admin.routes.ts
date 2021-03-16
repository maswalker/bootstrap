import Joi from 'joi';
import { Route } from '@common/interfaces';
import { RequestMethod } from '@common/enums';
import fieldReg from '@common/field_reg';
import { admin } from '@controller/admin';
import { adminAuth } from '@common/auths';

const prefix = '/admin';

const routes: Route[] = [
  {
    name: 'login',
    path: '/login',
    method: RequestMethod.POST,
    params: Joi.object({
      name: Joi
        .string()
        .trim()
        .required(),
      password: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
        .error(new Error(fieldReg.password.message()))
    }),
    action: admin.authController.login
  },
  {
    name: 'logout',
    path: '/logout',
    method: RequestMethod.POST,
    middlewares: [ adminAuth() ],
    action: admin.authController.logout
  },
  {
    name: 'list admin',
    path: '/admin',
    method: RequestMethod.GET,
    middlewares: [ adminAuth() ],
    params: Joi.object({
      name: Joi
        .string()
        .trim(),
      page: Joi
        .number()
        .integer()
        .default(0),
      pageSize: Joi
        .number()
        .integer()
        .default(10)
    }),
    action: admin.adminController.listAdmin
  },
  {
    name: 'add admin',
    path: '/admin',
    method: RequestMethod.POST,
    middlewares: [ adminAuth() ],
    params: Joi.object({
      name: Joi
        .string()
        .trim()
        .required(),
      password: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg())
        .required()
    }),
    action: admin.adminController.addAdmin
  },
  {
    name: 'remove admin',
    path: '/admin/:id',
    method: RequestMethod.DEL,
    middlewares: [ adminAuth() ],
    action: admin.adminController.removeAdmin
  },
  {
    name: 'update admin',
    path: '/admin',
    method: RequestMethod.PUT,
    middlewares: [ adminAuth() ],
    params: Joi.object({
      id: Joi
        .number()
        .integer()
        .required(),
      password: Joi
        .string()
        .trim()
        .pattern(fieldReg.password.reg()),
      locked: Joi
        .bool()
    }),
    action: admin.adminController.updateAdmin
  },
  {
    name: 'list admin ip',
    path: '/ip',
    method: RequestMethod.GET,
    middlewares: [ adminAuth() ],
    params: Joi.object({
      admin_id: Joi
        .number()
        .integer(),
      page: Joi
        .number()
        .integer()
        .default(0),
      pageSize: Joi
        .number()
        .integer()
        .default(10)
    }),
    action: admin.adminController.listAdminIp
  },
  {
    name: 'add admin ip',
    path: '/ip',
    method: RequestMethod.POST,
    middlewares: [ adminAuth() ],
    params: Joi.object({
      admin_id: Joi
        .number()
        .integer(),
      ip: Joi
        .string()
        .trim()
    }),
    action: admin.adminController.addAdminIp
  },
  {
    name: 'remove admin ip',
    path: '/ip/:id',
    method: RequestMethod.DEL,
    middlewares: [ adminAuth() ],
    action: admin.adminController.delAdminIp
  }
];

export default routes.map((item) => ({ ...item, path: `${prefix}${item.path}` }));
