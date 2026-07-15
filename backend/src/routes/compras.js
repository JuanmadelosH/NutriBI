const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const escribirCompras = authorize('admin', 'contador');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta(`
    SELECT
      c.id_compra, c.fecha, c.proveedor, c.id_usuario, c.total,
      dc.id_insumo, dc.cantidad, dc.costo_unitario, dc.subtotal AS monto_total,
      ci.nombre AS insumo
    FROM compras c
    JOIN detalle_compras dc ON c.id_compra = dc.id_compra
    JOIN costos_insumos ci ON dc.id_insumo = ci.id_insumo
    ORDER BY c.fecha DESC, c.id_compra
  `);
  res.json(rows);
};

const getById = async (req, res) => {
  const [compra] = await db.ejecutarConsulta(`
    SELECT
      c.*, dc.id_insumo, dc.cantidad, dc.costo_unitario, dc.subtotal AS monto_total,
      ci.nombre AS insumo
    FROM compras c
    JOIN detalle_compras dc ON c.id_compra = dc.id_compra
    JOIN costos_insumos ci ON dc.id_insumo = ci.id_insumo
    WHERE c.id_compra = ?
  `, [req.params.id]);
  if (!compra) return res.status(404).json({ error: 'Compra no encontrada.' });
  res.json(compra);
};

const crear = async (req, res) => {
  let { proveedor, fecha, actualiza_precio_semanal, items } = req.body;

  // Soporte para formato plano (RegistroCompras.jsx): un solo insumo
  if (!items && req.body.id_insumo) {
    items = [{
      id_insumo: req.body.id_insumo,
      cantidad: req.body.cantidad,
      costo_unitario: req.body.costo_unitario,
    }];
    if (!proveedor) proveedor = req.body.proveedor;
  }

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
    const fechaVal = fecha || new Date().toISOString().slice(0, 10);
    const [r] = await conn.execute(
      'INSERT INTO compras (fecha, proveedor, id_usuario, total) VALUES (?, ?, ?, ?)',
      [fechaVal, proveedor, req.usuario.id, total]
    );
    for (const item of items) {
      await conn.execute(
        'INSERT INTO detalle_compras (id_compra, id_insumo, cantidad, costo_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [r.insertId, item.id_insumo, item.cantidad, item.costo_unitario, item.subtotal]
      );
      if (actualiza_precio_semanal) {
        const [filas] = await conn.execute(
          'SELECT nombre, tipo, unidad FROM costos_insumos WHERE id_insumo = ? LIMIT 1',
          [item.id_insumo]
        );
        if (filas.length) {
          const plantilla = filas[0];
          await conn.execute(
            'INSERT INTO costos_insumos (nombre, tipo, unidad, costo_unitario, periodo) VALUES (?, ?, ?, ?, ?)',
            [plantilla.nombre, plantilla.tipo, plantilla.unidad, item.costo_unitario, fechaVal]
          );
        }
      }
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
