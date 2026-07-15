# NutriBI — BI-GenIA NutriCampo

Ecosistema de **Business Intelligence con IA conversacional** para **NutriCampo S.A.S.**, empresa agroindustrial de frutas (pulpas congeladas, mermeladas y bases concentradas).

El sistema permite a directivos sin conocimientos técnicos hacer preguntas en lenguaje natural y obtener respuestas con datos reales, gráficos dinámicos y explicaciones generadas por IA.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + Vite 8 + Chart.js |
| **Backend** | Node.js + Express 5 |
| **Base de Datos** | MySQL 8 |
| **IA** | Google Gemini API (Text-to-SQL) |
| **Autenticación** | JWT + bcrypt |

---

## Funcionalidades Implementadas

### Asistente IA Conversacional
- Preguntas en español → traducción automática a SQL vía Gemini
- Modo offline con 7 consultas predefinidas (sin depender de API)
- Validación de seguridad: solo SELECT, nunca INSERT/UPDATE/DELETE
- Explicación en lenguaje natural de los resultados
- Historial de consultas con trazabilidad (bitácora)

### Dashboard & KPIs
- Ventas del mes, margen bruto global, % costo fruta sobre ventas
- Alertas de ventas con pérdida (precio venta < costo real)
- Gráfico de ventas por mes (barras)
- Gráfico de margen por producto (barras horizontal)
- Gráfico de evolución semanal del precio de frutas (líneas múltiples)
- Grid de costeo por producto con margen individual

### Gestión CRUD
- **Productos** — catálogo con categoría, presentación, precio
- **Clientes** — B2B con tipo (Restaurante, Catering, Frutería, Micromercado)
- **Ventas** — registro con detalle de productos, cantidades y costeo automático
- **Compras** — registro con detalle de insumos y actualización opcional de precios
- **Insumos** — históricos de precios semanales por tipo (fruta, empaque, aditivo)
- **Recetas** — Bill of Materials (producto ↔ insumo + cantidad)
- **Usuarios** — administración con roles y activación

### Exportación
- CSV de ventas y compras descargable

### Seguridad
- JWT con expiración de 8 horas
- 3 roles: `admin` (todo), `operacion` (ventas), `contador` (compras/insumos)
- Passwords hasheados con bcrypt
- Queries parametrizadas (sin riesgo SQL injection)
- Validación SQL solo SELECT en consultas IA
- API key de Gemini exclusivamente en backend (`backend/.env`)

---

## Estructura del Repositorio

```
NutriBI/
├── frontend/            # React + Vite + Chart.js
│   ├── src/
│   │   ├── api/         # Cliente HTTP centralizado
│   │   ├── components/  # 15 componentes + 3 charts
│   │   ├── utils/       # Formateo y métricas
│   │   └── styles/      # Tema oscuro NutriCampo
│   └── .env.example
├── backend/             # Node.js + Express 5
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/   # auth + validateSQL
│   │   ├── routes/      # 15 grupos de rutas
│   │   └── services/    # Gemini + DB + queries predefinidas
│   └── .env.example
├── database/            # MySQL
│   ├── Schema.sql       # 10 tablas con FK
│   └── Seed.sql         # Datos de prueba realistas
├── docs/                # Documentación
└── README.md
```

---

## Base de Datos (10 tablas)

| # | Tabla | Descripción |
|---|-------|-------------|
| 1 | `usuarios` | Usuarios del sistema (admin, operacion, contador) |
| 2 | `productos` | Catálogo de productos (pulpa, mermelada, base concentrada) |
| 3 | `clientes` | Clientes B2B (restaurantes, fruterías, catering) |
| 4 | `costos_insumos` | Histórico de precios de insumos por período |
| 5 | `ventas` | Cabecera de factura de venta |
| 6 | `detalle_ventas` | Líneas de cada venta (producto, cantidad, precio, costo) |
| 7 | `compras` | Cabecera de compra a proveedores |
| 8 | `detalle_compras` | Insumos comprados (cantidad, costo, subtotal) |
| 9 | `recetas` | Bill of Materials (producto → insumos) |
| 10 | `historial_consultas` | Trazabilidad de consultas IA |

---

## Instalación y Ejecución

### 1. Base de Datos

```bash
# Ejecutar en MySQL Workbench o línea de comandos:
source database/Schema.sql
source database/Seed.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales:
#   GEMINI_API_KEY=tu_key
#   DB_PASSWORD=tu_password
#   JWT_SECRET=un_secreto_seguro
npm run dev
```

Servidor en `http://localhost:3000`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abrir `http://localhost:5173`

---

## Credenciales de Prueba

| Usuario | Correo | Password | Rol |
|---------|--------|----------|-----|
| Juan Manuel Herrera | juanma@nutricampo.com.co | nutricampo123 | admin |
| Luisa Fernanda Ospina | luisa@nutricampo.com.co | nutricampo123 | operacion |
| Carlos Andres Gomez | contador@nutricampo.com.co | nutricampo123 | contador |

---

## Endpoints de la API

### Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login` | ❌ | Login, devuelve JWT |

### Consulta IA
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/consulta` | JWT | Pregunta en lenguaje natural → SQL + datos + explicación |
| POST | `/api/asistente` | JWT | Alias de `/api/consulta` |

### Reportes
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/kpis` | JWT | KPIs del mes actual |
| GET | `/api/alertas` | JWT | Alertas de insumos y ventas |
| GET | `/api/ventas-por-mes` | JWT | Ventas agregadas por mes |
| GET | `/api/consultas-ia` | JWT | Historial de consultas IA del usuario |
| GET | `/api/costeo/producto/:id` | JWT | Costo unitario de un producto según receta |
| GET | `/api/exportar/ventas.csv` | JWT | Exportar ventas a CSV |
| GET | `/api/exportar/compras.csv` | JWT | Exportar compras a CSV |

### CRUD
| Recurso | GET (todos) | GET/:id | POST | PUT | DELETE |
|---------|-------------|---------|------|-----|--------|
| `/api/productos` | Todos | Todos | admin | admin | admin |
| `/api/clientes` | Todos | Todos | admin | admin | admin |
| `/api/ventas` | Todos | Todos | admin/operacion | — | admin |
| `/api/compras` | Todos | Todos | admin/contador | — | admin |
| `/api/insumos` | Todos | Todos | admin/contador | admin/contador | admin |
| `/api/precios-insumo` | Todos | — | admin/contador | — | admin |
| `/api/recetas` | Todos | — | admin/contador | — | admin |
| `/api/usuarios` | admin | admin | admin | admin | admin |

> Todos los endpoints requieren header: `Authorization: Bearer <token>`

---

## Roles de Acceso

| Rol | Acceso |
|-----|--------|
| **admin** | CRUD completo en todas las tablas + gestión de usuarios |
| **operacion** | Lectura general + crear ventas |
| **contador** | Lectura general + crear compras + gestionar insumos y recetas |

---

## Variables de Entorno

### Backend (`backend/.env`)
```
GEMINI_API_KEY=tu_key_de_gemini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=nutribi
AI_MODEL=gemini-2.0-flash
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:3000/api
```

---

## Implementaciones Futuras

Las siguientes funcionalidades están identificadas como mejoras potenciales basadas en la propuesta original pero no implementadas en la versión actual:

- **Entrada por voz** — permitir consultas por micrófono además de texto
- **Orquestador tipo LangChain** — pipeline más robusto con manejo de contexto multi-turno
- **Extracción automática desde software contable** — conectar directamente con el sistema de facturación electrónica para poblar el Data Warehouse sin intervención manual
- **Módulo de cumplimiento regulatorio** — gestión de estándares INVIMA (registros sanitarios, trazabilidad lote) y reportes DIAN
- **Rate limiting** — protección del endpoint IA contra abuso (`express-rate-limit`)
- **Indicadores de impacto** — dashboard con métricas TLDF (tiempo de latencia en decisiones), TATI (tasa de adopción), MUBG (optimización de margen) e IPDT (pérdidas por desactualización de tarifas)
- **Proyecciones predictivas** — análisis de tendencias con modelos ML para anticipar fluctuaciones de precios de insumos

---

## Equipo

- **Persona A** — Frontend
- **Persona B** — Backend
- **Persona C** — Base de Datos

---

## Licencia

Proyecto académico — Sistemas de Información e Informática Industrial, Julio 2026.
