import { UsersModule } from '@ncdf/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyService } from './services/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UsersModule),
  ],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompaniesModule {}
