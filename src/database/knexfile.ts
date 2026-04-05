import { Knex } from 'knex';
// sesuaikan config dengan database yang dibuat diawal
const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'my_db',
  },
};
export default config;
