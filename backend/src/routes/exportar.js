const router = require('express').Router();
const db = require('../services/dbService');
const { Parser } = require('json2csv');

const exportarCSV = async (req, res, tabla, query, params = []) => {
  const rows = await db.ejecutarConsulta(query, params);
  if (!rows.length) return res.status(404).json({ error: 'No hay datos para exportar.' });

  const parser = new Parser();
  const csv = parser.parse(rows);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${tabla}_${new Date().toISOString().split('T')[0]}.csv"`);
  res.send('\uFEFF' + csv);
};

router.get('/ventas.csv', async (req, res) => {
  await exportarCSV(req, res, 'ventas', `
    SELECT v.id_venta, v.fecha, c.nombre AS cliente, u.nombre AS usuario, v.total
    FROM ventas v
    JOIN clientes c ON v.id_cliente = c.id_cliente
    JOIN usuarios u ON v.id_usuario = u.id_usuario
    ORDER BY v.fecha DESC
  `);
});

router.get('/compras.csv', async (req, res) => {
  await exportarCSV(req, res, 'compras', `
    SELECT c.id_compra, c.fecha, c.proveedor, u.nombre AS usuario, c.total
    FROM compras c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    ORDER BY c.fecha DESC
  `);
});

module.exports = router;
