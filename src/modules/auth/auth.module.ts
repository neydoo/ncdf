import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import LocalStrategy from '@ncdf/auth/strategies/local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../config/app.config';
import { JwtStrategy } from '@ncdf/auth/strategies/jwt/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import AuthController from './controllers/auth.controller';
import AuthService from './auth.service';
import { UsersModule } from '@ncdf/users/users.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: 'oPLx8XJR*Fc0Dz5$0tgX^LfLxneUQpqM',
      signOptions: { expiresIn: configuration().jwt.duration || '360000s' },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})

export default class AuthModule {}
