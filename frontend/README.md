# NutriBI — Frontend

Panel de inteligencia de negocio conversacional para NutriCampo S.A.S.

## Stack

- **React 19** + **Vite 8**
- **Chart.js** (react-chartjs-2) — visualización de datos
- **CSS custom properties** — tema oscuro NutriCampo
- Conexión HTTP nativa (fetch) al backend Express

## Instalación

```bash
cd frontend
npm install
```

## Variables de entorno

Crear archivo `.env` en la raíz de `frontend/`:

```
VITE_API_URL=http://localhost:3000/api
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (http://localhost:5173) |
| `npm run build` | Compila para producción en `dist/` |
| `npm run preview` | Previsualiza la compilación de producción |

## Convenciones

- Archivos `.jsx` (no TypeScript)
- Un solo estado global en `App.jsx` (sin router ni store externo)
- Cliente HTTP centralizado en `src/api/client.js`
- Tema oscuro definido en `src/styles/theme.css`
