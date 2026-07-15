# NutriBI — Frontend

Panel de inteligencia de negocio conversacional para NutriCampo S.A.S.

## Stack

- **React 19** + **Vite 8**
- **Chart.js** (react-chartjs-2) — visualización de datos
- **CSS custom properties** — tema oscuro NutriCampo
- Conexión HTTP nativa (fetch) al backend Express

## Componentes

### Pantallas principales
| Componente | Descripción |
|-----------|-------------|
| `Login.jsx` | Autenticación con correo + password |
| `TopBar.jsx` | Header con marca, usuario, logout |
| `Tabs.jsx` | Navegación entre 5 secciones |
| `Panel.jsx` | Dashboard con KPIs, gráficos y grid de costeo |
| `AsistenteChat.jsx` | Chat IA conversacional |
| `Alertas.jsx` | Alertas de ventas en pérdida |
| `Datos.jsx` | Tablas de datos + exportación CSV |
| `Bitacora.jsx` | Historial de consultas IA |
| `RegistroDatos.jsx` | Contenedor con 7 sub-tabs de CRUD |

### Gráficos
| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `SalesByMonthChart.jsx` | Barras | Ventas agregadas por mes |
| `MarginByProductChart.jsx` | Barras horizontal | Margen % por producto |
| `FruitPriceChart.jsx` | Líneas múltiples | Evolución semanal precio frutas |

### Registro (CRUD)
| Componente | Recurso |
|-----------|---------|
| `RegistroProductos.jsx` | Productos |
| `RegistroInsumos.jsx` | Insumos |
| `RegistroPrecios.jsx` | Precios semanales de insumos |
| `RegistroRecetas.jsx` | Recetas/BOM |
| `RegistroClientes.jsx` | Clientes |
| `RegistroVentas.jsx` | Ventas |
| `RegistroCompras.jsx` | Compras |
| `RegistroTable.jsx` | Tabla genérica reutilizable |

### Utilidades
| Archivo | Descripción |
|---------|-------------|
| `api/client.js` | Cliente HTTP con JWT (23 métodos) |
| `utils/format.js` | Formato COP, fechas |
| `utils/metrics.js` | Cálculo de KPIs, costos, alertas |
| `styles/theme.css` | Sistema de diseño (tema oscuro) |
| `styles/app.css` | Estilos de componentes |

## Instalación

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abrir `http://localhost:5173`

## Variables de Entorno

```
VITE_API_URL=http://localhost:3000/api
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción en `dist/` |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint |

## Convenciones

- Archivos `.jsx` (no TypeScript)
- Estado global centralizado en `App.jsx` (sin router ni store externo)
- Cliente HTTP en `src/api/client.js`
- Tema oscuro en `src/styles/theme.css`
- Sin React Router (navegación por tabs con estado)
