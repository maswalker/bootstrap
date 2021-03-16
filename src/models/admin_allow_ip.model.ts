import { Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AdminModel } from './admin.model';
import BaseModel from './base';

@Table({
  tableName: 'admin_allow_ip',
  indexes: [
    { name: 'uid', fields: ['uid'] }
  ]
})
export class AdminAllowIpModel extends BaseModel<AdminAllowIpModel> {

  @ForeignKey(() => AdminModel)
  @Column({
    allowNull: false
  })
  public uid!: number;

  @BelongsTo(() => AdminModel, { constraints: false })
  public admin!: AdminModel;

  @Column({
    allowNull: false,
    type: DataType.STRING(32)
  })
  public ip!: string;

}
