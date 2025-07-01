const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'goatmf77',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'backenddev'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};