const predefinedQueries = [
  {
    palabras: ['producto', 'rentable', 'margen', 'ganancia'],
    sql: `SELECT p.nombre, 
                 SUM(dv.cantidad * (dv.precio_unitario - p.costo_produccion)) AS margen_total,
                 COUNT(DISTINCT dv.venta_id) AS veces_vendido
          FROM productos p
          JOIN detalle_ventas dv ON p.id = dv.producto_id
          JOIN ventas v ON dv.venta_id = v.id
          GROUP BY p.id, p.nombre
          ORDER BY margen_total DESC
          LIMIT 5`,
  },
  {
    palabras: ['venta', 'mes', 'tendencia', 'variacion', 'historico', 'ultimo'],
    sql: `SELECT DATE_FORMAT(v.fecha, '%Y-%m') AS mes,
                 SUM(dv.subtotal) AS total_ventas,
                 COUNT(DISTINCT v.id) AS num_ventas
          FROM ventas v
          JOIN detalle_ventas dv ON v.id = dv.venta_id
          WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
          GROUP BY DATE_FORMAT(v.fecha, '%Y-%m')
          ORDER BY mes`,
  },
  {
    palabras: ['cliente', 'ingreso', 'compra', 'factura'],
    sql: `SELECT c.nombre,
                 c.tipo_cliente,
                 COUNT(DISTINCT v.id) AS compras_realizadas,
                 SUM(v.total) AS total_ingresos
          FROM clientes c
          JOIN ventas v ON c.id = v.cliente_id
          GROUP BY c.id, c.nombre, c.tipo_cliente
          ORDER BY total_ingresos DESC
          LIMIT 5`,
  },
  {
    palabras: ['margen', 'linea', 'producto', 'categoria', 'tipo'],
    sql: `SELECT p.tipo,
                 COUNT(DISTINCT p.id) AS productos,
                 SUM(dv.subtotal) AS ingresos,
                 SUM(dv.cantidad * p.costo_produccion) AS costos_totales,
                 (SUM(dv.subtotal) - SUM(dv.cantidad * p.costo_produccion)) AS margen_total,
                 ROUND((SUM(dv.subtotal) - SUM(dv.cantidad * p.costo_produccion)) / SUM(dv.subtotal) * 100, 2) AS margen_porcentaje
          FROM productos p
          JOIN detalle_ventas dv ON p.id = dv.producto_id
          JOIN ventas v ON dv.venta_id = v.id
          GROUP BY p.tipo
          ORDER BY margen_total DESC`,
  },
  {
    palabras: ['insumo', 'subio', 'precio', 'costo', 'materia', 'prima'],
    sql: `SELECT ci.insumo,
                 ci.fecha,
                 ci.precio_kilo,
                 LAG(ci.precio_kilo) OVER (PARTITION BY ci.insumo ORDER BY ci.fecha) AS precio_anterior,
                 ROUND((ci.precio_kilo - LAG(ci.precio_kilo) OVER (PARTITION BY ci.insumo ORDER BY ci.fecha)) / LAG(ci.precio_kilo) OVER (PARTITION BY ci.insumo ORDER BY ci.fecha) * 100, 2) AS variacion_porcentaje
          FROM costos_insumos ci
          WHERE ci.fecha >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
          ORDER BY variacion_porcentaje DESC
          LIMIT 5`,
  },
  {
    palabras: ['unidad', 'vendio', 'semana', 'cantidad', 'volumen'],
    sql: `SELECT p.nombre,
                 SUM(dv.cantidad) AS unidades_vendidas,
                 COUNT(DISTINCT v.id) AS pedidos
          FROM productos p
          JOIN detalle_ventas dv ON p.id = dv.producto_id
          JOIN ventas v ON dv.venta_id = v.id
          WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
          GROUP BY p.id, p.nombre
          ORDER BY unidades_vendidas DESC`,
  },
  {
    palabras: ['inventario', 'stock', 'existencia', 'producto', 'disponible'],
    sql: `SELECT p.nombre,
                 p.tipo,
                 COALESCE(SUM(dv.cantidad), 0) AS total_vendido
          FROM productos p
          LEFT JOIN detalle_ventas dv ON p.id = dv.producto_id
          GROUP BY p.id, p.nombre, p.tipo
          ORDER BY total_vendido DESC`,
  },
];

const encontrarSQL = (pregunta) => {
  const preguntaLower = pregunta.toLowerCase();

  for (const item of predefinedQueries) {
    const coincide = item.palabras.some((palabra) => preguntaLower.includes(palabra));
    if (coincide) {
      return { sql: item.sql, origen: 'predefinida' };
    }
  }

  return null;
};

module.exports = { encontrarSQL, predefinedQueries };
