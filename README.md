# Technical Test - Backend Engineer 2026 (UPN Jakarta)

Repositori ini berisi implementasi RESTful API menggunakan **NestJS** dan **Knex.js** (PostgreSQL) untuk memenuhi persyaratan Technical Test Backend Engineer. Project ini mencakup manajemen user, autentikasi keamanan, dan manajemen data mahasiswa.

## 🚀 Fitur Utama
- **Authentication & Security**: 
    - Login menggunakan Email & Password.
    - Integrasi **JWT Auth** dengan masa berlaku (Expiry) **15 menit**.
    - Password hashing menggunakan **Bcrypt**.
- **User Management**:
    - CRUD lengkap (Create, Read, Update, Get by ID/Email).
    - Implementasi **Soft Delete** untuk menjaga integritas data.
    - Handling error untuk Email Unique (Pesan: "Email already exists").
- **Mahasiswa Management**:
    - CRUD Data Mahasiswa[.
    - Validasi **Enum Jurusan** (Informatika, Sistem Informasi, Teknik Elektro, Manajemen).
- **Advanced Querying**:
    - List data mahasiswa dengan **Pagination** (Page & Limit).
    - **Dynamic Search/Where**: Bisa mencari berdasarkan kolom apa pun seperti NIM atau Email secara dinamis lewat Query Params.

## 📊 Struktur Database

### 1. Tabel `users` 
| Kolom | Tipe | Keterangan |
| :--- | :--- | :--- |
| id | SERIAL | Primary Key |
| email | VARCHAR(150) | Not Null, Unique |
| name | VARCHAR(150) | Not Null |
| password | VARCHAR(255) | Hashed |
| is_active | BOOLEAN | Not Null |
| register_date | TIMESTAMP | Opsional |

### 2. Tabel `data_mhs` 
| Kolom | Tipe | Keterangan |
| :--- | :--- | :--- |
| id | SERIAL | Primary Key |
| nim | VARCHAR(20) | Unique & Wajib diisi |
| nama | VARCHAR(100) | Nama Mahasiswa |
| email | VARCHAR(100) | Unique |
| jurusan | ENUM | Informatika, SI, TE, Manajemen |
| tanggal_lahir | DATE | Opsional |
| created_at | TIMESTAMP | Otomatis |
| updated_at | TIMESTAMP | Otomatis |

## 🛠️ Tech Stack
- **Framework**: NestJS
- **Query Builder**: Knex.js
- **Database**: PostgreSQL
- **Libraries**: `passport-jwt`, `bcrypt`, `class-validator`, `class-transformer`.

## 📦 Instalasi & Cara Menjalankan

1. **Clone Repository**
   git clone [https://github.com/S1nt4x16/test-backend-upn-valentinus.git](https://github.com/S1nt4x16/test-backend-      upn-valentinus.git)
   cd test-backend-upn-valentinus
2. **Install Dependencies**
   npm install
3. **Konfigurasi Database**
   const config: Knex.Config = {
      client: 'pg',
      connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'your_password',
        database: 'my_db',
      },
    };
4. **Running Project**
   npm run start:dev
