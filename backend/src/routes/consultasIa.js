const router = require('express').Router();
const db = require('../services/dbService');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(
    'SELECT * FROM historial_consultas WHERE id_usuario = ? ORDER BY fecha DESC LIMIT 20',
    [req.usuario.id]
  );
  res.json(rows);
};

const guardar = async (pregunta, sql, respuesta, id_usuario) => {
  try {
    await db.ejecutarConsulta(
      'INSERT INTO historial_consultas (id_usuario, pregunta, sql_generado, respuesta) VALUES (?, ?, ?, ?)',
      [id_usuario, pregunta, sql, respuesta]
    );
  } catch (e) {
    console.error('Error guardando historial:', e.message);
  }
};

router.get('/', getAll);

module.exports = { router, guardar };
