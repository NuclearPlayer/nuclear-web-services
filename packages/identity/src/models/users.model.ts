import { HttpException } from '@nws/core';
import {
  AllowNull,
  Column,
  DataType,
  DefaultScope,
  IsEmail,
  Model,
  Table,
  ValidationFailed,
} from 'sequelize-typescript';

export interface UserAttributes {
  id: string;
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export type UserCreationAttributes = Pick<UserAttributes, 'username' | 'email' | 'password' | 'displayName'>;

@DefaultScope(() => ({
  attributes: { exclude: ['password'] }, // auto exclude password from requests
}))
@Table({
  timestamps: true, // add createdAt and updatedAt
  tableName: 'users', // table name in db
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
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
  public username: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public displayName: string;

  @IsEmail
  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(),
  })
  public password: string;

  @ValidationFailed
  static afterValidateHook(instance: any, options: any, error: any) {
    throw new HttpException(400, error.message);
  }
}
