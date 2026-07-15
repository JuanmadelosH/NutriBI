import { fmtCOP } from '../utils/format';

// Cada producto debe venir con costoReal ya calculado por el backend (RF-06),
// por ejemplo agregando ese campo al payload de GET /productos, o combinando
// con el resultado de GET /costeo/producto/:id.
export default function ProductGrid({ productos }) {
  if (!productos || productos.length === 0) {
    return <div className="empty-state">Registra tus productos para ver la ficha de costeo.</div>;
  }
  return (
    <div className="prod-grid">
      {productos.map((p) => {
        const costo = p.costoReal ?? 0;
        const margenPct = p.precio_venta ? ((p.precio_venta - costo) / p.precio_venta) * 100 : 0;
        return (
          <div className="prod-tag" key={p.id_producto}>
            <div className="p-name">{p.nombre}</div>
            <div className="p-row"><span>Precio venta</span><span>{fmtCOP(p.precio_venta)}</span></div>
            <div className="p-row"><span>Costo real</span><span>{fmtCOP(costo)}</span></div>
            <div className="p-row">
              <span>Margen</span>
              <span className={`p-margin ${margenPct >= 0 ? 'good' : 'bad'}`}>{margenPct.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
