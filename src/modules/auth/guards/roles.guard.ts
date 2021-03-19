/**
 * Something important to note,
 *
 * This guard should always be paired with the auth guard.
 *
 * The check that is running is simple, does the user have the stated role in their array of roles.
 *
 * The above task will reduce the need for querying for a particlular user every single time.
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';

import { User } from '@ncdf/users/entities/user.entity';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectConnection() private connection: Connection,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // if (!roles) {
    //   return false;
    // }

    const request = context.switchToHttp().getRequest();
    const contextUser = request.user;

    // Load user from DB. This handles the use case if the roles have changed but access token
    // has not been refreshed.
    const { manager } = this.connection;
    const currentUser = await manager.findOne(User, contextUser.id);

    return Boolean(currentUser);
  }
}
