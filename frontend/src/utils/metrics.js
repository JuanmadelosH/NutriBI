import { mondayOnOrBefore, fmtDate } from './format';

const $ = (v) => typeof v === 'string' ? Number(v) : v;

export function costoInsumoEnSemana(idInsumo, fecha, preciosInsumo) {
  if (!fecha || !(fecha instanceof Date) || isNaN(fecha.getTime())) return 0;
  const lunes = fmtDate(mondayOnOrBefore(fecha));
  const candidatos = preciosInsumo
    .filter((p) => p.id_insumo === idInsumo && p.semana <= lunes)
    .sort((a, b) => b.semana.localeCompare(a.semana));
  if (candidatos.length) return $(candidatos[0].costo_unitario);
  const cualquiera = preciosInsumo
    .filter((p) => p.id_insumo === idInsumo)
    .sort((a, b) => a.semana.localeCompare(b.semana));
  return cualquiera.length ? $(cualquiera[0].costo_unitario) : 0;
}

export function costoProductoEnFecha(idProducto, fecha, recetas, preciosInsumo) {
  const lineas = recetas.filter((r) => r.id_producto === idProducto);
  return lineas.reduce(
    (acc, l) => acc + $(l.cantidad) * costoInsumoEnSemana(l.id_insumo, fecha, preciosInsumo),
    0,
  );
}

export function costoFrutaProductoEnFecha(idProducto, fecha, recetas, insumos, preciosInsumo) {
  const frutaIds = insumos.filter((i) => i.tipo === 'Fruta').map((i) => i.id_insumo);
  const lineas = recetas.filter((r) => r.id_producto === idProducto && frutaIds.includes(r.id_insumo));
  return lineas.reduce(
    (acc, l) => acc + $(l.cantidad) * costoInsumoEnSemana(l.id_insumo, fecha, preciosInsumo),
    0,
  );
}

export function withCostoReal(productos, recetas, preciosInsumo) {
  const hoy = new Date();
  return productos.map((p) => ({
    ...p,
    costoReal: costoProductoEnFecha(p.id_producto, hoy, recetas, preciosInsumo),
  }));
}

export function computeVentasPorMes(ventas) {
  const meses = [...new Set(ventas.map((v) => v.fecha.slice(0, 7)))].sort();
  return meses.map((mes) => ({
    mes,
    montoTotal: ventas.filter((v) => v.fecha.slice(0, 7) === mes).reduce((a, v) => a + $(v.monto_total), 0),
  }));
}

export function computeKpis(ventas, productos, recetas, insumos, preciosInsumo) {
  if (!ventas.length) return null;
  const meses = [...new Set(ventas.map((v) => v.fecha.slice(0, 7)))].sort();
  const mesActual = meses[meses.length - 1];
  const ventasMes = ventas.filter((v) => v.fecha.slice(0, 7) === mesActual);
  const totalVentasGlobal = ventas.reduce((a, v) => a + $(v.monto_total), 0);
  const totalCostoGlobal = ventas.reduce((a, v) => a + $(v.costo_unitario) * $(v.cantidad), 0);
  const margenGlobalPct = totalVentasGlobal ? ((totalVentasGlobal - totalCostoGlobal) / totalVentasGlobal) * 100 : 0;
  const totalVentasMes = ventasMes.reduce((a, v) => a + $(v.monto_total), 0);
  const totalCostoFrutaMes = ventasMes.reduce(
    (a, v) => a + costoFrutaProductoEnFecha(v.id_producto, new Date(v.fecha), recetas, insumos, preciosInsumo) * $(v.cantidad),
    0,
  );
  const costoFrutaPctVentas = totalVentasMes ? (totalCostoFrutaMes / totalVentasMes) * 100 : 0;
  const ultimaFecha = ventas.reduce((max, v) => (v.fecha > max ? v.fecha : max), ventas[0].fecha);
  const hace30 = new Date(`${ultimaFecha}T00:00:00Z`);
  hace30.setUTCDate(hace30.getUTCDate() - 30);
  const alertas30 = ventas.filter((v) => $(v.precio_unitario) < $(v.costo_unitario) && new Date(v.fecha) >= hace30).length;

  return { mesActual, ventasMes: totalVentasMes, transaccionesMes: ventasMes.length, margenGlobalPct, totalVentasGlobal, costoFrutaPctVentas, alertas30 };
}

export function computeAlertas(ventas) {
  return ventas
    .filter((v) => $(v.precio_unitario) < $(v.costo_unitario))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function computeInsumosFruta(insumos, preciosInsumo) {
  const frutas = [...new Map(
    insumos.filter((i) => i.tipo === 'Fruta').map((i) => [i.nombre, i])
  ).values()];
  return frutas.map((i) => ({
    id_insumo: i.id_insumo,
    nombre: i.nombre,
    historial: preciosInsumo
      .filter((p) => p.nombre === i.nombre)
      .sort((a, b) => a.semana.localeCompare(b.semana)),
  }));
}
