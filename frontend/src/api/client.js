const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.reload();
    }
    let detail = '';
    try { detail = (await res.json()).error || ''; } catch { /* respuesta sin JSON */ }
    throw new Error(detail || `Error ${res.status} en ${path}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (correo, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ correo, password }) }),

  // ---- catálogos / lectura ----
  getProductos: () => request('/productos'),
  getInsumos: () => request('/insumos'),
  getPreciosInsumo: () => request('/precios-insumo'),
  getRecetas: () => request('/recetas'),
  getClientes: () => request('/clientes'),
  getVentas: () => request('/ventas'),
  getCompras: () => request('/compras'),
  getKpis: () => request('/kpis'),
  getVentasPorMes: () => request('/ventas-por-mes'),
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
    request('/consulta', { method: 'POST', body: JSON.stringify({ pregunta }) }),

  // ---- exportación (RF-14) ----
  exportarVentasUrl: () => `${BASE_URL}/exportar/ventas.csv`,
  exportarComprasUrl: () => `${BASE_URL}/exportar/compras.csv`,
};
