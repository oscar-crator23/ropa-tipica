// db.js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  port: 3300,
  user: 'root',
  password: '12345',
  database: 'armario de chiapas', 
});

pool.query('SELECT 1')
  .then(() => console.log('Conectado a MySQL'))
  .catch((err) => console.error('Error al conectar a MySQL:', err));

pool.on('error', (err) => {
  console.error(' Error de MySQL:', err);
});

  