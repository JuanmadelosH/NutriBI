import { useState } from 'react';
import { api } from '../../api/client';
import RegistroTable from './RegistroTable';

export default function RegistroRecetas({ productos, insumos, recetas, onChange }) {
  const [form, setForm] = useState({ id_producto: '', id_insumo: '', cantidad: '' });

  async function submit(e) {
    e.preventDefault();
    await api.addReceta({
      id_producto: Number(form.id_producto),
      id_insumo: Number(form.id_insumo),
      cantidad: Number(form.cantidad),
    });
    setForm({ ...form, cantidad: '' });
    onChange();
  }

  async function borrar(id) {
    await api.deleteReceta(id);
    onChange();
  }

  const conNombres = recetas.map((r) => ({
    ...r,
    producto_nombre: productos.find((p) => p.id_producto === r.id_producto)?.nombre || '—',
    insumo_nombre: insumos.find((i) => i.id_insumo === r.id_insumo)?.nombre || '—',
  }));

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Producto</label>
            <select required value={form.id_producto} onChange={(e) => setForm({ ...form, id_producto: e.target.value })}>
              <option value="">Selecciona…</option>
              {productos.map((p) => <option key={p.id_producto} value={p.id_producto}>{p.nombre} — {p.presentacion}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Insumo</label>
            <select required value={form.id_insumo} onChange={(e) => setForm({ ...form, id_insumo: e.target.value })}>
              <option value="">Selecciona…</option>
              {insumos.map((i) => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre} ({i.unidad})</option>)}
            </select>
          </div>
          <div className="field">
            <label>Cantidad por unidad de producto</label>
            <input required type="number" min="0" step="0.001" placeholder="0.6" value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
          </div>
        </div>
        <button className="btn" type="submit">Agregar línea de receta</button>
      </form>
      <div className="form-note">RF-03 — cuánto de este insumo consume una unidad del producto (mismas unidades que el insumo).</div>
      <RegistroTable
        rows={conNombres}
        idField="id_receta"
        onDelete={borrar}
        cols={[['producto_nombre', 'Producto'], ['insumo_nombre', 'Insumo'], ['cantidad', 'Cantidad']]}
      />
    </div>
  );
}
