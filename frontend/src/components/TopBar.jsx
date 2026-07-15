export default function TopBar() {
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
        <div><b>Fuente:</b> datos ingresados por la empresa</div>
        <div><b>Backend:</b> {import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}</div>
      </div>
    </div>
  );
}
