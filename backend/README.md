# Backend — Persona B

## Stack
Node.js + Express + MySQL + Gemini API + JWT

## Tareas realizadas

### Día 1
- [x] Inicializar proyecto con `npm init`
- [x] Instalar dependencias: `express`, `cors`, `dotenv`, `mysql2`, `nodemon`
- [x] Crear `src/index.js` — servidor Express
- [x] Crear `src/routes/consulta.js` — ruta POST /api/consulta
- [x] Crear `src/controllers/consultaController.js` — lógica del endpoint
- [x] Crear `src/services/aiService.js` — integración con Gemini API
- [x] Crear `src/services/dbService.js` — conexión MySQL
- [x] Crear `src/middleware/validateSQL.js` — validación solo SELECT
- [x] Crear `.env` con credenciales reales
- [x] Endpoint funcional con BD real + IA

### Día 2
- [x] Integrar Gemini API (Text-to-SQL)
- [x] Pipeline: pregunta → SQL → ejecutar → datos + explicación
- [x] Pruebas con base de datos real
- [x] Cache de esquema BD
- [x] Circuit breaker + retry exponential backoff
- [x] Modo offline con consultas predefinidas

### Día 3
- [x] Autenticación JWT (login)
- [x] Autorización por roles (admin, operacion, contador)
- [x] CRUD completo para todas las tablas
- [x] Seguridad: solo SELECT en consultas IA
- [x] Documentación de la API

## Endpoints

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login` | ❌ | Login con correo + password. Devuelve JWT |

### Consulta IA

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/consulta` | JWT | Pregunta en lenguaje natural → SQL + datos + explicación |

### CRUD - Productos

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/productos` | Todos | Listar productos |
| GET | `/api/productos/:id` | Todos | Producto por ID |
| POST | `/api/productos` | admin | Crear producto |
| PUT | `/api/productos/:id` | admin | Actualizar producto |
| DELETE | `/api/productos/:id` | admin | Eliminar producto |

### CRUD - Clientes

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/clientes` | Todos | Listar clientes |
| GET | `/api/clientes/:id` | Todos | Cliente por ID |
| POST | `/api/clientes` | admin | Crear cliente |
| PUT | `/api/clientes/:id` | admin | Actualizar cliente |
| DELETE | `/api/clientes/:id` | admin | Eliminar cliente |

### CRUD - Ventas

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/ventas` | Todos | Listar ventas |
| GET | `/api/ventas/:id` | Todos | Venta por ID (con detalle) |
| POST | `/api/ventas` | admin, operacion | Crear venta (con items) |
| DELETE | `/api/ventas/:id` | admin | Eliminar venta |

### CRUD - Compras

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/compras` | Todos | Listar compras |
| GET | `/api/compras/:id` | Todos | Compra por ID (con detalle) |
| POST | `/api/compras` | admin, contador | Registrar compra (con items) |
| DELETE | `/api/compras/:id` | admin | Eliminar compra |

### CRUD - Insumos

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/insumos` | Todos | Listar insumos |
| GET | `/api/insumos/:id` | Todos | Insumo por ID |
| POST | `/api/insumos` | admin, contador | Crear insumo |
| PUT | `/api/insumos/:id` | admin, contador | Actualizar insumo |
| DELETE | `/api/insumos/:id` | admin | Eliminar insumo |

### CRUD - Usuarios

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/api/usuarios` | admin | Listar usuarios |
| GET | `/api/usuarios/:id` | admin | Usuario por ID |
| POST | `/api/usuarios` | admin | Crear usuario (con password) |
| PUT | `/api/usuarios/:id` | admin | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | admin | Eliminar usuario |

### Health

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | ❌ | Health check |

## Contrato de consulta IA

```
POST /api/consulta
Authorization: Bearer <token>
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

## Credenciales de prueba

| Usuario | Correo | Password | Rol |
|---------|--------|----------|-----|
| Juan Manuel Herrera | juanma@nutricampo.com.co | nutricampo123 | admin |
| Luisa Fernanda Ospina | luisa@nutricampo.com.co | nutricampo123 | operacion |
| Carlos Andres Gomez | contador@nutricampo.com.co | nutricampo123 | contador |

## Seguridad

- [x] API key en `.env` (nunca subir a GitHub)
- [x] Validar que el SQL solo contenga SELECT
- [x] JWT con expiración de 8 horas
- [x] Autorización por roles en cada endpoint
- [ ] Rate limiting (pendiente)
- [x] Passwords hasheados con bcrypt
