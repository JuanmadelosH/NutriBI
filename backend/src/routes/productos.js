const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta('SELECT * FROM productos ORDER BY nombre');
  res.json(rows);
};

const getById = async (req, res) => {
  const [row] = await db.ejecutarConsulta('SELECT * FROM productos WHERE id_producto = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Producto no encontrado.' });
  res.json(row);
};

const crear = async (req, res) => {
  const { nombre, categoria, presentacion, precio_venta } = req.body;
  if (!nombre || !categoria || !presentacion || !precio_venta)
    return res.status(400).json({ error: 'nombre, categoria, presentacion, precio_venta son requeridos.' });
  const r = await db.ejecutarConsulta(
    'INSERT INTO productos (nombre, categoria, presentacion, precio_venta) VALUES (?, ?, ?, ?)',
    [nombre, categoria, presentacion, precio_venta]
  );
  res.status(201).json({ id_producto: r.insertId, mensaje: 'Producto creado.' });
};

const actualizar = async (req, res) => {
  const campos = []; const valores = [];
  for (const key of ['nombre', 'categoria', 'presentacion', 'precio_venta', 'activo']) {
    if (req.body[key] !== undefined) { campos.push(`${key} = ?`); valores.push(req.body[key]); }
  }
  if (!campos.length) return res.status(400).json({ error: 'Sin campos para actualizar.' });
  valores.push(req.params.id);
  await db.ejecutarConsulta(`UPDATE productos SET ${campos.join(', ')} WHERE id_producto = ?`, valores);
  res.json({ mensaje: 'Producto actualizado.' });
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM productos WHERE id_producto = ?', [req.params.id]);
  res.json({ mensaje: 'Producto eliminado.' });
};

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authorize('admin'), crear);
router.put('/:id', authorize('admin'), actualizar);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
