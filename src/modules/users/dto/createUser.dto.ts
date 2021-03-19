import {
  IsArray, IsEmail, IsOptional, IsString,
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export default class CreateUserDto {
  @IsString()
  @IsOptional()
  _id: string;

  @IsString()
  @IsOptional()
  nogicUniqueId?: string;

  @IsString()
  @IsOptional()
  nogicId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastLogin: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;
}
