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
  ParseIntPipe 
} from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service'; // INI YANG TADI ILANG
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';

@Controller('mahasiswa') // Base URL: http://localhost:3000/mahasiswa
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  // ==========================================
  // SECTION: CREATE MAHASISWA (POST) - NO 6
  // ==========================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMahasiswaDto: CreateMahasiswaDto) {
    return await this.mahasiswaService.create(createMahasiswaDto);
  }

  // ==========================================
  // SECTION: READ WITH PAGINATION & SEARCH - NO 7
  // ==========================================
  // Contoh: /mahasiswa?page=1&limit=5&search_column=nim&search_value=2410
  @Get()
  async findAll(@Query() query: any) {
    return await this.mahasiswaService.findAll(query);
  }

  // ==========================================
  // SECTION: UPDATE MAHASISWA (PATCH) - NO 6
  // ==========================================
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: any
  ) {
    return await this.mahasiswaService.update(id, updateData);
  }

  // ==========================================
  // SECTION: DELETE MAHASISWA (HARD DELETE) - NO 6
  // ==========================================
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.mahasiswaService.remove(id);
  }
}