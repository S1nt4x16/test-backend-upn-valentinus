import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users') // Base URL: http://localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==========================================
  // SECTION: REGISTER / CREATE USER (POST)
  // ==========================================
  @Post('register') // Kita kasih path 'register' biar jelas
  @HttpCode(HttpStatus.CREATED) // Kasih response status 201 kalo berhasil
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Lempar data dari Postman ke Service
    return this.usersService.create(createUserDto);
  }

  // ==========================================
  // SECTION: LOGIN USER (POST)
  // ==========================================
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: any) {
    // Lempar data email & pass ke service buat diperiksa
    return await this.usersService.login(loginData);
  }

  // ==========================================
  // SECTION: AMBIL SEMUA USER (GET)
  // ==========================================
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    // Panggil fungsi findAll di service buat narik list user aktif
    return await this.usersService.findAll();
  }

  // ==========================================
  // SECTION: CARI USER PAKE EMAIL (GET QUERY)
  // ==========================================
  // Cara akses: /users/search?email=valen@gmail.com
  @Get('search')
  async findByEmail(@Query('email') email: string): Promise<UserResponseDto> {
    return await this.usersService.findByEmail(email);
  }

  // ==========================================
  // SECTION: AMBIL SATU USER BY ID (GET PARAM)
  // ==========================================
  // Cara akses: /users/1
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    // ParseIntPipe gunanya biar ID yang masuk otomatis jadi angka (number)
    return await this.usersService.findOne(id);
  }

  // ==========================================
  // SECTION: UPDATE DATA USER (PATCH)
  // ==========================================
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
  ): Promise<UserResponseDto> {
    // ID buat nyari targetnya, Body buat nampung data barunya
    return await this.usersService.update(id, updateData);
  }

  // ==========================================
  // SECTION: HAPUS USER (SOFT DELETE)
  // ==========================================
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    // Panggil fungsi remove yang cuma bakal ngerubah status is_active jadi false
    return await this.usersService.remove(id);
  }
}
