const SQL_PATRON_VALIDO = /^\s*SELECT\b/i;
const SQL_PATRON_PELIGROSO = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|REPLACE|EXEC|EXECUTE|CALL)\b/i;

const validateSQL = (sql) => {
  if (!sql || typeof sql !== 'string') return false;
  if (!SQL_PATRON_VALIDO.test(sql)) return false;
  if (SQL_PATRON_PELIGROSO.test(sql)) return false;
  return true;
};

module.exports = validateSQL;
