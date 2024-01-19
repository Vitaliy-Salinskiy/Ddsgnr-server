import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { OtpModule } from 'src/otp/otp.module';

@Module({
	providers: [MailService],
	exports: [MailService]
})
export class MailModule { }
