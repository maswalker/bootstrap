import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AdminModel } from './admin.model';
import BaseModel from './base';

@Table({
  tableName: 'admin_session',
  indexes: [
    { name: 'admin_id', fields: ['admin_id'] }
  ]
})
export class AdminSessionModel extends BaseModel<AdminSessionModel> {

  @Column({
    type: DataType.STRING(64),
    primaryKey: true
  })
  public id!: string;

  @Column({
    type: DataType.JSON,
    defaultValue: {}
  })
  public sess!: JSON;

  @ForeignKey(() => AdminModel)
  @Column({
    allowNull: false
  })
  public admin_id!: number;

  @BelongsTo(() => AdminModel, { constraints: false })
  public admin!: AdminModel;

}
