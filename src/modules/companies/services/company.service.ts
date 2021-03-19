import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectRepository(Company) private companyRepository: Repository<Company>
  ) { }

  async getCompanies(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async getCompany(_id: number): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { "id": _id }
    });
  }

  async createOrNew(data: any) {
    let company = await this.companyRepository.findOne({
      where: { email: data.email}
    });

    if (!company) {
      company = await this.createCompany(data);
    }

    return company;
  }

  async updateCompany(company: Company) {
    return this.companyRepository.save(company);
  }

  async createCompany(company: Company) {
    let resp = null;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      resp = await queryRunner.manager.save(company);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return resp;
  }

  async deleteCompany(company: Company) {
    this.companyRepository.delete(company);
  }
}
