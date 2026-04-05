import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { KnexService } from '../database/knex.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';

@Injectable()
export class MahasiswaService {
  constructor(private readonly knexService: KnexService) {}

  // ==========================================
  // CREATE MAHASISWA
  // ==========================================
  async create(createMahasiswaDto: CreateMahasiswaDto) {
    const { nim, email } = createMahasiswaDto;

    // Cek duplikasi NIM atau Email biar gak bentrok di database
    const existing = await this.knexService.connection('data_mhs')
      .where('nim', nim)
      .orWhere('email', email)
      .first();
    
    if (existing) {
      throw new BadRequestException('NIM atau Email sudah terdaftar di sistem!');
    }

    const [mahasiswa] = await this.knexService
      .connection('data_mhs')
      .insert(createMahasiswaDto)
      .returning('*');

    return mahasiswa;
  }

  // ==========================================
  // GET ALL MAHASISWA (WITH PAGINATION & SEARCH)
  // ==========================================
  async findAll(query: any) {
    const { page = 1, limit = 10, search_column, search_value } = query;
    const offset = (page - 1) * limit;

    const queryBuilder = this.knexService.connection('data_mhs');

    // Dynamic Search: cari data berdasarkan kolom dan value yang dikirim lewat query
    if (search_column && search_value) {
      queryBuilder.where(search_column, 'ilike', `%${search_value}%`);
    }

    // Ambil list datanya dengan limit dan offset
    const data = await queryBuilder
      .clone()
      .limit(limit)
      .offset(offset)
      .orderBy('id', 'asc');

    // Hitung total data (pake proteksi null check biar gak error undefined)
    const totalResult = await queryBuilder.clone().count('id as total').first();
    const total = totalResult ? parseInt(totalResult.total as string) : 0;

    return {
      data,
      meta: {
        total,
        page: parseInt(page),
        last_page: total > 0 ? Math.ceil(total / limit) : 1,
      },
    };
  }

  // ==========================================
  // GET ONE MAHASISWA BY ID
  // ==========================================
  async findOne(id: number) {
    const mhs = await this.knexService
      .connection('data_mhs')
      .where('id', id)
      .first();

    if (!mhs) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan.`);
    }

    return mhs;
  }

  // ==========================================
  // UPDATE DATA MAHASISWA
  // ==========================================
  async update(id: number, data: any) {
    // Pastikan datanya ada sebelum di-update
    await this.findOne(id);

    // Kalo ganti NIM/Email, pastiin gak kembar sama punya orang lain
    if (data.nim || data.email) {
      const existing = await this.knexService
        .connection('data_mhs')
        .where((qb) => {
          if (data.nim) qb.where('nim', data.nim);
          if (data.email) qb.orWhere('email', data.email);
        })
        .whereNot('id', id)
        .first();

      if (existing) {
        throw new BadRequestException('NIM atau Email sudah dipakai mahasiswa lain!');
      }
    }

    const [updated] = await this.knexService
      .connection('data_mhs')
      .where('id', id)
      .update(data)
      .returning('*');

    return updated;
  }

  // ==========================================
  // DELETE MAHASISWA (PERMANENT)
  // ==========================================
  async remove(id: number) {
    // Pastiin data ada dulu
    await this.findOne(id);

    const deleted = await this.knexService
      .connection('data_mhs')
      .where('id', id)
      .del();

    if (!deleted) {
      throw new BadRequestException('Gagal menghapus data mahasiswa.');
    }

    return { message: `Data mahasiswa ID ${id} berhasil dihapus dari sistem.` };
  }
}