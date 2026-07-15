# Backend — Pendientes

## Stack
Node.js + Express + MySQL + Gemini API + JWT

## Estado actual

El backend tiene 22 endpoints funcionales (auth, consulta IA, CRUD de productos, clientes, ventas, compras, insumos, usuarios). Sin embargo, el frontend espera 13 rutas adicionales que no existen y hay 1 mismatch de ruta.

---

## 1. Rutas faltantes — CRUD

### `precios-insumo` (tabla `costos_insumos`)

La tabla `costos_insumos` ya existe en el schema con los campos:
`id_insumo`, `nombre`, `tipo`, `unidad`, `costo_unitario`, `periodo`

Faltan crear:

| Método | Ruta | Roles sugeridos | Descripción |
|--------|------|-----------------|-------------|
| GET | `/api/precios-insumo` | Todos | Listar precios de insumos |
| POST | `/api/precios-insumo` | admin, contador | Crear precio de insumo |
| DELETE | `/api/precios-insumo/:id` | admin | Eliminar precio de insumo |

Archivos a crear:
- `src/routes/preciosInsumo.js`
- No requiere controller separado (inline en la ruta, como los CRUD existentes)

Registrar en `src/index.js`:
```js
const preciosInsumoRoutes = require('./routes/preciosInsumo');
app.use('/api/precios-insumo', authenticate, preciosInsumoRoutes);
```

### `recetas`

**No existe tabla `recetas` en el schema de la BD.** El frontend espera:
- `GET /api/recetas`
- `POST /api/recetas`
- `DELETE /api/recetas/:id`

**Decisión requerida**: ¿Se agregará una tabla `recetas` a la BD o se elimina esta funcionalidad del frontend?

Si se agrega, la tabla necesita como mínimo:
- `id_receta INT AUTO_INCREMENT PRIMARY KEY`
- `id_producto INT NOT NULL FOREIGN KEY → productos(id_producto)`
- `id_insumo INT NOT NULL FOREIGN KEY → costos_insumos(id_insumo)`
- `cantidad DECIMAL(10,2) NOT NULL`

---

## 2. Rutas faltantes — Reportes

### `kpis`

| Método | Ruta | Roles sugeridos | Descripción |
|--------|------|-----------------|-------------|
| GET | `/api/kpis` | Todos | Indicadores clave (ventas totales, margen promedio, productos más vendidos, etc.) |

El frontend espera un endpoint que devuelva métricas agregadas. Puede implementarse como:
- Consultas SQL agregadas directas
- O usando el servicio de Gemini para generar las consultas

### `alertas`

| Método | Ruta | Roles sugeridos | Descripción |
|--------|------|-----------------|-------------|
| GET | `/api/alertas` | Todos | Alertas de negocio (insumos caros, ventas bajas, etc.) |

Lógica de negocio a implementar:
- Insumos cuyo costo_unitario subió > X% respecto al periodo anterior
- Productos con margen por debajo del umbral
- Ventas por debajo del promedio histórico

### `consultas-ia`

| Método | Ruta | Roles sugeridos | Descripción |
|--------|------|-----------------|-------------|
| GET | `/api/consultas-ia` | Todos | Historial de consultas al asistente IA |

Requiere:
- Crear tabla `historial_consultas` en la BD (o usar la existente si ya hay)
- Endpoint GET que devuelva las últimas N consultas del usuario autenticado

Estructura sugerida:
```sql
CREATE TABLE historial_consultas (
  id_consulta INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  pregunta TEXT NOT NULL,
  respuesta TEXT,
  sql_generado TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

### `costeo/producto/:id?fecha=`

| Método | Ruta | Roles sugeridos | Descripción |
|--------|------|-----------------|-------------|
| GET | `/api/costeo/producto/:id?fecha=` | Todos | Costo unitario de un producto según recetas + precios de insumos en una fecha |

Lógica requerida:
- Obtener la receta del producto (tabla `recetas`, pendiente de crear)
- Para cada insumo en la receta, obtener `costo_unitario` de `costos_insumos` con `periodo <= fecha` (el más reciente)
- Calcular costo total = Σ (cantidad_insumo × costo_unitario_insumo)
- Devolver `{ id_producto, costo_unitario, fecha }`

---

## 3. Rutas faltantes — Exportación

### `exportar/ventas.csv` y `exportar/compras.csv`

| Método | Ruta | Roles sugeridos | Descripción |
|--------|------|-----------------|-------------|
| GET | `/api/exportar/ventas.csv` | Todos | Exportar ventas a CSV |
| GET | `/api/exportar/compras.csv` | Todos | Exportar compras a CSV |

Implementar como ruta separada (no afecta a los CRUD existentes):
```js
// src/routes/exportar.js
router.get('/ventas.csv', ...)
router.get('/compras.csv', ...)
```

Registrar en `src/index.js`:
```js
const exportarRoutes = require('./routes/exportar');
app.use('/api/exportar', authenticate, exportarRoutes);
```

Requiere instalar `json2csv` o generar CSV manualmente.

---

## 4. Mismatch de ruta — Asistente IA

| Frontend llama a | Backend tiene | Acción requerida |
|---|---|---|
| `POST /api/asistente` | `POST /api/consulta` | **Opción A**: Renombrar frontend a `/consulta` |
| | | **Opción B**: Agregar alias en backend |

**Opción recomendada (B):** Agregar un alias en `src/index.js`:
```js
app.use('/api/asistente', authenticate, consultaRoutes); // alias
```
Esto evita cambiar el frontend y mantiene compatibilidad.

---

## 5. Resumen de archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `src/routes/preciosInsumo.js` | Crear (CRUD precios-insumo) |
| `src/routes/recetas.js` | Crear (CRUD recetas) — **si se crea la tabla** |
| `src/routes/exportar.js` | Crear (export CSV) |
| `src/index.js` | Modificar (registrar nuevas rutas + alias `/asistente`) |
| `database/Schema.sql` | Modificar (agregar tabla `recetas`, `historial_consultas`) |
| `src/routes/consulta.js` | Sin cambios (solo se agrega alias en index.js) |
| `package.json` | Posiblemente agregar `json2csv` |

---

## 6. Notas adicionales

- Puerto: Backend corre en `3000` (configurado en `.env`). El frontend por defecto apunta a `4000` — hay que crear `frontend/.env` con `VITE_API_URL=http://localhost:3000/api`.
- Autenticación: Todas las rutas nuevas deben usar el middleware `authenticate` para requerir JWT.
- Roles: Usar `authorize('admin', 'contador')` según corresponda (ver tabla de roles existente).
- Estilo: Seguir el patrón de los CRUD existentes (routes con handlers inline, mismo formato de respuestas).
