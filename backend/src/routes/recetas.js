const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(`
    SELECT
      CONCAT(r.id_producto, '-', r.id_insumo) AS id_receta,
      r.id_producto, r.id_insumo, r.cantidad,
      p.nombre AS producto_nombre,
      ci.nombre AS insumo_nombre
    FROM recetas r
    JOIN productos p ON r.id_producto = p.id_producto
    JOIN costos_insumos ci ON r.id_insumo = ci.id_insumo
    ORDER BY r.id_producto, r.id_insumo
  `);
  res.json(rows);
};

const crear = async (req, res) => {
  const { id_producto, id_insumo, cantidad } = req.body;
  if (!id_producto || !id_insumo || !cantidad)
    return res.status(400).json({ error: 'id_producto, id_insumo y cantidad son requeridos.' });
  await db.ejecutarConsulta(
    'INSERT INTO recetas (id_producto, id_insumo, cantidad) VALUES (?, ?, ?)',
    [id_producto, id_insumo, cantidad]
  );
  res.status(201).json({ mensaje: 'Receta creada.' });
};

const eliminar = async (req, res) => {
  const parts = req.params.id.split('-');
  const idProducto = parseInt(parts[0], 10);
  const idInsumo = parseInt(parts[1], 10);
  if (isNaN(idProducto) || isNaN(idInsumo))
    return res.status(400).json({ error: 'id inválido. Formato: id_producto-id_insumo' });
  await db.ejecutarConsulta(
    'DELETE FROM recetas WHERE id_producto = ? AND id_insumo = ?',
    [idProducto, idInsumo]
  );
  res.json({ mensaje: 'Receta eliminada.' });
};

router.get('/', getAll);
router.post('/', authorize('admin', 'contador'), crear);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
