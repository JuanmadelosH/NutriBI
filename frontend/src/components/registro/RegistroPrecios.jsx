import { useState } from 'react';
import { api } from '../../api/client';
import { fmtCOP, mondayOnOrBefore, fmtDate } from '../../utils/format';
import RegistroTable from './RegistroTable';

export default function RegistroPrecios({ insumos, preciosInsumo, onChange }) {
  const [form, setForm] = useState({ id_insumo: '', semana: fmtDate(mondayOnOrBefore(new Date())), costo_unitario: '' });

  async function submit(e) {
    e.preventDefault();
    await api.addPrecioInsumo({
      id_insumo: Number(form.id_insumo),
      semana: fmtDate(mondayOnOrBefore(new Date(`${form.semana}T00:00:00Z`))),
      costo_unitario: Number(form.costo_unitario),
    });
    setForm({ ...form, costo_unitario: '' });
    onChange();
  }

  async function borrar(id) {
    await api.deletePrecioInsumo(id);
    onChange();
  }

  const conNombre = [...preciosInsumo]
    .sort((a, b) => b.semana.localeCompare(a.semana))
    .map((p) => ({ ...p, insumo_nombre: insumos.find((i) => i.id_insumo === p.id_insumo)?.nombre || '—' }));

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Insumo</label>
            <select required value={form.id_insumo} onChange={(e) => setForm({ ...form, id_insumo: e.target.value })}>
              <option value="">Selecciona…</option>
              {insumos.map((i) => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre} ({i.unidad})</option>)}
            </select>
          </div>
          <div className="field">
            <label>Semana (lunes)</label>
            <input required type="date" value={form.semana} onChange={(e) => setForm({ ...form, semana: e.target.value })} />
          </div>
          <div className="field">
            <label>Costo esa semana (COP)</label>
            <input required type="number" min="0" step="1" value={form.costo_unitario}
              onChange={(e) => setForm({ ...form, costo_unitario: e.target.value })} />
          </div>
        </div>
        <button className="btn" type="submit">Registrar precio semanal</button>
      </form>
      <div className="form-note">RF-02 — captura la volatilidad semanal de la fruta y demás insumos.</div>
      <RegistroTable
        rows={conNombre}
        idField="id_precio"
        onDelete={borrar}
        cols={[['insumo_nombre', 'Insumo'], ['semana', 'Semana'], ['costo_unitario', 'Costo', fmtCOP]]}
      />
    </div>
  );
}
