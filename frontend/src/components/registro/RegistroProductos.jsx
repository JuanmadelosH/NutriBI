import { useState } from 'react';
import { api } from '../../api/client';
import { fmtCOP } from '../../utils/format';
import RegistroTable from './RegistroTable';

const VACIO = { nombre: '', presentacion: '', categoria: 'Pulpa congelada', precio_venta: '', activo: true };

export default function RegistroProductos({ productos, onChange }) {
  const [form, setForm] = useState(VACIO);

  async function submit(e) {
    e.preventDefault();
    await api.addProducto({ ...form, precio_venta: Number(form.precio_venta) });
    setForm(VACIO);
    onChange();
  }

  async function borrar(id) {
    await api.deleteProducto(id);
    onChange();
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Nombre comercial</label>
            <input required placeholder="Pulpa de Mora" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Presentación</label>
            <input required placeholder="500 g" value={form.presentacion}
              onChange={(e) => setForm({ ...form, presentacion: e.target.value })} />
          </div>
          <div className="field">
            <label>Categoría</label>
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
              <option>Pulpa congelada</option><option>Mermelada</option><option>Base para jugo</option><option>Otro</option>
            </select>
          </div>
          <div className="field">
            <label>Precio de venta (COP)</label>
            <input required type="number" min="0" step="1" placeholder="6300" value={form.precio_venta}
              onChange={(e) => setForm({ ...form, precio_venta: e.target.value })} />
          </div>
          <div className="field checkbox">
            <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
            <label style={{ margin: 0, textTransform: 'none', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>Activo</label>
          </div>
        </div>
        <button className="btn" type="submit">Agregar producto</button>
      </form>
      <div className="form-note">RF-01 — presentación, categoría y precio de venta vigente.</div>
      <RegistroTable
        rows={productos}
        idField="id_producto"
        onDelete={borrar}
        cols={[
          ['nombre', 'Nombre'], ['presentacion', 'Presentación'], ['categoria', 'Categoría'],
          ['precio_venta', 'Precio venta', fmtCOP], ['activo', 'Activo', (v) => (v ? 'Sí' : 'No')],
        ]}
      />
    </div>
  );
}
