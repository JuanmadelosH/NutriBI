const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta('SELECT * FROM clientes ORDER BY nombre');
  res.json(rows);
};

const getById = async (req, res) => {
  const [row] = await db.ejecutarConsulta('SELECT * FROM clientes WHERE id_cliente = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Cliente no encontrado.' });
  res.json(row);
};

const crear = async (req, res) => {
  const { nombre, tipo, ciudad, contacto } = req.body;
  if (!nombre || !tipo) return res.status(400).json({ error: 'nombre y tipo son requeridos.' });
  const r = await db.ejecutarConsulta(
    'INSERT INTO clientes (nombre, tipo, ciudad, contacto) VALUES (?, ?, ?, ?)',
    [nombre, tipo, ciudad || null, contacto || null]
  );
  res.status(201).json({ id_cliente: r.insertId, mensaje: 'Cliente creado.' });
};

const actualizar = async (req, res) => {
  const campos = []; const valores = [];
  for (const key of ['nombre', 'tipo', 'ciudad', 'contacto']) {
    if (req.body[key] !== undefined) { campos.push(`${key} = ?`); valores.push(req.body[key]); }
  }
  if (!campos.length) return res.status(400).json({ error: 'Sin campos para actualizar.' });
  valores.push(req.params.id);
  await db.ejecutarConsulta(`UPDATE clientes SET ${campos.join(', ')} WHERE id_cliente = ?`, valores);
  res.json({ mensaje: 'Cliente actualizado.' });
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id]);
  res.json({ mensaje: 'Cliente eliminado.' });
};

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authorize('admin'), crear);
router.put('/:id', authorize('admin'), actualizar);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
