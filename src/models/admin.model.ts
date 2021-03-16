import { Table, Column, DataType, HasMany } from 'sequelize-typescript';

import BaseModel from './base';
import { AdminAllowIpModel } from './admin_allow_ip.model';
import { AdminSessionModel } from './admin_session.model';

@Table({
  tableName: 'admin',
  indexes: [
    { name: 'name', fields: ['name'], unique: true }
  ]
})
export class AdminModel extends BaseModel<AdminModel> {

  @Column({
    allowNull: false,
    type: DataType.STRING(64)
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128)
  })
  public password!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
    defaultValue: ''
  })
  public secret!: string;

  @Column({
    allowNull: false,
    type: DataType.TINYINT,
    defaultValue: 0
  })
  public retries!: number;

  @Column
  public last_login!: Date;

  @Column({
    type: DataType.STRING(32)
  })
  public login_ip!: string;

  @Column({
    allowNull: false,
    defaultValue: false
  })
  public locked!: boolean;

  @HasMany(() => AdminAllowIpModel, { constraints: false })
  public allowIps!: AdminAllowIpModel[];

  @HasMany(() => AdminSessionModel, { constraints: false })
  public session!: AdminSessionModel[];
}
