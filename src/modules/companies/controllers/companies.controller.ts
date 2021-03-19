import { Controller, Post, Body, Get, Put, Delete,Param} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { Company } from '../entities/company.entity';

@Controller('companies')
export class CompaniesController {

    constructor(private service: CompanyService) { }

    @Get(':id')
    get(@Param() params) {
        return this.service.getCompany(params.id);
    }

    @Post()
    create(@Body() company: Company) {
      return this.service.createCompany(company);
    }

    @Put()
    update(@Body() company: Company) {
      return this.service.updateCompany(company);
    }

    @Delete(':id')
    deleteUser(@Param() params) {
      return this.service.deleteCompany(params.id);
    }
}