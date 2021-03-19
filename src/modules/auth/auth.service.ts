import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import NogicService from './services/nogic.service';
import { UsersService } from '@ncdf/users/services/users.service';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private nogic: NogicService,
    private user: UsersService
  ) {}

  /**
   * Validate the users credentials.
   *
   * This is useful for the login.
   *
   * @todo update the default return.
   *
   * @param email
   * @param password
   * @constructor
   */
  async validateUser(email: string, password: string): Promise<User> {
    let user;

    try {
      user = await this._localLogin(email, password);
    } catch (e) {
      let userPayload = await this.nogic.login({ email, password});
      user = await this.user.createOrNew(userPayload);
    }

    return user
  }

  /**
   * Register a new user.
   *
   * @param dto
   */
  public async registerUser(dto: User): Promise<any> {
    try {
      const payload = dto;

      payload.password = bcrypt.hashSync(dto.password, 10);

      const user: User = await this.usersRepository.create(payload);
      return {
        ...user
      };
    } catch (error) {
      // @todo improve on the error handling. Return exact field with the error
      if ('code' in error && error.code === 11000) {
        return {
          message: 'The user already exists',
          code: error.code,
        };
      }
      return {
        ...error
      };
    }
  }

  /**
   * Sign in a new user
   *
   * @todo we should a different key for the refresh token jwt
   * @param user
   */
  async login(user: any): Promise<any> {
    const payload = {
      user,
      nogic_token: user.token,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 3000 }),
      user
    };
  }


  async _localLogin(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email }, relations: ['company']});
    // Check if password is correct 
    if (!user) {
      throw new NotFoundException('user with this details do not exist.');
    }

    if (!bcrypt.compareSync(password, user.password)) throw new NotFoundException('Invalid Password, Please enter the correct password.');

    if(user.group === 'company' && !user.company) throw new Error();

    return user;
  }



  /**
   * Refresh an access token.
   *
   * For refresh tokens that have less than ten minutes before expiry a new refresh token is also
   * added to the payload.
   *
   * @param request
   */
  async refreshAccessToken(request: any): Promise<any> {
    const payload = {
      id: request.user.id,
    };

    // Get expiring time
    const exp = request.user.exp * 1000;
    const timeLeft = Math.floor(((exp - Date.now()) / 1000 / 60));

    // Return if less than or equal 10 minutes;
    if (timeLeft <= 10) {
      return {
        accessToken: this.jwtService.sign(payload, { expiresIn: 3000 }),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      };
    }

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: 3000 }),
    };
  }

  /**
   * Get application roles.
   *
   * @todo Integrate with the roles guard.
   */
  async getUserByKey(key: string, value: string): Promise<any> {
    const check = await this.usersRepository.findOne({ [key]: value  });

    return check;
  }

  /**
   * Get user
   * @param user 
   */
  async getUser(user: any): Promise<User> {
    return await this.usersRepository.findOne({ id: user.id});
  }

  /**
   * Get user
   * @param user 
   */
  async updateUser(data: User): Promise<User> {
    return this.usersRepository.save(data);
  }
}
