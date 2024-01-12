import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [UsersModule, PassportModule],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy],
})
export class AuthModule { }
