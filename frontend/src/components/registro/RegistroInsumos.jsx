import { useState } from 'react';
import { api } from '../../api/client';
import { fmtCOP } from '../../utils/format';
import RegistroTable from './RegistroTable';

const VACIO = { nombre: '', tipo: 'Fruta', unidad: '', costo_unitario: '' };

export default function RegistroInsumos({ insumos, onChange }) {
  const [form, setForm] = useState(VACIO);

  async function submit(e) {
    e.preventDefault();
    // El backend, al crear el insumo, también debe registrar este costo como
    // el primer precio semanal vigente (ver README, sección "Precio semanal").
    await api.addInsumo({ ...form, costo_unitario: Number(form.costo_unitario) });
    setForm(VACIO);
    onChange();
  }

  async function borrar(id) {
    await api.deleteInsumo(id);
    onChange();
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Nombre del insumo</label>
            <input required placeholder="Mora de Castilla" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option>Fruta</option><option>Empaque</option><option>Azúcar</option><option>Energía</option><option>Otro</option>
            </select>
          </div>
          <div className="field">
            <label>Unidad</label>
            <input required placeholder="kg" value={form.unidad}
              onChange={(e) => setForm({ ...form, unidad: e.target.value })} />
          </div>
          <div className="field">
            <label>Costo unitario inicial (COP)</label>
            <input required type="number" min="0" step="1" placeholder="3800" value={form.costo_unitario}
              onChange={(e) => setForm({ ...form, costo_unitario: e.target.value })} />
          </div>
        </div>
        <button className="btn" type="submit">Agregar insumo</button>
      </form>
      <div className="form-note">RF-02 — el costo inicial también queda como el primer precio semanal.</div>
      <RegistroTable
        rows={insumos}
        idField="id_insumo"
        onDelete={borrar}
        cols={[
          ['nombre', 'Nombre'], ['tipo', 'Tipo'], ['unidad', 'Unidad'], ['costo_unitario', 'Costo actual', fmtCOP],
        ]}
      />
    </div>
  );
}
