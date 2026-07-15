const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const escribirCompras = authorize('admin', 'contador');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(`
    SELECT c.*, u.nombre AS usuario_nombre
    FROM compras c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    ORDER BY c.fecha DESC
  `);
  res.json(rows);
};

const getById = async (req, res) => {
  const [compra] = await db.ejecutarConsulta(`
    SELECT c.*, u.nombre AS usuario_nombre
    FROM compras c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_compra = ?
  `, [req.params.id]);
  if (!compra) return res.status(404).json({ error: 'Compra no encontrada.' });
  const detalle = await db.ejecutarConsulta(`
    SELECT dc.*, ci.nombre AS insumo_nombre
    FROM detalle_compras dc
    JOIN costos_insumos ci ON dc.id_insumo = ci.id_insumo
    WHERE dc.id_compra = ?
  `, [req.params.id]);
  res.json({ ...compra, detalle });
};

const crear = async (req, res) => {
  const { proveedor, items } = req.body;
  if (!proveedor || !items || !items.length)
    return res.status(400).json({ error: 'proveedor e items (array) son requeridos.' });

  let total = 0;
  for (const item of items) {
    if (!item.id_insumo || !item.cantidad || !item.costo_unitario)
      return res.status(400).json({ error: 'Cada item requiere id_insumo, cantidad y costo_unitario.' });
    item.subtotal = item.cantidad * item.costo_unitario;
    total += item.subtotal;
  }

  const conn = await (await db.getPool()).getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      'INSERT INTO compras (fecha, proveedor, id_usuario, total) VALUES (CURDATE(), ?, ?, ?)',
      [proveedor, req.usuario.id, total]
    );
    for (const item of items) {
      await conn.execute(
        'INSERT INTO detalle_compras (id_compra, id_insumo, cantidad, costo_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [r.insertId, item.id_insumo, item.cantidad, item.costo_unitario, item.subtotal]
      );
    }
    await conn.commit();
    res.status(201).json({ id_compra: r.insertId, total, mensaje: 'Compra registrada.' });
  } catch (e) {
    await conn.rollback(); throw e;
  } finally {
    conn.release();
  }
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM compras WHERE id_compra = ?', [req.params.id]);
  res.json({ mensaje: 'Compra eliminada.' });
};

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', escribirCompras, crear);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
