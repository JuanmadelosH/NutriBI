const router = require('express').Router();
const db = require('../services/dbService');

const kpis = async (req, res) => {
  const [ventas] = await db.ejecutarConsulta(`
    SELECT COUNT(*) AS total_ventas, COALESCE(SUM(total),0) AS ingresos_totales,
           COALESCE(ROUND(AVG(total),2),0) AS ticket_promedio
    FROM ventas WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())
  `);

  const [productos] = await db.ejecutarConsulta(`
    SELECT p.nombre, SUM(dv.subtotal) AS total
    FROM detalle_ventas dv JOIN productos p ON dv.id_producto = p.id_producto
    GROUP BY p.id_producto ORDER BY total DESC LIMIT 1
  `);

  const [margen] = await db.ejecutarConsulta(`
    SELECT COALESCE(SUM(dv.subtotal - dv.cantidad * dv.costo_unitario),0) AS margen_total
    FROM detalle_ventas dv
    JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE())
  `);

  const [clientes] = await db.ejecutarConsulta('SELECT COUNT(*) AS total FROM clientes');

  res.json({
    ventas_mes: ventas.total_ventas,
    ingresos_mes: ventas.ingresos_totales,
    ticket_promedio: ventas.ticket_promedio,
    margen_mes: margen.margen_total,
    producto_top: productos ? productos.nombre : null,
    total_clientes: clientes.total,
  });
};

const alertas = async (req, res) => {
  const insumosCaros = await db.ejecutarConsulta(`
    SELECT ci1.nombre, ci1.costo_unitario, ci1.periodo,
           ci2.costo_unitario AS anterior,
           ROUND((ci1.costo_unitario - ci2.costo_unitario) / ci2.costo_unitario * 100, 2) AS incremento
    FROM costos_insumos ci1
    JOIN costos_insumos ci2 ON ci1.nombre = ci2.nombre
      AND ci2.periodo = (SELECT MAX(periodo) FROM costos_insumos WHERE nombre = ci1.nombre AND periodo < ci1.periodo)
    WHERE ci1.periodo = (SELECT MAX(periodo) FROM costos_insumos)
      AND ci1.costo_unitario > ci2.costo_unitario
    ORDER BY incremento DESC LIMIT 5
  `);

  const ventasBajas = await db.ejecutarConsulta(`
    SELECT COUNT(*) AS ventas_mes, COALESCE(SUM(total),0) AS total_mes
    FROM ventas WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())
  `);

  const promedio = await db.ejecutarConsulta(`
    SELECT COALESCE(ROUND(AVG(monthly.total),2),0) AS promedio_mensual
    FROM (SELECT SUM(total) AS total FROM ventas GROUP BY YEAR(fecha), MONTH(fecha)) monthly
  `);

  res.json({
    alertas_insumos: insumosCaros.map(i =>
      `${i.nombre} subió ${i.incremento}% ($${i.anterior} → $${i.costo_unitario})`
    ),
    rendimiento_ventas: {
      mes_actual: ventasBajas.ventas_mes,
      total_mes: ventasBajas.total_mes,
      promedio_mensual_historico: promedio.promedio_mensual,
      alerta: ventasBajas.total_mes < promedio.promedio_mensual
        ? 'Las ventas del mes están por debajo del promedio histórico.'
        : 'Las ventas del mes están en línea o por encima del promedio.',
    },
  });
};

const ventasPorMes = async (req, res) => {
  const rows = await db.ejecutarConsulta(`
    SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, ROUND(SUM(total), 0) AS montoTotal
    FROM ventas GROUP BY mes ORDER BY mes
  `);
  res.json(rows);
};

router.get('/kpis', kpis);
router.get('/alertas', alertas);
router.get('/ventas-por-mes', ventasPorMes);

module.exports = router;
