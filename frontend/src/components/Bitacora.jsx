export default function Bitacora({ consultas }) {
  return (
    <div className="panel">
      <h2>Bitácora de consultas</h2>
      <p className="panel-sub">Registro de trazabilidad (RNF-06) — cada consulta generada y ejecutada</p>
      {(!consultas || consultas.length === 0) ? (
        <div className="empty-state">Aún no hay consultas registradas.</div>
      ) : (
        [...consultas].reverse().map((c) => (
          <div className="bitacora-row" key={c.id_consulta}>
            <div className="b-q">&quot;{c.pregunta}&quot;</div>
            <div className="b-meta">
              {c.fecha_hora} · usuario {c.id_usuario} · <code>{c.sql_generado?.slice(0, 90)}{c.sql_generado?.length > 90 ? '…' : ''}</code>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
