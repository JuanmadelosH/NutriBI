# Plan de Desarrollo — NutriBI (BI-GenIA NutriCampo)

> **Proyecto:** Ecosistema de Business Intelligence con IA conversacional (Text-to-SQL)
> **Equipo:** 3 personas (A: Frontend, B: Backend, C: Base de Datos)
> **Duración:** 3 días
> **Stack:** React + Vite | Node.js + Express | MySQL | API de IA (Gemini)

---

## Recomendación de IA gratuita: Google Gemini API

**Opción recomendada: Google Gemini 2.5 Flash** por las siguientes razones:

| Criterio | Gemini 2.5 Flash | Groq (Llama 3.3 70B) |
|----------|------------------|----------------------|
| Free tier | 10 RPM, 1500 req/día | 30 RPM, 14000 req/día |
| Tarjeta crédito | ❌ No requiere | ❌ No requiere |
| Precisión Text-to-SQL | 🥇 Líder en benchmark BIRD (80%) | 🥈 Bueno pero inferior |
| Español | ✅ Excelente | ✅ Bueno |
| Contexto | 1M tokens | 131K tokens |
| API Key | ai.google.dev | console.groq.com |

**Gemini lidera los benchmarks de Text-to-SQL** (Gemini-SQL2: 80.04% en BIRD, superando a GPT-5.5 y Claude). Además entiende español natural perfectamente.

> **Alternativa:** Si prefieren velocidad, Groq es más rápido. Pero para precisión en SQL, Gemini es mejor.

---

## Estructura del repositorio

```
NutriBI/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ResultTable.jsx
│   │   │   ├── ResultChart.jsx
│   │   │   ├── HistorySidebar.jsx
│   │   │   └── MetricCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── consulta.js
│   │   ├── controllers/
│   │   │   └── consultaController.js
│   │   ├── services/
│   │   │   ├── aiService.js      # Llamada a Gemini API
│   │   │   └── dbService.js      # Conexión MySQL
│   │   ├── middleware/
│   │   │   └── validateSQL.js    # Validación solo SELECT
│   │   └── index.js              # Entry point
│   ├── .env                      # API_KEY + DB_CONFIG
│   └── package.json
├── database/
│   ├── schema.sql                # 8 tablas + relaciones
│   └── seed.sql                  # Datos de prueba
├── docs/
│   └── PLAN_DESARROLLO_3DIAS.md
├── .gitignore
└── README.md
```

---

## Diccionario de datos — 8 tablas (basado en la propuesta)

De la propuesta de NutriCampo S.A.S. (agroindustria de frutas), las tablas necesarias son:

| # | Tabla | Descripción |
|---|-------|-------------|
| 1 | `productos` | Catálogo de productos (pulpa congelada, mermelada, base concentrada) |
| 2 | `clientes` | Clientes B2B (restaurantes, fruterías, catering, micromercados) |
| 3 | `ventas` | Cabecera de factura de venta |
| 4 | `detalle_ventas` | Líneas de cada factura (producto, cantidad, precio) |
| 5 | `compras` | Cabecera de compra a proveedores |
| 6 | `detalle_compras` | Insumos comprados (fruta, empaques, aditivos) |
| 7 | `costos_insumos` | Histórico de precios de materia prima por período |
| 8 | `usuarios` | Usuarios del sistema (dirección familiar) |

---

## Preguntas de negocio clave (5-7)

1. ¿Cuál es mi producto más rentable?
2. ¿Qué producto redujo más su margen este mes por costo de empaque?
3. ¿Cómo han variado las ventas en los últimos 3 meses?
4. ¿Qué cliente genera más ingresos?
5. ¿Cuál es el margen de ganancia por línea de producto?
6. ¿Qué insumo ha subido más de precio este mes?
7. ¿Cuántas unidades se vendieron la semana pasada?

---

## Plan día a día

### DÍA 1 — CIMIENTOS

| Hora | Persona A (Frontend) | Persona B (Backend) | Persona C (BD) |
|------|---------------------|--------------------|----------------|
| **Bloque 1** | `npm create vite@latest frontend -- --template react` + estructura componentes | `npm init` + Express server + endpoint mock `POST /api/consulta` | Diseñar schema 8 tablas + relaciones + escribir `schema.sql` |
| **Bloque 2** | Layout base (ChatInput, HistorySidebar, ResultArea) con datos mock estáticos | Middleware CORS + dotenv + estructura de rutas/controladores | Escribir `seed.sql` (5 prod, 10 clientes, 50 ventas, costos) |
| **Bloque 3** | Chart.js (react-chartjs-2) con gráfico mock de barras | Prueba con curl/Postman del endpoint mock | Ejecutar schema + seed en MySQL. Probar 3 consultas manuales |
| **Entregable** | Frontend maquetado visualmente | Backend funcional (respuesta hardcodeada) | BD con datos + consultas probadas |

### DÍA 2 — LÓGICA REAL

| Hora | Persona A (Frontend) | Persona B (Backend) | Persona C (BD) |
|------|---------------------|--------------------|----------------|
| **Bloque 1** | Conectar frontend a `POST /api/consulta` (fetch) | Conexión MySQL con `mysql2/promise`. Endpoint ejecuta SQL real | Ayudar a B con consultas SQL (JOINs, GROUP BY, agregaciones) |
| **Bloque 2** | Renderizar tabla con datos reales + estados loading/error | Integrar Gemini API: prompt con esquema BD → genera SQL | Revisar y ajustar prompt de IA para mejor precisión SQL |
| **Bloque 3** | Gráficos dinámicos con datos reales (Chart.js) | Pipeline completo: pregunta → IA → SQL → ejecutar → datos + explicación | Probar preguntas 1-4 y corregir errores |
| **Entregable** | App muestra datos reales en tabla + gráfico | Endpoint funcional con IA integrada | Consultas verificadas con datos correctos |

### DÍA 3 — SEGURIDAD + POLISH + DEMO

| Hora | Persona A (Frontend) | Persona B (Backend) | Persona C (BD) |
|------|---------------------|--------------------|----------------|
| **Bloque 1** | Historial de consultas, diseño responsive, formato moneda/miles | Validación SQL (solo SELECT), rate limiting, manejo errores IA | Backup del schema. Vistas si hacen falta |
| **Bloque 2** | Loader Skeleton, mensajes de error bonitos, íconos | Logging, timeout IA, .env.example, documentación API | Prueba completa (preguntas 1-7) |
| **Bloque 3** | Prueba integral + ajustes finales. README con captura de pantalla | Integración final + deploy (o preparación) | Documentación de tablas + relaciones |
| **Entregable** | App completa funcional | Backend seguro + documentado | BD documentada + probada |

---

## Contrato del endpoint (Frontend ↔ Backend)

```
POST /api/consulta
Content-Type: application/json

Request:
{
  "pregunta": "¿cuál es mi producto más rentable?"
}

Response (200):
{
  "sql": "SELECT p.nombre, SUM(dv.subtotal) - SUM(dv.costo_total) AS margen FROM productos p JOIN detalle_ventas dv ON p.id = dv.producto_id GROUP BY p.id ORDER BY margen DESC LIMIT 1",
  "datos": [
    { "nombre": "Pulpa de Mango", "margen": 12500000 }
  ],
  "respuesta": "Tu producto más rentable es la Pulpa de Mango, con un margen de $12,500,000 en el último mes."
}

Response (400 - SQL inválido):
{
  "error": "La consulta generada no es válida o contiene operaciones no permitidas."
}

Response (500 - Error interno):
{
  "error": "Ocurrió un error al procesar tu consulta. Intenta de nuevo."
}
```

---

## Seguridad — NO negociable

- [ ] `.env` en `.gitignore` desde el primer commit
- [ ] Validar que el SQL generado solo contiene SELECT (rechazar INSERT, UPDATE, DELETE, DROP, ALTER)
- [ ] Usar `mysql2/promise` con parámetros escapados
- [ ] Rate limiting en el endpoint (`express-rate-limit`)
- [ ] No exponer la API key de Gemini en el frontend

---

## Enlaces útiles

| Recurso | URL |
|---------|-----|
| Google AI Studio (API Key Gemini) | https://ai.google.dev |
| Gemini API docs | https://ai.google.dev/gemini-api/docs |
| Gemini Text-to-SQL prompt guide | https://ai.google.dev/gemini-api/docs/text-to-sql |
| MySQL Workbench | https://www.mysql.com/products/workbench/ |
| Chart.js | https://www.chartjs.org/ |
| react-chartjs-2 | https://react-chartjs-2.js.org/ |
| Express | https://expressjs.com/ |
| mysql2 | https://www.npmjs.com/package/mysql2 |
| Repositorio | https://github.com/JuanmadelosH/NutriBI |
