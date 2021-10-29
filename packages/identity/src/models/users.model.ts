import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  IsEmail,
  Model,
  NotEmpty,
  Table,
  Unique,
  ValidationFailed,
} from 'sequelize-typescript';
import { Optional } from 'sequelize/types';

import { HttpException } from '@nws/core';

import { Group } from './groups.model';

export enum UserAccountState {
  UNCONFIRMED = 'UNCONFIRMED',
  CONFIRMED = 'CONFIRMED',
  DISABLED = 'DISABLED',
}

export interface UserAttributes {
  id: string;
  username: string;
  displayName: string;
  email: string;
  password: string;
  accountState: UserAccountState;
  groups: Group[];
}

export type UserCreationAttributes = Optional<
  Pick<UserAttributes, 'username' | 'email' | 'password' | 'displayName'>,
  'displayName'
>;

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Table({
  timestamps: true,
  tableName: 'users',
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(),
  })
  public username: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public displayName: string;

  @Unique
  @IsEmail
  @Column({
    type: DataType.STRING(),
  })
  public email?: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public password: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
    defaultValue: UserAccountState.UNCONFIRMED,
  })
  public accountState: UserAccountState;

  @BelongsToMany(() => Group, 'users_groups', 'userId', 'groupId')
  groups: Group[];

  @ValidationFailed
  static afterValidateHook(instance: any, options: any, error: any) {
    throw new HttpException(400, error.message);
  }
}
