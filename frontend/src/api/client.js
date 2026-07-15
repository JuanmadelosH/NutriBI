// Cliente HTTP central. La URL base se toma de la variable de entorno VITE_API_URL
// (definida en .env — ver .env.example). Así el equipo de backend puede cambiar
// dónde corre el servidor sin tocar el código del frontend.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message || ''; } catch { /* respuesta sin JSON */ }
    throw new Error(`Error ${res.status} en ${path}${detail ? ': ' + detail : ''}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // ---- catálogos / lectura ----
  getProductos: () => request('/productos'),
  getInsumos: () => request('/insumos'),
  getPreciosInsumo: () => request('/precios-insumo'),
  getRecetas: () => request('/recetas'),
  getClientes: () => request('/clientes'),
  getVentas: () => request('/ventas'),
  getCompras: () => request('/compras'),
  getKpis: () => request('/kpis'),
  getAlertas: () => request('/alertas'),
  getConsultasIA: () => request('/consultas-ia'),

  // ---- registro (RF-01 a RF-05) ----
  addProducto: (data) => request('/productos', { method: 'POST', body: JSON.stringify(data) }),
  addInsumo: (data) => request('/insumos', { method: 'POST', body: JSON.stringify(data) }),
  addPrecioInsumo: (data) => request('/precios-insumo', { method: 'POST', body: JSON.stringify(data) }),
  addReceta: (data) => request('/recetas', { method: 'POST', body: JSON.stringify(data) }),
  addCliente: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  addVenta: (data) => request('/ventas', { method: 'POST', body: JSON.stringify(data) }),
  addCompra: (data) => request('/compras', { method: 'POST', body: JSON.stringify(data) }),

  // ---- borrado ----
  deleteProducto: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
  deleteInsumo: (id) => request(`/insumos/${id}`, { method: 'DELETE' }),
  deletePrecioInsumo: (id) => request(`/precios-insumo/${id}`, { method: 'DELETE' }),
  deleteReceta: (id) => request(`/recetas/${id}`, { method: 'DELETE' }),
  deleteCliente: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
  deleteVenta: (id) => request(`/ventas/${id}`, { method: 'DELETE' }),
  deleteCompra: (id) => request(`/compras/${id}`, { method: 'DELETE' }),

  // ---- costeo (para autocompletar costo_unitario al registrar una venta, RF-06 ----
  getCostoProducto: (idProducto, fecha) =>
    request(`/costeo/producto/${idProducto}?fecha=${fecha}`),

  // ---- asistente IA (RF-11, RF-13) ----
  preguntarAsistente: (pregunta) =>
    request('/asistente', { method: 'POST', body: JSON.stringify({ pregunta }) }),

  // ---- exportación (RF-14) ----
  exportarVentasUrl: () => `${BASE_URL}/exportar/ventas.csv`,
  exportarComprasUrl: () => `${BASE_URL}/exportar/compras.csv`,
};
