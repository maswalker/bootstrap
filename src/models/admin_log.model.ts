import { Table, Column, DataType } from 'sequelize-typescript';
import BaseModel from './base';

@Table({
  tableName: 'admin_log',
  indexes: [
    { name: 'admin_id', fields: ['admin_id'] }
  ]
})
export class AdminLogModel extends BaseModel<AdminLogModel> {

  @Column({
    allowNull: false
  })
  public admin_id!: number;

  @Column({
    allowNull: false,
    type: DataType.TINYINT
  })
  public type!: number;

  @Column({
    allowNull: false
  })
  public target_id!: number;

  @Column({
    allowNull: false,
    type: DataType.JSON,
    defaultValue: {}
  })
  public params!: JSON;

}
