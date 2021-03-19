import { User } from '@ncdf/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { CompanyType } from './company-types.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: Number,
  })
  userId: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  nogicUniqueId: string;

  @Column()
  nogicId: string;

  @Column({
    type: Number
  })
  companyTypeId: number;
  
  @Column()
  phone: string;
       
  @Column()
  address: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => CompanyType)
  @JoinColumn()
  type: CompanyType;
}