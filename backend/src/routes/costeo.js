const router = require('express').Router();
const db = require('../services/dbService');
const { authorize } = require('../middleware/auth');

const costeo = async (req, res) => {
  const { id } = req.params;
  const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

  const [producto] = await db.ejecutarConsulta('SELECT * FROM productos WHERE id_producto = ?', [id]);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });

  const recetas = await db.ejecutarConsulta(
    'SELECT * FROM recetas WHERE id_producto = ?', [id]
  );
  if (!recetas.length) return res.status(404).json({ error: 'El producto no tiene receta registrada.' });

  let costoTotal = 0;
  const detalle = [];

  for (const r of recetas) {
    const [insumo] = await db.ejecutarConsulta(
      'SELECT costo_unitario FROM costos_insumos WHERE id_insumo = ? AND periodo <= ? ORDER BY periodo DESC LIMIT 1',
      [r.id_insumo, fecha]
    );
    const costoInsumo = insumo ? parseFloat(insumo.costo_unitario) * parseFloat(r.cantidad) : 0;
    costoTotal += costoInsumo;
    detalle.push({
      id_insumo: r.id_insumo,
      cantidad: r.cantidad,
      costo_unitario_insumo: insumo ? insumo.costo_unitario : 0,
      subtotal: costoInsumo,
    });
  }

  res.json({
    id_producto: parseInt(id),
    producto: producto.nombre,
    fecha,
    costo_unitario: Math.round(costoTotal * 100) / 100,
    detalle,
  });
};

router.get('/producto/:id', costeo);

module.exports = router;
