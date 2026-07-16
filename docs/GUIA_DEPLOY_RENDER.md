# Guía de Despliegue en Render

## BI-GenIA NutriCampo (NutriBI)

---

## Stack en Render

| Servicio | Tipo | Tecnología |
|----------|------|------------|
| Backend | Web Service | Node.js + Express |
| Frontend | Static Site | React + Vite (SPA) |
| Base de Datos | Externo | MySQL (Aiven / PlanetScale / Render) |

---

## Requisitos Previos

Antes de desplegar, necesitas:

1. **Cuenta en Render** — https://render.com
2. **Base de datos MySQL** — Aiven (gratuito), PlanetScale (gratuito) o [Render MySQL](https://render.com/docs/databases)
3. **API Key de Gemini** — https://ai.google.dev (gratuito: 1500 req/día)
4. **Repositorio Git** con el código subido (GitHub, GitLab, o Bitbucket)

---

## Variables de Entorno

### Backend (Web Service)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `GEMINI_API_KEY` | ✅ Sí | Clave de API de Google Gemini |
| `DB_HOST` | ✅ Sí | Host del servidor MySQL |
| `DB_USER` | ✅ Sí | Usuario de MySQL |
| `DB_PASSWORD` | ✅ Sí | Contraseña de MySQL |
| `DB_NAME` | ✅ Sí | Nombre de la base de datos (`nutribi`) |
| `JWT_SECRET` | ✅ Sí | Secreto para firmar tokens JWT (Render puede generarlo automáticamente) |
| `CORS_ORIGIN` | ⚠️ Recomendada | URL del frontend (ej: `https://nutribi-frontend.onrender.com`) |
| `AI_MODEL` | ❌ Opcional | Modelo Gemini (default: `gemini-2.0-flash`) |
| `PORT` | ❌ Opcional | Render lo asigna automáticamente; no configurar |

### Frontend (Static Site)

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_API_URL` | ✅ Sí | URL del backend + `/api` (ej: `https://nutribi-backend.onrender.com/api`) |

---

## Paso a Paso

### 1. Crear la Base de Datos MySQL

**Opción A — Aiven (gratuito):**
1. Ir a https://console.aiven.io
2. Crear servicio → MySQL → Plan **Free** (1 GB, sin tarjeta)
3. Anotar: Host, Puerto, Usuario, Contraseña, Base de datos

**Opción B — Render MySQL (de pago):**
1. En Render Dashboard → New → Database → MySQL
2. Anotar las credenciales del Internal Connection String

**Poblar la base de datos:**
```bash
# Conectar a la BD remota y ejecutar los scripts
mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> < database/Schema.sql
mysql -h <DB_HOST> -u <DB_USER> -p<DB_PASSWORD> < database/Seed.sql
```

### 2. Desplegar el Backend (Web Service)

1. En Render → New Web Service → Conectar tu repositorio
2. Configurar:
   - **Name:** `nutribi-backend`
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free
3. Agregar variables de entorno (las 6 requeridas + CORS_ORIGIN)
4. Crear el servicio y esperar a que termine el build
5. Copiar la URL generada (ej: `https://nutribi-backend.onrender.com`)

### 3. Desplegar el Frontend (Static Site)

1. En Render → New Static Site → Conectar tu repositorio
2. Configurar:
   - **Name:** `nutribi-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish directory:** `frontend/dist`
3. Agregar variable de entorno:
   - `VITE_API_URL`: `https://nutribi-backend.onrender.com/api`
4. Crear el servicio
5. El frontend queda disponible en la URL generada

### 4. Método Alternativo: Blueprint (render.yaml)

Si prefieres infraestructura como código:
1. Subir el archivo `render.yaml` (incluido en el proyecto)
2. En Render → Blueprint → Conectar repositorio
3. Render leerá `render.yaml` y creará ambos servicios automáticamente
4. Después de creados, agregar manualmente las variables marcadas como `sync: false` en el Dashboard

---

## Verificación del Despliegue

```bash
# Health check del backend
curl https://nutribi-backend.onrender.com/
# → {"mensaje":"NutriBI API funcionando"}

# Login de prueba
curl -X POST https://nutribi-backend.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"juanma@nutricampo.com.co","password":"nutricampo123"}'
# → {"token":"eyJ...","usuario":{...}}
```

---

## Solución de Problemas Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| `ECONNREFUSED` al conectar BD | Host de BD incorrecto | Verificar `DB_HOST` en Render Dashboard |
| `ERR_BLOCKED_BY_CORS` | CORS_ORIGIN mal configurado | Agregar `CORS_ORIGIN` con la URL exacta del frontend |
| Frontend muestra página en blanco | VITE_API_URL incorrecta | Revisar que apunte a `https://.../api` (con `/api` al final) |
| Gemini retorna error 429 | Límite de tasa excedido | Esperar o migrar a plan pago de Gemini |
| Build falla por TypeScript | Archivos .jsx sin tipos | Ya se corrigió el script build a solo `vite build` |
| Seed falla en BD remota | Firewall bloqueando | Agregar IP de origen en Aiven o usar Render MySQL interno |

---

*Documento elaborado para la asignatura Sistemas de Información e Informática Industrial — Universidad de Caldas — Julio 2026*
