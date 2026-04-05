import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { KnexService } from '../database/knex.service';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly knexService: KnexService,
    private readonly jwtService: JwtService, // Inject JwtService di sini
  ) {}

  // ==========================================
  // SECTION: CREATE USER (REGISTER)
  // ==========================================
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, name, password, is_active, register_date } = createUserDto;

    const existingUser = await this.knexService
      .connection('users')
      .where('email', email)
      .first();

    if (existingUser) {
      throw new BadRequestException('Email already exists, silakan pake email lain!');
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const [user] = await this.knexService
      .connection('users')
      .insert({
        email,
        name,
        password: hashedPassword,
        is_active: is_active ?? true,
        register_date: register_date ?? new Date(),
      })
      .returning('*');

    return this.mapToResponseDto(user);
  }

  // ==========================
  // SECTION: LOGIN USER & JWT 
  // ==========================
async login(loginDto: any) {
  const { email, password } = loginDto;

  // 1. Cari user
  const user = await this.knexService
    .connection('users')
    .where('email', email)
    .where('is_active', true)
    .first();

  if (!user) {
    throw new UnauthorizedException('Email atau Password salah!');
  }

  // 2. Cek password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedException('Email atau Password salah!');
  }

  // 3. Generate Token (Sesuai instruksi 15 menit)
  const payload = { sub: user.id, email: user.email };
  
  return {
    message: 'Login Berhasil!',
    access_token: await this.jwtService.signAsync(payload),
    expires_in: '15 minutes', // Penanda eksplisit sesuai soal
    refresh_at: new Date(Date.now() + 15 * 60 * 1000), // Info kapan harus refresh
  };
}

  // ==========================================
  // SECTION: GET ALL USERS
  // ==========================================
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.knexService
      .connection('users')
      .where('is_active', true);
    
    return users.map(user => this.mapToResponseDto(user));
  }

  // ==========================================
  // SECTION: GET USER BY ID
  // ==========================================
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.knexService
      .connection('users')
      .where('id', id)
      .first();

    if (!user) throw new NotFoundException(`User dengan ID ${id} gak ketemu bos!`);
    
    return this.mapToResponseDto(user);
  }

  // ==========================================
  // SECTION: GET USER BY EMAIL
  // ==========================================
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.knexService
      .connection('users')
      .where('email', email)
      .first();

    if (!user) throw new NotFoundException(`Email ${email} belum kedaftar di sistem.`);
    
    return this.mapToResponseDto(user);
  }

  // ==========================================
  // SECTION: UPDATE USER DATA
  // ==========================================
  async update(id: number, data: any) {
    await this.findOne(id);

    if (data.email) {
      const existingUser = await this.knexService
        .connection('users')
        .where('email', data.email)
        .whereNot('id', id)
        .first();

      if (existingUser) {
        throw new BadRequestException('Email already exists, gagal update data!');
      }
    }

    const [updatedUser] = await this.knexService
      .connection('users')
      .where('id', id)
      .update(data)
      .returning('*');

    return this.mapToResponseDto(updatedUser);
  }

  // ==========================================
  // SECTION: REMOVE USER (SOFT DELETE)
  // ==========================================
  async remove(id: number) {
    await this.findOne(id);
    
    await this.knexService
      .connection('users')
      .where('id', id)
      .update({ is_active: false });

    return { message: `User ID ${id} sudah di-soft delete.` };
  }

  // ==========================================
  // HELPER: MAPPER KE DTO
  // ==========================================
  private mapToResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_active: user.is_active,
      register_date: user.register_date,
    };
  }
}