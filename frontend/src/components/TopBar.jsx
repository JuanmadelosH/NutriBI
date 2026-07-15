export default function TopBar({ usuario, onLogout }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">N</div>
        <div>
          <h1>NutriBI</h1>
          <p>NutriCampo S.A.S. · Inteligencia de negocio conversacional</p>
        </div>
      </div>
      <div className="meta">
        {usuario && (
          <div className="user-info">
            <span className="user-name">{usuario.nombre}</span>
            <span className="user-role">{usuario.rol}</span>
            <button className="btn-logout" onClick={onLogout} title="Cerrar sesión">Salir</button>
          </div>
        )}
        <div><b>Backend:</b> {import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}</div>
      </div>
    </div>
  );
}
