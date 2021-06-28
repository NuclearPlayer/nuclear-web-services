import { AllowNull, BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { User } from './users.model';

export interface GroupAttributes {
  id: string;
  name: string;
  users: User[];
}

export type GroupCreationAttributes = Optional<GroupAttributes, 'id' | 'users'>;

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

  @BelongsToMany(() => User, 'users_groups', 'groupId', 'userId')
  users: User[];
}
