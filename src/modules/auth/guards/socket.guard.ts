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
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from '@ncdf/users/entities/user.entity';

@Injectable()
export default class WsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectConnection() private connection: Connection,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: any = context.switchToWs().getClient<Socket>();
      let authToken: string = client.handshake?.query?.Authorization.split(' ');
      authToken = authToken[0] === 'Bearer' ? authToken[1] : authToken[0];
      const jwtPayload: any = jwt.decode(authToken);
      const { manager } = this.connection;
      const currentUser = await manager.findOne(User, { where: {id: jwtPayload.id }});
      client.join(`user_${currentUser?.id}`);
      context.switchToHttp().getRequest().user = currentUser

      return Boolean(currentUser);
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
