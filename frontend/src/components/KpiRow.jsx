import { fmtCOP } from '../utils/format';

// Espera del backend (GET /kpis) un objeto con esta forma:
// {
//   mesActual: "2026-07", ventasMes: 1234000, transaccionesMes: 18,
//   margenGlobalPct: 42.3, totalVentasGlobal: 15234000,
//   costoFrutaPctVentas: 31.2, alertas30: 4
// }
export default function KpiRow({ kpis }) {
  if (!kpis) {
    return (
      <div className="kpi-row">
        {[0, 1, 2, 3].map((i) => (
          <div className="ficha" key={i}>
            <div className="k-label">Cargando…</div>
            <div className="k-value">—</div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: `Ventas del mes (${kpis.mesActual})`,
      value: fmtCOP(kpis.ventasMes),
      sub: `${kpis.transaccionesMes} transacciones`,
      color: 'var(--mango)',
    },
    {
      label: 'Margen bruto global',
      value: `${kpis.margenGlobalPct.toFixed(1)}%`,
      sub: `sobre ${fmtCOP(kpis.totalVentasGlobal)} registrados`,
      color: 'var(--good)',
      cls: kpis.margenGlobalPct < 20 ? 'warn' : 'good',
    },
    {
      label: 'Costo de fruta / ventas (mes)',
      value: `${kpis.costoFrutaPctVentas.toFixed(1)}%`,
      sub: 'componente de materia prima',
      color: 'var(--maracuya)',
    },
    {
      label: 'Alertas activas (30 días)',
      value: kpis.alertas30,
      sub: 'ventas por debajo del costo real',
      color: 'var(--bad)',
      cls: kpis.alertas30 > 0 ? 'warn' : 'good',
    },
  ];

  return (
    <div className="kpi-row">
      {items.map((it) => (
        <div className={`ficha ${it.cls || ''}`} style={{ '--tag-color': it.color }} key={it.label}>
          <div className="k-label">{it.label}</div>
          <div className="k-value">{it.value}</div>
          <div className="k-sub">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}
