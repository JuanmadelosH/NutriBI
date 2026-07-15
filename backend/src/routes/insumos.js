const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const escribirInsumos = authorize('admin', 'contador');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta('SELECT * FROM costos_insumos ORDER BY nombre, periodo DESC');
  res.json(rows);
};

const getById = async (req, res) => {
  const [row] = await db.ejecutarConsulta('SELECT * FROM costos_insumos WHERE id_insumo = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Insumo no encontrado.' });
  res.json(row);
};

const crear = async (req, res) => {
  const { nombre, tipo, unidad, costo_unitario, periodo } = req.body;
  if (!nombre || !tipo || !unidad || !costo_unitario || !periodo)
    return res.status(400).json({ error: 'nombre, tipo, unidad, costo_unitario y periodo son requeridos.' });
  const r = await db.ejecutarConsulta(
    'INSERT INTO costos_insumos (nombre, tipo, unidad, costo_unitario, periodo) VALUES (?, ?, ?, ?, ?)',
    [nombre, tipo, unidad, costo_unitario, periodo]
  );
  res.status(201).json({ id_insumo: r.insertId, mensaje: 'Insumo creado.' });
};

const actualizar = async (req, res) => {
  const campos = []; const valores = [];
  for (const key of ['nombre', 'tipo', 'unidad', 'costo_unitario', 'periodo']) {
    if (req.body[key] !== undefined) { campos.push(`${key} = ?`); valores.push(req.body[key]); }
  }
  if (!campos.length) return res.status(400).json({ error: 'Sin campos para actualizar.' });
  valores.push(req.params.id);
  await db.ejecutarConsulta(`UPDATE costos_insumos SET ${campos.join(', ')} WHERE id_insumo = ?`, valores);
  res.json({ mensaje: 'Insumo actualizado.' });
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM costos_insumos WHERE id_insumo = ?', [req.params.id]);
  res.json({ mensaje: 'Insumo eliminado.' });
};

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', escribirInsumos, crear);
router.put('/:id', escribirInsumos, actualizar);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
