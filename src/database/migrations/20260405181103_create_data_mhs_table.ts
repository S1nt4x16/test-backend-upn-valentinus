import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('data_mhs', (table) => {
    table.increments('id').primary();
    table.string('nim', 20).unique().notNullable();
    table.string('nama', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.enum('jurusan', ['Informatika', 'Sistem Informasi', 'Teknik Elektro', 'Manajemen']).notNullable();
    table.date('tanggal_lahir').nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('data_mhs');
}