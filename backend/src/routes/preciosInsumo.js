const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(
    'SELECT id_insumo, nombre, tipo, unidad, costo_unitario, periodo AS semana FROM costos_insumos ORDER BY nombre, periodo DESC'
  );
  res.json(rows);
};

const crear = async (req, res) => {
  const { id_insumo, costo_unitario, periodo, semana } = req.body;
  const periodoVal = periodo || semana;
  if (!id_insumo || !costo_unitario || !periodoVal)
    return res.status(400).json({ error: 'id_insumo, costo_unitario y periodo/semana son requeridos.' });
  const [plantilla] = await db.ejecutarConsulta(
    'SELECT nombre, tipo, unidad FROM costos_insumos WHERE id_insumo = ? LIMIT 1',
    [id_insumo]
  );
  if (!plantilla) return res.status(400).json({ error: 'id_insumo no existe en costos_insumos.' });
  const r = await db.ejecutarConsulta(
    'INSERT INTO costos_insumos (nombre, tipo, unidad, costo_unitario, periodo) VALUES (?, ?, ?, ?, ?)',
    [plantilla.nombre, plantilla.tipo, plantilla.unidad, costo_unitario, periodoVal]
  );
  res.status(201).json({ id_insumo: r.insertId, mensaje: 'Precio de insumo registrado.' });
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM costos_insumos WHERE id_insumo = ?', [req.params.id]);
  res.json({ mensaje: 'Precio de insumo eliminado.' });
};

router.get('/', getAll);
router.post('/', authorize('admin', 'contador'), crear);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
