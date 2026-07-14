# Frontend — Persona A

## Stack
React + Vite + Chart.js

## Tareas

### Día 1
- [ ] Inicializar proyecto con Vite (`npm create vite@latest . -- --template react`)
- [ ] Instalar dependencias: `chart.js`, `react-chartjs-2`
- [ ] Crear layout base con componentes:
  - `ChatInput.jsx` — input de texto + botón enviar
  - `HistorySidebar.jsx` — historial de consultas
  - `ResultTable.jsx` — tabla de datos
  - `ResultChart.jsx` — gráfico (Chart.js)
  - `MetricCard.jsx` — tarjetas de métricas
- [ ] Maquetar con datos mock (simular respuesta del backend)

### Día 2
- [ ] Conectar al endpoint `POST /api/consulta` con fetch
- [ ] Renderizar datos reales en tabla
- [ ] Gráficos dinámicos según los datos
- [ ] Manejar estados: loading, error, vacío

### Día 3
- [ ] Diseño responsive
- [ ] Formato de moneda ($) y miles
- [ ] Loader/Skeleton mientras carga
- [ ] Mensajes de error amigables
- [ ] README con captura de pantalla

## Contrato con Backend

```
POST /api/consulta
{ "pregunta": "texto en español" }

Response:
{
  "sql": "SELECT ...",
  "datos": [ ... ],
  "respuesta": "explicación en español"
}
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/consulta | Enviar pregunta en lenguaje natural |
