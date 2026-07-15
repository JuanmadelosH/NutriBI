const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const escribirVentas = authorize('admin', 'operacion');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(`
    SELECT
      v.id_venta, v.fecha, v.id_cliente, v.id_usuario, v.total,
      dv.id_producto, dv.cantidad, dv.precio_unitario, dv.costo_unitario,
      dv.subtotal AS monto_total,
      p.nombre AS producto,
      c.nombre AS cliente
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    JOIN productos p ON dv.id_producto = p.id_producto
    JOIN clientes c ON v.id_cliente = c.id_cliente
    ORDER BY v.fecha DESC, v.id_venta
  `);
  res.json(rows);
};

const getById = async (req, res) => {
  const [venta] = await db.ejecutarConsulta(`
    SELECT
      v.*, dv.id_producto, dv.cantidad, dv.precio_unitario, dv.costo_unitario,
      dv.subtotal AS monto_total,
      p.nombre AS producto,
      c.nombre AS cliente
    FROM ventas v
    JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
    JOIN productos p ON dv.id_producto = p.id_producto
    JOIN clientes c ON v.id_cliente = c.id_cliente
    WHERE v.id_venta = ?
  `, [req.params.id]);
  if (!venta) return res.status(404).json({ error: 'Venta no encontrada.' });
  res.json(venta);
};

const crear = async (req, res) => {
  let { id_cliente, fecha, items } = req.body;

  // Soporte para formato plano (RegistroVentas.jsx): un solo producto
  if (!items && req.body.id_producto) {
    items = [{
      id_producto: req.body.id_producto,
      cantidad: req.body.cantidad,
      precio_unitario: req.body.precio_unitario,
      costo_unitario: req.body.costo_unitario || 0,
    }];
    if (!id_cliente) id_cliente = req.body.id_cliente;
  }

  if (!id_cliente || !items || !items.length)
    return res.status(400).json({ error: 'id_cliente e items (array) son requeridos.' });

  let total = 0;
  for (const item of items) {
    if (!item.id_producto || !item.cantidad)
      return res.status(400).json({ error: 'Cada item requiere id_producto y cantidad.' });
    const [p] = await db.ejecutarConsulta('SELECT precio_venta FROM productos WHERE id_producto = ?', [item.id_producto]);
    if (!p) return res.status(400).json({ error: `Producto ${item.id_producto} no existe.` });
    if (!item.precio_unitario) item.precio_unitario = p.precio_venta;
    item.subtotal = item.cantidad * item.precio_unitario;
    total += item.subtotal;
  }

  const conn = await (await db.getPool()).getConnection();
  try {
    await conn.beginTransaction();
    const [r] = await conn.execute(
      'INSERT INTO ventas (fecha, id_cliente, id_usuario, total) VALUES (?, ?, ?, ?)',
      [fecha || new Date().toISOString().slice(0, 10), id_cliente, req.usuario.id, total]
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
