import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      // NOTE: Secret di bawah di-hardcode untuk keperluan teknikal test.
      // Best practice: Pindahkan ke .env dan gunakan ConfigService untuk keamanan (Cybersecurity Standard).
      secret: 'RAHASIA_NEGARA_UPN', // Ini kunci buat segel tokennya
      signOptions: { expiresIn: '15m' }, // Token basi dalam 15 menit sesuai modul
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
