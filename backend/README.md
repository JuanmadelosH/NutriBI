# Backend — NutriBI API

API REST de BI conversacional para NutriCampo S.A.S.

## Stack

Node.js + Express 5 + MySQL + Gemini API + JWT + bcrypt

## Estado

Completado. 22 endpoints funcionales con autenticación JWT, autorización por roles, consulta IA vía Gemini, CRUD completo, reportes y exportación CSV.

## Instalación

```bash
cd backend
npm install
cp .env.example .env
# Editar credenciales en .env
npm run dev
```

Servidor en `http://localhost:3000`

## Variables de Entorno

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

## Estructura

```
src/
├── index.js               # Entry point, monta rutas
├── controllers/
│   ├── authController.js  # Login JWT
│   └── consultaController.js  # Orquestación IA → SQL → datos → explicación
├── middleware/
│   ├── auth.js            # authenticate + authorize (roles)
│   └── validateSQL.js     # Validación solo SELECT
├── services/
│   ├── aiService.js       # Gemini API + saludos
│   ├── dbService.js       # Pool MySQL + esquema
│   └── predefinedQueries.js  # 7 consultas offline
└── routes/                # 15 routers (ver tabla completa abajo)
```

## Endpoints Completos

### Autenticación
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login` | ❌ | Login con correo + password. Devuelve `{ token, usuario }` |

### Consulta IA
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/consulta` | JWT | Pregunta natural → `{ sql, datos, respuesta }` |
| POST | `/api/asistente` | JWT | Alias de `/api/consulta` |

### Reportes
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/kpis` | JWT | KPIs del mes actual |
| GET | `/api/alertas` | JWT | Alertas de insumos y ventas |
| GET | `/api/ventas-por-mes` | JWT | Ventas agregadas por mes |
| GET | `/api/consultas-ia` | JWT | Historial de consultas IA del usuario autenticado |
| GET | `/api/costeo/producto/:id?fecha=` | JWT | Costo unitario de un producto según receta + precios insumos |
| GET | `/api/exportar/ventas.csv` | JWT | Exportar ventas a CSV |
| GET | `/api/exportar/compras.csv` | JWT | Exportar compras a CSV |

### CRUD

| Recurso | GET | GET/:id | POST | PUT | DELETE |
|---------|-----|---------|------|-----|--------|
| `/api/productos` | Todos | Todos | admin | admin | admin |
| `/api/clientes` | Todos | Todos | admin | admin | admin |
| `/api/ventas` | Todos | Todos | admin/operacion | — | admin |
| `/api/compras` | Todos | Todos | admin/contador | — | admin |
| `/api/insumos` | Todos | Todos | admin/contador | admin/contador | admin |
| `/api/precios-insumo` | Todos | — | admin/contador | — | admin |
| `/api/recetas` | Todos | — | admin/contador | — | admin |
| `/api/usuarios` | admin | admin | admin | admin | admin |

> Todos requieren header: `Authorization: Bearer <token>`

## Contrato de Consulta IA

```
POST /api/consulta
Content-Type: application/json
Authorization: Bearer <token>

Request:
{ "pregunta": "¿cuál es mi producto más rentable?" }

Response 200:
{
  "sql": "SELECT ...",
  "datos": [{ ... }],
  "respuesta": "Tu producto más rentable es..."
}

Response 400:
{ "error": "La pregunta es requerida." }

Response 401:
{ "error": "Token no proporcionado." }

Response 500:
{ "error": "Ocurrió un error al procesar tu consulta." }
```

## Credenciales de Prueba

| Usuario | Correo | Password | Rol |
|---------|--------|----------|-----|
| Juan Manuel Herrera | juanma@nutricampo.com.co | nutricampo123 | admin |
| Luisa Fernanda Ospina | luisa@nutricampo.com.co | nutricampo123 | operacion |
| Carlos Andres Gomez | contador@nutricampo.com.co | nutricampo123 | contador |

## Seguridad

- [x] API key en `.env` (excluido de git)
- [x] Validación SQL solo SELECT en consultas IA
- [x] JWT con expiración de 8 horas
- [x] Autorización por roles en cada endpoint
- [x] Passwords hasheados con bcrypt (salt 10)
- [x] Queries parametrizadas (mysql2/promise)

## Mejoras Futuras

- [ ] Rate limiting en endpoint IA (`express-rate-limit`)
- [ ] Cache de consultas frecuentes
- [ ] Paginación en endpoints CRUD
- [ ] WebSocket para actualizaciones en tiempo real
