import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import AuthService from '@ncdf/auth/auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private moduleRef: ModuleRef,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  /**
   * Validate a user.
   *
   * @param request
   * @param username
   * @param password
   */
  async validate(request: Request, username: string, password: string): Promise<any> {
    try {
      return this.authService.validateUser(username, password);
    } catch (error) {
      return {
        ...error
      };
    }
  }
}
