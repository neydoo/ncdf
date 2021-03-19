import { User } from '@ncdf/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class CompanyType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: Number,
  })
  name: number;

  @Column()
  slug: string;

  @OneToOne(type => Company, company => company.companyTypeId)
  company: Company;
}