import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';

import { HttpException } from '@nws/core';

import { CreateUserDto } from '../dtos/users.dto';
import { UserService } from '../services/users.service';

export class UsersController {
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const data = await this.userService.findOneById(id);
      if (!data) {
        throw new HttpException(404, `User with id ${id} not found`);
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public postUser = async (req: Request, res: Response, next: NextFunction) => {
    const data: CreateUserDto = req.body;

    try {
      const newUser = await this.userService.create(data);
      res.status(201).json({ ...omit(newUser.toJSON(), 'password') });
    } catch (error) {
      next(error);
    }
  };

  public patchUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data: CreateUserDto = req.body;

    try {
      const existingUser = await this.userService.findOneById(id);
      if (!existingUser) {
        throw new HttpException(404, `User with id ${id} not found`);
      }

      const updatedUser = await this.userService.update(id, data);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };
}
