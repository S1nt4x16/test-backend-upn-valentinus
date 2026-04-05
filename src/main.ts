import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,               // Hapus data yang gak ada di DTO (biar aman dari hacker)
    forbidNonWhitelisted: true,    // Kasih error kalau ada field siluman
    transform: true,               // Otomatis ubah tipe data (misal string ke number)
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
