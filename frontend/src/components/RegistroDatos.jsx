import { useState } from 'react';
import RegistroProductos from './registro/RegistroProductos';
import RegistroInsumos from './registro/RegistroInsumos';
import RegistroPrecios from './registro/RegistroPrecios';
import RegistroRecetas from './registro/RegistroRecetas';
import RegistroClientes from './registro/RegistroClientes';
import RegistroVentas from './registro/RegistroVentas';
import RegistroCompras from './registro/RegistroCompras';

const SUBTABS = [
  { id: 'productos', label: '1. Productos' },
  { id: 'insumos', label: '2. Insumos' },
  { id: 'precios', label: '3. Precio semanal insumo' },
  { id: 'recetas', label: '4. Recetas (BOM)' },
  { id: 'clientes', label: '5. Clientes' },
  { id: 'ventas', label: '6. Ventas' },
  { id: 'compras', label: '7. Compras' },
];

export default function RegistroDatos({ data, onChange }) {
  const [sub, setSub] = useState('productos');
  const { productos, insumos, preciosInsumo, recetas, clientes, ventas, compras } = data;

  return (
    <div className="panel">
      <h2>Registrar datos de NutriCampo</h2>
      <p className="panel-sub">Ingresa aquí la información real de la empresa. Cada registro queda guardado en el backend.</p>
      <div className="subtabs">
        {SUBTABS.map((t) => (
          <button key={t.id} className={`subtab-btn ${sub === t.id ? 'active' : ''}`} onClick={() => setSub(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {sub === 'productos' && <RegistroProductos productos={productos} onChange={onChange} />}
      {sub === 'insumos' && <RegistroInsumos insumos={insumos} onChange={onChange} />}
      {sub === 'precios' && <RegistroPrecios insumos={insumos} preciosInsumo={preciosInsumo} onChange={onChange} />}
      {sub === 'recetas' && <RegistroRecetas productos={productos} insumos={insumos} recetas={recetas} onChange={onChange} />}
      {sub === 'clientes' && <RegistroClientes clientes={clientes} onChange={onChange} />}
      {sub === 'ventas' && (
        <RegistroVentas
          productos={productos} clientes={clientes} recetas={recetas}
          preciosInsumo={preciosInsumo} ventas={ventas} onChange={onChange}
        />
      )}
      {sub === 'compras' && <RegistroCompras insumos={insumos} compras={compras} onChange={onChange} />}
    </div>
  );
}
