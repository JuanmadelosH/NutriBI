const TABS = [
  { id: 'panel', label: 'Panel' },
  { id: 'registro', label: 'Registrar datos' },
  { id: 'asistente', label: 'Asistente IA' },
  { id: 'alertas', label: 'Alertas' },
  { id: 'datos', label: 'Datos' },
];

export default function Tabs({ active, onChange }) {
  return (
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab-btn ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
