import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

export interface GroupAttributes {
  id: string;
  name: string;
}

export type GroupCreationAttributes = Optional<GroupAttributes, 'id'>;

@Table({
  timestamps: true,
  tableName: 'groups',
})
export class Group extends Model<GroupAttributes, GroupCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public name: string;
}
