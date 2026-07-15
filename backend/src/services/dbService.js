const mysql = require('mysql2/promise');

let pool;

const getPool = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nutribi',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

const ejecutarConsulta = async (sql, params = []) => {
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
};

const obtenerEsquema = async () => {
  const p = await getPool();
  const [tablas] = await p.execute(`
    SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ?
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `, [process.env.DB_NAME || 'nutribi']);

  const esquema = {};
  for (const col of tablas) {
    if (!esquema[col.TABLE_NAME]) esquema[col.TABLE_NAME] = [];
    esquema[col.TABLE_NAME].push(`${col.COLUMN_NAME} ${col.DATA_TYPE}${col.COLUMN_KEY === 'PRI' ? ' PRIMARY KEY' : ''}${col.IS_NULLABLE === 'NO' ? ' NOT NULL' : ''}`);
  }

  return Object.entries(esquema)
    .map(([tabla, cols]) => `Tabla ${tabla}:\n  ${cols.join('\n  ')}`)
    .join('\n\n');
};

module.exports = { ejecutarConsulta, obtenerEsquema, getPool };
