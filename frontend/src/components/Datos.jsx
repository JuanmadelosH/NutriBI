import { fmtCOP } from '../utils/format';
import { api } from '../api/client';

function Tabla({ rows, cols }) {
  if (!rows.length) return <div className="empty-state">Sin registros todavía.</div>;
  return (
    <table className="datatable">
      <thead>
        <tr>{cols.map((c) => <th key={c[0]}>{c[1]}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {cols.map((c) => (
              <td key={c[0]}>{c[2] ? c[2](r[c[0]]) : r[c[0]]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Datos({ ventas, compras }) {
  const ventasCols = [
    ['fecha', 'Fecha'], ['producto', 'Producto'], ['cliente', 'Cliente'], ['cantidad', 'Cant.'],
    ['precio_unitario', 'P. unit.', fmtCOP], ['costo_unitario', 'Costo unit.', fmtCOP], ['monto_total', 'Total', fmtCOP],
  ];
  const comprasCols = [
    ['fecha', 'Fecha'], ['insumo', 'Insumo'], ['proveedor', 'Proveedor'], ['cantidad', 'Cant.'],
    ['costo_unitario', 'Costo unit.', fmtCOP], ['monto_total', 'Total', fmtCOP],
  ];
  const ventasOrdenadas = [...ventas].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const comprasOrdenadas = [...compras].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div>
      <div className="panel">
        <h2>Exportar movimientos</h2>
        <p className="panel-sub">Para uso del contador externo (RF-14)</p>
        <div className="export-row">
          <a className="btn secondary" href={api.exportarVentasUrl()}>↓ ventas.csv</a>
          <a className="btn secondary" href={api.exportarComprasUrl()}>↓ compras.csv</a>
        </div>
      </div>
      <div className="two-col">
        <div className="panel">
          <h2>Ventas (todas)</h2>
          <div className="table-scroll"><Tabla rows={ventasOrdenadas} cols={ventasCols} /></div>
        </div>
        <div className="panel">
          <h2>Compras (todas)</h2>
          <div className="table-scroll"><Tabla rows={comprasOrdenadas} cols={comprasCols} /></div>
        </div>
      </div>
    </div>
  );
}
