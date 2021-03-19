import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly oldPassword?: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type?: string;
}
