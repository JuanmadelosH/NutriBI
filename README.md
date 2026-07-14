# NutriBI — BI-GenIA NutriCampo

Ecosistema de Business Intelligence con IA conversacional para NutriCampo S.A.S. (agroindustria de frutas).

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de Datos:** MySQL
- **IA:** Gemini API (Text-to-SQL)

## Estructura

```
NutriBI/
├── frontend/          # Interfaz de usuario (React)
├── backend/           # API REST (Express)
├── database/          # Schema + datos de prueba
└── docs/              # Documentación
```

## Instalación y ejecución

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Configurar API key y DB
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Base de Datos

Ejecutar en MySQL Workbench:

1. `database/schema.sql`
2. `database/seed.sql`

## Endpoint principal

```
POST /api/consulta
{ "pregunta": "¿cuál es mi producto más rentable?" }
```

## Equipo

- Persona A — Frontend
- Persona B — Backend
- Persona C — Base de Datos
