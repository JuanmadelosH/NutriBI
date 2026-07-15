import { useState } from 'react';
import { api } from '../../api/client';
import RegistroTable from './RegistroTable';

const VACIO = { nombre: '', tipo: 'Restaurante', ciudad: '' };

export default function RegistroClientes({ clientes, onChange }) {
  const [form, setForm] = useState(VACIO);

  async function submit(e) {
    e.preventDefault();
    await api.addCliente(form );
    setForm(VACIO);
    onChange();
  }

  async function borrar(id) {
    await api.deleteCliente(id);
    onChange();
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Razón social</label>
            <input required placeholder="Restaurante La Cosecha" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option>Restaurante</option><option>Catering</option><option>Supermercado</option><option>Otro</option>
            </select>
          </div>
          <div className="field">
            <label>Ciudad</label>
            <input placeholder="Manizales" value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })} />
          </div>
        </div>
        <button className="btn" type="submit">Agregar cliente</button>
      </form>
      <RegistroTable
        rows={clientes}
        idField="id_cliente"
        onDelete={borrar}
        cols={[['nombre', 'Nombre'], ['tipo', 'Tipo'], ['ciudad', 'Ciudad']]}
      />
    </div>
  );
}
