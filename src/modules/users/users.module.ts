import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from 'modules/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CompaniesModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
