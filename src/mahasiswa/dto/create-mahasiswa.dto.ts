import { IsEmail, IsNotEmpty, IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateMahasiswaDto {
  @IsNotEmpty()
  @IsString()
  nim: string;

  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['Informatika', 'Sistem Informasi', 'Teknik Elektro', 'Manajemen'], {
    message: 'Jurusan harus salah satu dari: Informatika, Sistem Informasi, Teknik Elektro, Manajemen',
  })
  @IsNotEmpty()
  jurusan: string;

  @IsOptional()
  @IsDateString() 
  tanggal_lahir?: string;
}