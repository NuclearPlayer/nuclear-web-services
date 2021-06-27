import bcrypt from 'bcrypt';

import { HttpException } from '@nws/core';
import { CrudService } from '@nws/core/src/types';

import { CreateUserDto } from '../dtos/users.dto';
import { Group } from '../models/groups.model';
import { User } from '../models/users.model';

export class UserService implements CrudService<User, CreateUserDto> {
  public users = User;
  public groups = Group;

  public findAll() {
    return this.users.findAll();
  }

  public findOneById(id: string) {
    return this.users.findByPk(id);
  }

  public findOneByUsername(username: string) {
    return this.users.findOne({ where: { username }, attributes: { include: ['password'] } });
  }

  public async findUserGroups(id: string) {
    return (await this.users.findByPk(id, { include: [Group] }))?.groups;
  }

  public async create(data: CreateUserDto) {
    const exists = (await this.users.count({ where: { email: data.email } })) > 0;
    if (exists) throw new HttpException(400, `${data.email} already exists`);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.users.create({
      ...data,
      displayName: data.username,
      password: hashedPassword,
    });
  }

  public async update(id: string, data: CreateUserDto) {
    if ('password' in data) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await this.users.update(data, { where: { id } });
    return this.findOneById(id);
  }

  public async addToGroup(id: string, groupName: string) {
    const group = await this.groups.findOne({ where: { name: groupName } });
    if (!group) {
      throw new HttpException(404, `${groupName} group does not exist`);
    }
    const user = await this.users.findByPk(id, { include: [Group] });

    if (!user) {
      throw new HttpException(404, `User with id ${id} does not exist`);
    }

    // @ts-ignore
    await user.addGroup(group);

    return user.save();
  }
}
