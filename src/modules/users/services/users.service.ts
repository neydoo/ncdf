import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '@ncdf/users/entities/user.entity';
import { CompanyService } from 'modules/companies/services/company.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private company: CompanyService
  ) { }

  async getUsers(user: User): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(_id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { "id": _id }, relations: ['company']
    });
  }

  async createOrNew(data: any ) : Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { email: data.email}, relations: ['company']
    });
    if (!user) {
      user = await this.createUser(data);
      data.company.userId = user.id;

      user.company = await this.company.createOrNew(data.company);
    }

    return user;
  }

  async updateUser(user: User) {
    return this.usersRepository.save(user);
  }

  async createUser(user: User) {
    let resp = null;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      resp = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return resp;
  }

  async deleteUser(user: User) {
    this.usersRepository.delete(user);
  }
}
