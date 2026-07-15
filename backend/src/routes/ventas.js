const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const escribirVentas = authorize('admin', 'operacion');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(`
    SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
    FROM ventas v
    JOIN clientes c ON v.id_cliente = c.id_cliente
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    ORDER BY v.fecha DESC
  `);
  res.json(rows);
};

const getById = async (req, res) => {
  const [venta] = await db.ejecutarConsulta(`
    SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
    FROM ventas v
    JOIN clientes c ON v.id_cliente = c.id_cliente
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    WHERE v.id_venta = ?
  `, [req.params.id]);
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada.' });
  const detalle = await db.ejecutarConsulta(`
    SELECT dv.*, p.nombre AS producto_nombre
    FROM detalle_ventas dv
    JOIN productos p ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = ?
  `, [req.params.id]);
  res.json({ ...venta, detalle });
};

const crear = async (req, res) => {
  const { id_cliente, items } = req.body;
  if (!id_cliente || !items || !items.length)
    return res.status(400).json({ error: 'id_cliente e items (array) son requeridos.' });

  let total = 0;
  for (const item of items) {
    if (!item.id_producto || !item.cantidad)
      return res.status(400).json({ error: 'Cada item requiere id_producto y cantidad.' });
    const [p] = await db.ejecutarConsulta('SELECT precio_venta FROM productos WHERE id_producto = ?', [item.id_producto]);
    if (!p) return res.status(400).json({ error: `Producto ${item.id_producto} no existe.` });
    item.precio_unitario = p.precio_venta;
    item.subtotal = item.cantidad * p.precio_venta;
    total += item.subtotal;
  }

  const conn = await (await db.getPool()).getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      'INSERT INTO ventas (fecha, id_cliente, id_usuario, total) VALUES (CURDATE(), ?, ?, ?)',
      [id_cliente, req.usuario.id, total]
    );
    for (const item of items) {
      await conn.execute(
        'INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, costo_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [r.insertId, item.id_producto, item.cantidad, item.precio_unitario, item.costo_unitario || 0, item.subtotal]
      );
    }
    await conn.commit();
    res.status(201).json({ id_venta: r.insertId, total, mensaje: 'Venta creada.' });
  } catch (e) {
    await conn.rollback(); throw e;
  } finally {
    conn.release();
  }
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM ventas WHERE id_venta = ?', [req.params.id]);
  res.json({ mensaje: 'Venta eliminada.' });
};

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', escribirVentas, crear);
router.delete('/:id', authorize('admin'), eliminar);

module.exports = router;
