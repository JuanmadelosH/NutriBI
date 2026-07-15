import { useState } from 'react';
import { api } from '../../api/client';
import { fmtCOP, todayStr } from '../../utils/format';
import RegistroTable from './RegistroTable';

const VACIO = { fecha: todayStr(), id_insumo: '', proveedor: '', cantidad: '', costo_unitario: '' };

export default function RegistroCompras({ insumos, compras, onChange }) {
  const [form, setForm] = useState(VACIO);
  const [actualizaPrecio, setActualizaPrecio] = useState(true);

  async function submit(e) {
    e.preventDefault();
    await api.addCompra({
      fecha: form.fecha,
      id_insumo: Number(form.id_insumo),
      proveedor: form.proveedor,
      cantidad: Number(form.cantidad),
      costo_unitario: Number(form.costo_unitario),
      actualiza_precio_semanal: actualizaPrecio, // el backend usa esto para además insertar/actualizar precios_insumo
    });
    setForm(VACIO);
    onChange();
  }

  async function borrar(id) {
    await api.deleteCompra(id);
    onChange();
  }

  const ordenadas = [...compras].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Fecha</label>
            <input required type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </div>
          <div className="field">
            <label>Insumo</label>
            <select required value={form.id_insumo} onChange={(e) => setForm({ ...form, id_insumo: e.target.value })}>
              <option value="">Selecciona…</option>
              {insumos.map((i) => <option key={i.id_insumo} value={i.id_insumo}>{i.nombre} ({i.unidad})</option>)}
            </select>
          </div>
          <div className="field">
            <label>Proveedor</label>
            <input placeholder="Plaza de mercado / agricultor" value={form.proveedor}
              onChange={(e) => setForm({ ...form, proveedor: e.target.value })} />
          </div>
          <div className="field">
            <label>Cantidad</label>
            <input required type="number" min="0" step="0.01" value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
          </div>
          <div className="field">
            <label>Costo unitario pagado (COP)</label>
            <input required type="number" min="0" step="1" value={form.costo_unitario}
              onChange={(e) => setForm({ ...form, costo_unitario: e.target.value })} />
          </div>
        </div>
        <div className="field checkbox" style={{ margin: '-8px 0 14px' }}>
          <input type="checkbox" checked={actualizaPrecio} onChange={(e) => setActualizaPrecio(e.target.checked)} />
          <label style={{ margin: 0, textTransform: 'none', fontFamily: 'var(--font-body)', fontSize: 12.5 }}>
            Actualizar el precio semanal de este insumo con este costo
          </label>
        </div>
        <button className="btn" type="submit">Registrar compra</button>
      </form>
      <div className="form-note">RF-05 — cada compra puede alimentar automáticamente el historial de precios semanales.</div>
      <RegistroTable
        rows={ordenadas}
        idField="id_compra"
        onDelete={borrar}
        cols={[
          ['fecha', 'Fecha'], ['insumo', 'Insumo'], ['proveedor', 'Proveedor'], ['cantidad', 'Cant.'],
          ['costo_unitario', 'Costo unit.', fmtCOP], ['monto_total', 'Total', fmtCOP],
        ]}
      />
    </div>
  );
}
