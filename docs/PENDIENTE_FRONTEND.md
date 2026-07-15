# Frontend — Pendientes

## Stack
React 19 + Vite 8 + JavaScript (JSX) + Chart.js

## Estado actual

El frontend tiene 15 componentes funcionales, un cliente HTTP centralizado en `api/client.js`, y 5 tabs navegables por estado. Sin embargo, hay varios problemas de conexión con el backend y faltan funcionalidades clave.

---

## 1. 🔴 Autenticación — Login + JWT

**Problema:** El frontend nunca obtiene un token JWT y nunca envía el header `Authorization: Bearer <token>`. Todas las llamadas al API fallarán con 401.

**Por hacer:**

### 1.1 Crear componente Login

```
frontend/src/components/Login.jsx
```

- Formulario con campos: correo, password
- Llamar a `POST /api/login` con `{ correo, password }`
- Guardar token y datos del usuario en `localStorage` (o `sessionStorage`)
- Redirigir al Panel principal

### 1.2 Modificar `api/client.js`

- Agregar función que lea el token de `localStorage`
- Incluir header `Authorization: Bearer ${token}` en todas las requests
- Si el response es 401, redirigir al Login (o limpiar el token)

Fragmento sugerido para `client.js`:
```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login'; // o cambiar estado global
  }
  // ... resto igual
}
```

Agregar método de login:
```js
login: (correo, password) =>
  request('/login', { method: 'POST', body: JSON.stringify({ correo, password }) }),
```

### 1.3 Modificar `App.jsx`

- Agregar estado `usuario` y `token`
- Si no hay token, mostrar `<Login />`
- Si hay token, mostrar la app normal

### 1.4 Agregar `TopBar` con info del usuario

- Mostrar nombre y rol del usuario logueado
- Botón de cerrar sesión (limpia token, recarga)

### 1.5 Persistencia

- Al recargar la página, leer token de `localStorage` y validar que sigue siendo válido (opcional: llamar a un endpoint de verificación, o simplemente asumir que el backend lo validará en cada request)

---

## 2. 🔴 Configuración — `.env` y puerto

**Problema:** No existe `frontend/.env`. El frontend por defecto apunta a `http://localhost:4000/api`, pero el backend corre en `http://localhost:3000/api`.

**Por hacer:**

Crear `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

Crear `frontend/.env.example`:
```
VITE_API_URL=http://localhost:3000/api
```

> `VITE_` es el prefijo obligatorio para variables de entorno en Vite.

---

## 3. 🟡 Ruta de asistente IA — Mismatch

**Problema:** `api/client.js` llama a `POST /api/asistente`, pero el backend tiene `POST /api/consulta`.

**Solución (elegir una):**

- **Opción A (recomendada):** Cambiar en `client.js`:
  ```js
  preguntarAsistente: (pregunta) =>
    request('/consulta', { method: 'POST', body: JSON.stringify({ pregunta }) }),
  ```
- **Opción B:** El backend agrega un alias en `/api/asistente`.

Si se elige la Opción A, también actualizar la URL en el componente `AsistenteChat.jsx`.

---

## 4. 🟡 Estados de carga y error

**Problema:** La mayoría de componentes no manejan estados `loading` ni `error` de forma visible para el usuario.

**Por hacer:**

En `App.jsx` o en cada componente que llame al API:
- Estado `loading: boolean` — mostrar spinner o skeleton
- Estado `error: string | null` — mostrar `<ErrorBanner>` con el mensaje
- El componente `ErrorBanner.jsx` ya existe, hay que usarlo consistentemente

---

## 5. 🟢 README — Reemplazar template genérico

**Problema:** `frontend/README.md` es el template automático de Vite ("React + TypeScript + Vite").

**Por hacer:**

Reemplazar con contenido propio de NutriBI:
- Nombre del proyecto
- Stack (React 19 + Vite 8 + Chart.js)
- Instalación: `cd frontend; npm install; npm run dev`
- Variables de entorno (`VITE_API_URL`)
- Scripts disponibles (`npm run dev`, `npm run build`, `npm run preview`)

---

## 6. 🟢 TypeScript — Consistencia

**Problema:** El proyecto tiene configuración de TypeScript (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`) y `vite.config.ts` está en TS, pero todos los componentes son `.jsx` (JavaScript).

**Opciones:**
- Migrar progresivamente los componentes a `.tsx` con tipos
- O eliminar la configuración TS si no se va a usar

---

## 7. Resumen de archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `src/components/Login.jsx` | **Crear** — formulario de login |
| `src/api/client.js` | **Modificar** — agregar token JWT, login, ruta `/consulta` |
| `src/App.jsx` | **Modificar** — estado de auth, render condicional Login vs App |
| `src/components/TopBar.jsx` | **Modificar** — mostrar usuario, botón cerrar sesión |
| `.env` | **Crear** — `VITE_API_URL=http://localhost:3000/api` |
| `.env.example` | **Crear** — template de variables de entorno |
| `README.md` | **Reemplazar** — contenido personalizado de NutriBI |
| `src/components/AsistenteChat.jsx` | **Revisar** — posible cambio de ruta si se elige Opción A |
| `src/components/ErrorBanner.jsx` | **Usar** — integrar en flujos con error |

---

## 8. Credenciales de prueba (para login)

| Usuario | Correo | Password | Rol |
|---------|--------|----------|-----|
| Juan Manuel Herrera | juanma@nutricampo.com.co | nutricampo123 | admin |
| Luisa Fernanda Ospina | luisa@nutricampo.com.co | nutricampo123 | operacion |
| Carlos Andres Gomez | contador@nutricampo.com.co | nutricampo123 | contador |
