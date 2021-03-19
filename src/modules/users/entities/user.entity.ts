import { Company } from 'modules/companies/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  nogicUniqueId: string;

  @Column()
  nogicId: string;

  @Column()
  token: string;
  
  @Column()
  group: string;
       
  @Column()
  password: string;

  @Column('date')
  lastLogin: Date;

  @Column('boolean')
  isActive: boolean;

  @OneToOne(type => Company, company => company.userId)
  company: Company;
}