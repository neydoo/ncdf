import {
  Controller, Post, Req, Get, Body, UsePipes, ValidationPipe,
  UseGuards, Res, HttpStatus, Query, NotFoundException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import CreateUserDto from '@ncdf/users/dto/createUser.dto';
import AuthService from '../auth.service';
import { User } from '@ncdf/users/entities/user.entity';
import { CurrentUser } from '../auth.decorators';


@ApiTags('auth')
@Controller('api/auth')
export default class AuthController {
  constructor(
    private readonly auth: AuthService,
  ) {
  }

  /**
   * Login a user using the email/password combination
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({ status: 201, description: 'user logged in.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async login(@Req() request: Request): Promise<any> {
    const { user } = request;
    return this.auth.login(user);
  }

  

  /**
   * Generate a refresh token
   * @param request
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('token')
  @ApiResponse({ status: 201, description: 'refresh token.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async refreshAccessToken(@Req() request: Request): Promise<any> {
    return this.auth.refreshAccessToken(request);
  }

  /**
   * Get currently authenticated user
   * @param resp
   * @param user
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiResponse({ status: 201, description: 'current user data.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async me(@Res() resp: Response, @CurrentUser() user: User): Promise<any> {
    const currentUser = await this.auth.getUser(user);
    return resp.status(HttpStatus.OK).json({
      user: currentUser
    });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('forget-password')
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async forgetPassword(@Body() req: { email: string }): Promise<any> {
    const user = await this.auth.getUserByKey('email', req.email);
    // this.emailNotify.send(user, 'Forget Password', ForgotPasswordEmail(user));
    return user;
  }

  /**
   * Check user name 
   * 
   * @param resp 
   * @param req 
   */
  @Get('username')
  @ApiResponse({ status: 201, description: 'current user data.' })
  @ApiResponse({ status: 401, description: 'unauthorized.' })
  async validateUsername(@Res() resp: Response, @Query() req: { username: string }): Promise<any> {
    const check = await this.auth.getUserByKey('userName', req.username);
    return resp.status(HttpStatus.OK).json((check === null) ? true : false);
  }

}
