const predefinedQueries = [
  {
    palabras: ['producto', 'rentable', 'margen', 'ganancia'],
    sql: `SELECT p.nombre,
                 SUM(dv.cantidad * (dv.precio_unitario - dv.costo_unitario)) AS margen_total,
                 COUNT(DISTINCT dv.id_venta) AS veces_vendido
          FROM productos p
          JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
          JOIN ventas v ON dv.id_venta = v.id_venta
          GROUP BY p.id_producto, p.nombre
          ORDER BY margen_total DESC
          LIMIT 5`,
  },
  {
    palabras: ['venta', 'mes', 'tendencia', 'variacion', 'historico', 'ultimo'],
    sql: `SELECT DATE_FORMAT(v.fecha, '%Y-%m') AS mes,
                 SUM(dv.subtotal) AS total_ventas,
                 COUNT(DISTINCT v.id_venta) AS num_ventas
          FROM ventas v
          JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
          WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
          GROUP BY DATE_FORMAT(v.fecha, '%Y-%m')
          ORDER BY mes`,
  },
  {
    palabras: ['cliente', 'ingreso', 'compra', 'factura'],
    sql: `SELECT c.nombre,
                 c.tipo,
                 COUNT(DISTINCT v.id_venta) AS compras_realizadas,
                 SUM(v.total) AS total_ingresos
          FROM clientes c
          JOIN ventas v ON c.id_cliente = v.id_cliente
          GROUP BY c.id_cliente, c.nombre, c.tipo
          ORDER BY total_ingresos DESC
          LIMIT 5`,
  },
  {
    palabras: ['margen', 'linea', 'producto', 'categoria', 'tipo'],
    sql: `SELECT p.categoria,
                 COUNT(DISTINCT p.id_producto) AS productos,
                 SUM(dv.subtotal) AS ingresos,
                 SUM(dv.cantidad * dv.costo_unitario) AS costos_totales,
                 (SUM(dv.subtotal) - SUM(dv.cantidad * dv.costo_unitario)) AS margen_total,
                 ROUND((SUM(dv.subtotal) - SUM(dv.cantidad * dv.costo_unitario)) / SUM(dv.subtotal) * 100, 2) AS margen_porcentaje
          FROM productos p
          JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
          JOIN ventas v ON dv.id_venta = v.id_venta
          GROUP BY p.categoria
          ORDER BY margen_total DESC`,
  },
  {
    palabras: ['insumo', 'subio', 'precio', 'costo', 'materia', 'prima'],
    sql: `SELECT ci.nombre,
                 ci.periodo,
                 ci.costo_unitario,
                 LAG(ci.costo_unitario) OVER (PARTITION BY ci.nombre ORDER BY ci.periodo) AS precio_anterior,
                 ROUND((ci.costo_unitario - LAG(ci.costo_unitario) OVER (PARTITION BY ci.nombre ORDER BY ci.periodo)) / LAG(ci.costo_unitario) OVER (PARTITION BY ci.nombre ORDER BY ci.periodo) * 100, 2) AS variacion_porcentaje
          FROM costos_insumos ci
          WHERE ci.periodo >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
          ORDER BY variacion_porcentaje DESC
          LIMIT 5`,
  },
  {
    palabras: ['unidad', 'vendio', 'semana', 'cantidad', 'volumen'],
    sql: `SELECT p.nombre,
                 SUM(dv.cantidad) AS unidades_vendidas,
                 COUNT(DISTINCT v.id_venta) AS pedidos
          FROM productos p
          JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
          JOIN ventas v ON dv.id_venta = v.id_venta
          GROUP BY p.id_producto, p.nombre
          ORDER BY unidades_vendidas DESC`,
  },
  {
    palabras: ['inventario', 'stock', 'existencia', 'disponible'],
    sql: `SELECT p.nombre,
                 p.categoria,
                 COALESCE(SUM(dv.cantidad), 0) AS total_vendido
          FROM productos p
          LEFT JOIN detalle_ventas dv ON p.id_producto = dv.id_producto
          GROUP BY p.id_producto, p.nombre, p.categoria
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
