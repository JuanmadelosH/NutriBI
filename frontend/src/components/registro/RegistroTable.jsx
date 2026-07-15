export default function RegistroTable({ rows, cols, idField, onDelete }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state">Sin registros todavía.</div>;
  }
  return (
    <div className="table-scroll">
      <table className="datatable">
        <thead>
          <tr>{cols.map((c) => <th key={c[0]}>{c[1]}</th>)}<th /></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[idField]}>
              {cols.map((c) => (
                <td key={c[0]}>{c[2] ? c[2](r[c[0]], r) : r[c[0]]}</td>
              ))}
              <td className="del">
                <button className="del-btn" onClick={() => onDelete(r[idField])}>borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
