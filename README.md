# NutriBI — BI-GenIA NutriCampo

Ecosistema de Business Intelligence con IA conversacional para NutriCampo S.A.S. (agroindustria de frutas).

## Stack

- **Backend:** Node.js + Express
- **Base de Datos:** MySQL
- **IA:** Gemini API (Text-to-SQL)
- **Auth:** JWT + bcrypt

## Estructura

```
NutriBI/
├── backend/           # API REST (Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── .env           # Credenciales (no se sube)
│   └── package.json
├── database/          # Schema + datos de prueba
│   ├── Schema.sql
│   └── Seed.sql
└── docs/
```

## Requisitos

- Node.js v18+
- MySQL 8+
- API key de Gemini (ai.google.dev)

## Instalación y ejecución

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

El servidor arranca en `http://localhost:3000`.

## Credenciales de prueba

| Usuario | Correo | Password | Rol |
|---------|--------|----------|-----|
| Juan Manuel Herrera | juanma@nutricampo.com.co | nutricampo123 | admin |
| Luisa Fernanda Ospina | luisa@nutricampo.com.co | nutricampo123 | operacion |
| Carlos Andres Gomez | contador@nutricampo.com.co | nutricampo123 | contador |

## Endpoints

### Autenticación

```
POST /api/login
{ "correo": "juanma@nutricampo.com.co", "password": "nutricampo123" }

Response:
{ "token": "eyJ...", "usuario": { "id": 1, "nombre": "...", "rol": "admin" } }
```

### Consulta IA (requiere token)

```
POST /api/consulta
Authorization: Bearer <token>
{ "pregunta": "¿cuál es mi producto más rentable?" }

Response:
{
  "sql": "SELECT ...",
  "datos": [ ... ],
  "respuesta": "Tu producto más rentable es..."
}
```

### CRUD

| Endpoint | Métodos | Roles |
|----------|---------|-------|
| `/api/productos` | GET (todos), POST/PUT/DELETE (admin) |
| `/api/clientes` | GET (todos), POST/PUT/DELETE (admin) |
| `/api/ventas` | GET (todos), POST (admin/operacion), DELETE (admin) |
| `/api/compras` | GET (todos), POST (admin/contador), DELETE (admin) |
| `/api/insumos` | GET (todos), POST/PUT (admin/contador), DELETE (admin) |
| `/api/usuarios` | CRUD completo (admin únicamente) |

> Todos los endpoints requieren header: `Authorization: Bearer <token>`

## Roles

| Rol | Acceso |
|-----|--------|
| **admin** | CRUD completo en todas las tablas |
| **operacion** | Lectura general + crear ventas |
| **contador** | Lectura general + crear compras + gestionar insumos |

## Seguridad

- Passwords hasheados con bcrypt
- JWT con expiración de 8 horas
- Token requerido en todos los endpoints excepto `/api/login`
- Autorización por roles en cada operación CRUD
- Validación de SQL (solo SELECT) en consultas IA
- API key de Gemini en `.env` (excluido de git)

## Variables de entorno (`.env`)

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

## Equipo

- Persona A — Frontend
- Persona B — Backend
- Persona C — Base de Datos
