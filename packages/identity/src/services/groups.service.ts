import { HttpException } from '@nws/core';
import { CrudService } from '@nws/core/src/types';

import { CreateGroupDto } from '../dtos/groups.dto';
import { Group } from '../models/groups.model';

export class GroupService implements CrudService<Group, CreateGroupDto> {
  public groups = Group;
  findAll(): Promise<Group[]> {
    return this.groups.findAll();
  }

  public findOneById(id: string): Promise<Group | null> {
    return this.groups.findByPk(id);
  }

  public async create(data: CreateGroupDto): Promise<Group> {
    const exists = (await this.groups.count({ where: { name: data.name } })) > 0;
    if (exists) {
      throw new HttpException(400, `Group "${data.name}" already exists`);
    }
    return this.groups.create(data);
  }
}
