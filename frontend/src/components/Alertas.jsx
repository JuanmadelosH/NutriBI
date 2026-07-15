import { fmtCOP } from '../utils/format';
import { computeAlertas } from '../utils/metrics';

export default function Alertas({ ventas }) {
  const enPerdida = computeAlertas(ventas).slice(0, 80);
  return (
    <div className="panel">
      <h2>Ventas por debajo del costo real</h2>
      <p className="panel-sub">Se dispara cuando el precio de venta fue menor al costo real del producto en esa fecha (RF-08)</p>
      {enPerdida.length === 0 ? (
        <div className="empty-state">No se han detectado ventas por debajo del costo.</div>
      ) : (
        enPerdida.map((v) => {
          const perdidaUnit = v.costo_unitario - v.precio_unitario;
          return (
            <div className="alert-row" key={v.id_venta}>
              <div className="a-date">{v.fecha}</div>
              <div className="a-prod">{v.producto}</div>
              <div className="a-cliente">{v.cliente}</div>
              <div className="a-nums">
                venta {fmtCOP(v.precio_unitario)} · costo {fmtCOP(v.costo_unitario)}<br />
                −{fmtCOP(perdidaUnit)} / unidad
              </div>
              <div className="stamp">En pérdida</div>
            </div>
          );
        })
      )}
    </div>
  );
}
