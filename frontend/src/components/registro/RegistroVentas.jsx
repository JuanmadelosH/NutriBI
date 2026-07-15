import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { fmtCOP, todayStr } from '../../utils/format';
import { costoProductoEnFecha } from '../../utils/metrics';
import RegistroTable from './RegistroTable';

const VACIO = { fecha: todayStr(), id_producto: '', id_cliente: '', cantidad: '', precio_unitario: '' };

export default function RegistroVentas({ productos, clientes, recetas, preciosInsumo, ventas, onChange }) {
  const [form, setForm] = useState(VACIO);
  const [costoAuto, setCostoAuto] = useState(0);

  useEffect(() => {
    if (!form.id_producto || !form.fecha) { setCostoAuto(0); return; }
    const costo = costoProductoEnFecha(Number(form.id_producto), new Date(`${form.fecha}T00:00:00Z`), recetas, preciosInsumo);
    setCostoAuto(Math.round(costo));
  }, [form.id_producto, form.fecha, recetas, preciosInsumo]);

  async function submit(e) {
    e.preventDefault();
    await api.addVenta({
      fecha: form.fecha,
      id_producto: Number(form.id_producto),
      id_cliente: Number(form.id_cliente),
      cantidad: Number(form.cantidad),
      precio_unitario: Number(form.precio_unitario),
      costo_unitario: costoAuto,
    });
    setForm(VACIO);
    onChange();
  }

  async function borrar(id) {
    await api.deleteVenta(id);
    onChange();
  }

  const ordenadas = [...ventas].sort((a, b) => b.fecha.localeCompare(a.fecha));

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Fecha</label>
            <input required type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </div>
          <div className="field">
            <label>Producto</label>
            <select required value={form.id_producto} onChange={(e) => setForm({ ...form, id_producto: e.target.value })}>
              <option value="">Selecciona…</option>
              {productos.map((p) => <option key={p.id_producto} value={p.id_producto}>{p.nombre} — {p.presentacion}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Cliente</label>
            <select required value={form.id_cliente} onChange={(e) => setForm({ ...form, id_cliente: e.target.value })}>
              <option value="">Selecciona…</option>
              {clientes.map((c) => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Cantidad</label>
            <input required type="number" min="1" step="1" value={form.cantidad}
              onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
          </div>
          <div className="field">
            <label>Precio unitario (COP)</label>
            <input required type="number" min="0" step="1" value={form.precio_unitario}
              onChange={(e) => setForm({ ...form, precio_unitario: e.target.value })} />
          </div>
          <div className="field">
            <label>Costo unitario (auto)</label>
            <input type="number" readOnly style={{ opacity: 0.7 }} value={costoAuto} />
          </div>
        </div>
        <button className="btn" type="submit">Registrar venta</button>
      </form>
      <div className="form-note">
        RF-04 — el costo unitario se calcula solo a partir de la receta y el precio de insumo vigente en esa fecha (RF-06).
        Total = cantidad × precio unitario (lo calcula el backend).
      </div>
      <RegistroTable
        rows={ordenadas}
        idField="id_venta"
        onDelete={borrar}
        cols={[
          ['fecha', 'Fecha'], ['producto', 'Producto'], ['cliente', 'Cliente'], ['cantidad', 'Cant.'],
          ['precio_unitario', 'P. unit.', fmtCOP], ['costo_unitario', 'Costo unit.', fmtCOP], ['monto_total', 'Total', fmtCOP],
        ]}
      />
    </div>
  );
}
