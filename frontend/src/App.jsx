import { useState, useEffect, useCallback } from 'react';
import { api } from './api/client';
import TopBar from './components/TopBar';
import Tabs from './components/Tabs';
import ErrorBanner from './components/ErrorBanner';
import Panel from './components/Panel';
import RegistroDatos from './components/RegistroDatos';
import AsistenteChat from './components/AsistenteChat';
import Bitacora from './components/Bitacora';
import Alertas from './components/Alertas';
import Datos from './components/Datos';

const VACIO = { productos: [], insumos: [], preciosInsumo: [], recetas: [], clientes: [], ventas: [], compras: [] };

export default function App() {
  const [tab, setTab] = useState('panel');
  const [data, setData] = useState(VACIO);
  const [consultas, setConsultas] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarTodo = useCallback(async () => {
    try {
      setError(null);
      const [productos, insumos, preciosInsumo, recetas, clientes, ventas, compras] = await Promise.all([
        api.getProductos(), api.getInsumos(), api.getPreciosInsumo(), api.getRecetas(),
        api.getClientes(), api.getVentas(), api.getCompras(),
      ]);
      setData({ productos, insumos, preciosInsumo, recetas, clientes, ventas, compras });
    } catch (err) {
      setError(`No se pudo conectar con el backend (${err.message}). Verifica que el servidor esté corriendo y que VITE_API_URL apunte a la URL correcta.`);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarConsultas = useCallback(async () => {
    try { setConsultas(await api.getConsultasIA()); } catch { /* opcional: el chat funciona igual sin bitácora */ }
  }, []);

  useEffect(() => { cargarTodo(); cargarConsultas(); }, [cargarTodo, cargarConsultas]);

  const hayDatos = data.productos.length > 0 || data.ventas.length > 0;

  return (
    <div className="app">
      <TopBar />
      <Tabs active={tab} onChange={setTab} />

      <ErrorBanner message={error} onRetry={cargarTodo} />

      {!error && !cargando && !hayDatos && (
        <div className="banner">
          <p>
            Todavía no has registrado información en NutriBI. Ve a <b style={{ color: 'var(--text)' }}>“Registrar datos”</b> para
            cargar tus productos, insumos, ventas y compras reales.
          </p>
        </div>
      )}

      {tab === 'panel' && <Panel data={data} />}
      {tab === 'registro' && <RegistroDatos data={data} onChange={cargarTodo} />}
      {tab === 'asistente' && (
        <>
          <AsistenteChat hayDatos={hayDatos} onNuevaConsulta={cargarConsultas} />
          <Bitacora consultas={consultas} />
        </>
      )}
      {tab === 'alertas' && <Alertas ventas={data.ventas} />}
      {tab === 'datos' && <Datos ventas={data.ventas} compras={data.compras} />}
    </div>
  );
}
