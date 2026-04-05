import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';

@Module({
  imports: [DatabaseModule, UsersModule, MahasiswaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
