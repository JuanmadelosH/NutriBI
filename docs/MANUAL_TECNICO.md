# Manual Técnico

## BI-GenIA NutriCampo (NutriBI)

---

| | |
|---|---|
| **Proyecto** | BI-GenIA NutriCampo (NutriBI) |
| **Empresa** | NutriCampo S.A.S. |
| **Versión** | 1.0 |
| **Fecha** | Julio 2026 |
| **Destinatario** | Equipo de desarrollo y administradores del sistema |

---

## Tabla de Contenido

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Tecnologías](#2-tecnologías)
3. [Backend](#3-backend)
4. [Frontend](#4-frontend)
5. [Base de Datos](#5-base-de-datos)
6. [Modelo de Datos](#6-modelo-de-datos)
7. [API REST](#7-api-rest)
8. [Servicios](#8-servicios)
9. [Flujo de Autenticación](#9-flujo-de-autenticación)
10. [Roles y Permisos](#10-roles-y-permisos)
11. [Módulo de IA](#11-módulo-de-ia)
12. [Integración con LLM](#12-integración-con-llm)
13. [Proceso ETL](#13-proceso-etl)
14. [Diccionario de Datos](#14-diccionario-de-datos)
15. [Configuraciones](#15-configuraciones)
16. [Instalación](#16-instalación)
17. [Estructura del Proyecto](#17-estructura-del-proyecto)
18. [Manejo de Errores](#18-manejo-de-errores)
19. [Seguridad](#19-seguridad)
20. [Escalabilidad](#20-escalabilidad)
21. [Mantenimiento](#21-mantenimiento)
22. [Buenas Prácticas](#22-buenas-prácticas)

---

## 1. Arquitectura del Sistema

### 1.1 Visión General

BI-GenIA NutriCampo implementa una arquitectura de tres capas con comunicación cliente-servidor mediante API REST. El frontend, desarrollado en React, se comunica exclusivamente con el backend a través de solicitudes HTTP; no existe conexión directa entre el frontend y la base de datos ni entre el frontend y el LLM.

### 1.2 Diagrama de Arquitectura

```
┌───────────────────┐      HTTP/JSON      ┌──────────────────────┐      SQL      ┌──────────────────────┐
│                   │─────────────────────▶│                      │─────────────▶│                      │
│   Frontend React  │◀─────────────────────│   Backend Express   │◀─────────────│   MySQL 8           │
│   (Vite + Chart.js)│     JWT + CORS      │   (Node.js 18+)     │   Results    │   (Data Warehouse)  │
│                   │                      │                      │              │                      │
└───────────────────┘                      └───────┬──────────────┘              └──────────────────────┘
                                                    │
                                                    │ HTTPS
                                                    ▼
                                           ┌──────────────────┐
                                           │  Google Gemini   │
                                           │  API 2.0 Flash   │
                                           │  (LLM externo)   │
                                           └──────────────────┘
```

*Figura 1: Diagrama de arquitectura del sistema*

### 1.3 Principios Arquitectónicos

- **Separación de responsabilidades:** cada capa tiene una función específica y no invade el espacio de las demás.
- **Comunicación stateless:** el backend no mantiene estado de sesión; la autenticación se transfiere en cada solicitud mediante el token JWT.
- **Seguridad por capas:** la validación de entrada, la autenticación y la autorización se aplican en puntos independientes del flujo.
- **Resiliencia ante fallos externos:** el módulo de consultas predefinidas actúa como fallback cuando el LLM no está disponible.

---

## 2. Tecnologías

### 2.1 Stack de Desarrollo

| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Lenguaje Frontend | JavaScript (JSX) | ES2023 | Compatibilidad con React, mismo lenguaje que el backend para reducir fricción en el equipo |
| Framework Frontend | React | 19 | Biblioteca de componentes con amplio ecosistema y curva de aprendizaje moderada |
| Empaquetador | Vite | 8 | Mayor velocidad de desarrollo y compilación comparado con Create React App |
| Visualización | Chart.js | 4 | Librería liviana con soporte para renderizado responsivo |
| Entorno Backend | Node.js | 18+ | Entorno asíncrono con buen rendimiento para operaciones I/O |
| Framework Backend | Express | 5 | Framework minimalista, ampliamente documentado, compatible con Node.js |
| Base de Datos | MySQL | 8 | Sistema relacional maduro, soporte para Foreign Keys y transacciones |
| Autenticación | JWT | — | Estándar abierto para transferencia de claims entre partes, stateless |
| Hashing | bcryptjs | 3 | Algoritmo de hashing con salt incorporado, resistencia a ataques de fuerza bruta |
| LLM | Google Gemini | 2.0 Flash | Precisión líder en Text-to-SQL, capa gratuita generosa, sin necesidad de tarjeta de crédito |

### 2.2 Dependencias del Backend

| Paquete | Propósito |
|---------|-----------|
| `express` | Framework de servidor HTTP para construcción de la API REST |
| `mysql2` | Cliente MySQL con soporte para promesas y queries parametrizadas |
| `jsonwebtoken` | Creación y verificación de tokens JWT |
| `bcryptjs` | Hashing y comparación de contraseñas |
| `@google/genai` | Cliente oficial para la API de Google Gemini |
| `cors` | Middleware para control de acceso cross-origin |
| `dotenv` | Carga de variables de entorno desde archivo `.env` |
| `json2csv` | Conversión de datos JSON a formato CSV |

### 2.3 Dependencias del Frontend

| Paquete | Propósito |
|---------|-----------|
| `react` | Biblioteca base de interfaz de usuario |
| `react-dom` | Renderizador de componentes React en el DOM |
| `chart.js` | Motor de gráficos |
| `react-chartjs-2` | Adaptador de Chart.js para React |

---

## 3. Backend

### 3.1 Entry Point (`src/index.js`)

El archivo `index.js` es el punto de entrada del servidor. Su responsabilidad es:

1. Cargar las variables de entorno desde `.env` mediante `dotenv`.
2. Crear una instancia de la aplicación Express.
3. Registrar middleware global (CORS, parseo JSON).
4. Montar los quince módulos de rutas en sus respectivos prefijos.
5. Iniciar el servidor en el puerto configurado.

```javascript
// Pseudocódigo de la estructura de montaje de rutas:
// POST /api/login           → auth routes (sin autenticación)
// POST /api/consulta        → consulta routes (JWT)
// POST /api/asistente       → consulta routes (JWT, alias)
// GET/POST/PUT/DELETE /api/productos  → productos routes (JWT)
// GET/POST/PUT/DELETE /api/clientes   → clientes routes (JWT)
// GET/POST/DELETE /api/ventas         → ventas routes (JWT)
// GET/POST/DELETE /api/compras        → compras routes (JWT)
// GET/POST/PUT/DELETE /api/insumos    → insumos routes (JWT)
// GET/POST/DELETE /api/precios-insumo → preciosInsumo routes (JWT)
// GET/POST/DELETE /api/recetas        → recetas routes (JWT)
// GET/POST/PUT/DELETE /api/usuarios   → usuarios routes (JWT + admin)
// GET /api/kpis, /api/alertas, /api/ventas-por-mes → reportes routes (JWT)
// GET /api/consultas-ia               → consultasIa routes (JWT)
// GET /api/costeo/producto/:id        → costeo routes (JWT)
// GET /api/exportar/ventas.csv        → exportar routes (JWT)
```

### 3.2 Controladores

**authController.js:** recibe las credenciales del usuario, consulta la base de datos, verifica el hash de la contraseña con bcrypt y, si es correcto, genera un token JWT con los datos del usuario (id, nombre, correo, rol). El token tiene una expiración de ocho horas.

**consultaController.js:** orquesta el flujo completo de la consulta IA. Recibe la pregunta del usuario, invoca al servicio de IA para generar el SQL, valida la seguridad de la consulta, la ejecuta contra la base de datos, genera una explicación de los resultados y registra la transacción en el historial.

### 3.3 Middleware

**auth.js:** exporta dos funciones:
- `authenticate`: extrae el token del header `Authorization`, lo verifica con la clave secreta y adjunta los datos del usuario decodificados al objeto `req.usuario`.
- `authorize(...roles)`: retorna un middleware que verifica que el rol del usuario autenticado esté incluido en la lista de roles permitidos para la operación.

**validateSQL.js:** recibe una cadena de texto y verifica que cumpla dos condiciones:
1. La cadena comienza con `SELECT` (insensible a mayúsculas/minúsculas).
2. La cadena no contiene ninguna de las siguientes palabras clave: INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, CREATE, REPLACE, EXEC, EXECUTE, CALL.

Si alguna condición falla, retorna `false`; en caso contrario, `true`.

### 3.4 Servicios

**dbService.js:** mantiene un pool de conexiones MySQL (máximo 10 conexiones concurrentes) utilizando `mysql2/promise`. Expone tres funciones:
- `getPool()`: retorna el pool, creándolo lazy si no existe.
- `ejecutarConsulta(sql, params)`: ejecuta una consulta parametrizada y retorna las filas resultantes.
- `obtenerEsquema()`: consulta `INFORMATION_SCHEMA.COLUMNS` para obtener la estructura completa de la base de datos y la retorna como texto formateado para incluir en los prompts del LLM.

**aiService.js:** encapsula toda la lógica de integración con Gemini API. Incluye tres funciones principales y una función auxiliar:
- `generarSQL(pregunta)`: primero intenta encontrar una consulta predefinida. Si no hay coincidencia, construye un prompt con el esquema de la BD y llama a Gemini. Retorna el SQL generado.
- `generarExplicacion(pregunta, datos)`: envía los datos obtenidos al LLM para generar una explicación en lenguaje natural. Si la API falla, utiliza una función local de respaldo.
- `generaSaludoDespedida(pregunta)`: detecta saludos y despedidas para respuestas rápidas sin consumo del LLM.
- `llamarGemini(prompt, maxTokens)`: función auxiliar que configura y ejecuta la llamada a la API con timeout de 15 segundos y temperatura de 0.2.

**predefinedQueries.js:** contiene un arreglo de siete consultas predefinidas, cada una con un conjunto de palabras clave y su correspondiente sentencia SQL. La función `encontrarSQL` recorre el arreglo y retorna la primera coincidencia encontrada.

---

## 4. Frontend

### 4.1 Punto de Entrada (`src/main.jsx`)

Monta la aplicación React en el elemento `#root` del DOM, importando los estilos globales y envolviendo el componente principal en modo estricto de React.

### 4.2 Componente Principal (`src/App.jsx`)

Gestiona el estado global de la aplicación mediante hooks de React (`useState`, `useEffect`). Controla:

- **Estado de autenticación:** usuario y token, persistidos en `localStorage`.
- **Estado de datos:** ocho colecciones (productos, insumos, preciosInsumo, recetas, clientes, ventas, compras, ventasPorMes) cargadas desde el backend mediante `Promise.all`.
- **Estado de navegación:** pestaña activa (panel, registro, asistente, alertas, datos).
- **Estado de UI:** indicadores de carga y mensajes de error.

La función `cargarTodo()` se ejecuta cada vez que cambia el token de autenticación o cuando un componente CRUD notifica un cambio.

### 4.3 Cliente HTTP (`src/api/client.js`)

Implementa un cliente HTTP centralizado basado en la API `fetch` nativa del navegador. Características:

- Lee el token JWT de `localStorage` y lo incluye en el header `Authorization` de todas las solicitudes.
- Maneja automáticamente respuestas 401 limpiando el token y recargando la aplicación.
- Expone veintitrés métodos asíncronos que cubren todas las operaciones del backend.
- La URL base se configura mediante la variable de entorno `VITE_API_URL`.

### 4.4 Componentes de Interfaz

El frontend se organiza en quince componentes funcionales y tres componentes de gráficos, todos implementados como archivos `.jsx`. No se utiliza enrutamiento URL; la navegación entre secciones se maneja mediante un estado de pestaña.

### 4.5 Gestión de Estado

El proyecto no utiliza librerías externas de gestión de estado. Todo el estado global se concentra en `App.jsx` y se distribuye a los componentes hijos mediante props. Los callbacks de modificación fluyen de vuelta hacia `App.jsx` mediante funciones pasadas como props.

---

## 5. Base de Datos

### 5.1 Gestor de Base de Datos

MySQL 8 con motor InnoDB para todas las tablas, garantizando soporte de llaves foráneas, transacciones ACID y cascada en operaciones de eliminación.

### 5.2 Configuración de Conexión

El backend se conecta a MySQL mediante un pool de conexiones configurado en `dbService.js`:

- Host: configurable via `DB_HOST` (por defecto `localhost`).
- Puerto: 3306 (estándar MySQL).
- Usuario: configurable via `DB_USER`.
- Base de datos: configurable via `DB_NAME` (por defecto `nutribi`).
- Límite de conexiones simultáneas: 10.
- Conversión de números decimales: habilitada (`decimalNumbers: true`) para evitar errores de redondeo en valores monetarios.

---

## 6. Modelo de Datos

### 6.1 Esquema Relacional

El modelo de datos está compuesto por diez tablas interconectadas:

- `usuarios` → `ventas` (1:N, FK: id_usuario)
- `usuarios` → `compras` (1:N, FK: id_usuario)
- `usuarios` → `historial_consultas` (1:N, FK: id_usuario)
- `clientes` → `ventas` (1:N, FK: id_cliente)
- `ventas` → `detalle_ventas` (1:N, FK: id_venta, cascade delete)
- `productos` → `detalle_ventas` (1:N, FK: id_producto)
- `productos` → `recetas` (1:N, FK: id_producto, cascade delete)
- `costos_insumos` → `detalle_compras` (1:N, FK: id_insumo)
- `costos_insumos` → `recetas` (1:N, FK: id_insumo)
- `compras` → `detalle_compras` (1:N, FK: id_compra, cascade delete)

*Figura 2: Diagrama del modelo relacional*

### 6.2 Normalización

El esquema se encuentra en Tercera Forma Normal (3FN):

- Cada tabla tiene una clave primaria simple (autoincremental).
- No existen dependencias transitivas entre columnas no clave.
- Las relaciones muchos-a-muchos se resuelven mediante tablas intermedias (`detalle_ventas`, `detalle_compras`).
- `costos_insumos` almacena el histórico de precios como filas independientes, lo que permite consultas temporales sin violar la normalización.

---

## 7. API REST

### 7.1 Estilo y Convenciones

- Formato de solicitud y respuesta: JSON (excepto `/api/exportar/*.csv` que retorna texto CSV).
- Autenticación: token JWT en header `Authorization: Bearer <token>`.
- Codificación: UTF-8.
- Convención de nombres: plural y en minúsculas (`/api/productos`, no `/api/producto`).
- Parámetros de ruta: identificadores numéricos en singular (`/api/productos/:id`).

### 7.2 Endpoints de Consulta IA

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| POST | `/api/consulta` | `{ "pregunta": "string" }` | `{ "sql": "string", "datos": [], "respuesta": "string" }` |
| POST | `/api/asistente` | `{ "pregunta": "string" }` | `{ "sql": "string", "datos": [], "respuesta": "string" }` |

### 7.3 Endpoints de Reportes

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/api/kpis` | `{ ventas_mes, ingresos_mes, ticket_promedio, margen_mes, producto_top, total_clientes }` |
| GET | `/api/alertas` | `{ alertas_insumos: [], rendimiento_ventas: {} }` |
| GET | `/api/ventas-por-mes` | `[{ mes: "YYYY-MM", montoTotal: number }]` |
| GET | `/api/consultas-ia` | `[{ id_consulta, pregunta, sql_generado, respuesta, fecha }]` |
| GET | `/api/costeo/producto/:id?fecha=YYYY-MM-DD` | `{ id_producto, producto, fecha, costo_unitario, detalle: [] }` |
| GET | `/api/exportar/ventas.csv` | Archivo CSV con Content-Disposition: attachment |
| GET | `/api/exportar/compras.csv` | Archivo CSV con Content-Disposition: attachment |

### 7.4 Endpoints CRUD

Todos los endpoints CRUD siguen el mismo patrón:

| Método | Comportamiento |
|--------|---------------|
| GET `/api/{recurso}` | Listar todos los registros |
| GET `/api/{recurso}/:id` | Obtener un registro por ID |
| POST `/api/{recurso}` | Crear un nuevo registro (body en JSON) |
| PUT `/api/{recurso}/:id` | Actualizar un registro existente (body en JSON) |
| DELETE `/api/{recurso}/:id` | Eliminar un registro |

Recursos disponibles: `productos`, `clientes`, `ventas`, `compras`, `insumos`, `precios-insumo`, `recetas`, `usuarios`.

### 7.5 Manejo de Respuestas

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Respuesta exitosa con datos |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Error de validación o pregunta inválida |
| 401 | Unauthorized | Token no proporcionado, expirado o inválido |
| 403 | Forbidden | Token válido pero rol sin permisos para la operación |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

---

## 8. Servicios

### 8.1 Servicio de Base de Datos (`dbService.js`)

**Responsabilidad:** gestionar la conexión con MySQL y ejecutar consultas.

**Entradas:** sentencia SQL con o sin parámetros.

**Procesamiento:**
- Mantiene un pool de conexiones lazy (se crea en el primer uso).
- Utiliza `execute()` con parámetros posicionales para prevenir inyección SQL.
- Consulta `INFORMATION_SCHEMA` para construir la representación textual del esquema.

**Salidas:** arreglo de filas resultado de la consulta, o representación textual del esquema.

**Dependencias:** `mysql2`, variables de entorno `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### 8.2 Servicio de IA (`aiService.js`)

**Responsabilidad:** integrar con Gemini API para generar SQL y explicaciones.

**Entradas:** pregunta del usuario en lenguaje natural.

**Procesamiento:**
- Coincidencia contra consultas predefinidas (modo offline).
- Construcción de prompt con esquema de BD (cacheado 5 minutos).
- Invocación a Gemini API con timeout de 15 segundos.
- Extracción de SQL o explicación desde la respuesta del modelo.
- Generación de explicación local de respaldo si la API falla.

**Salidas:** cadena SQL o cadena de explicación.

**Dependencias:** `@google/genai`, variables de entorno `GEMINI_API_KEY`, `AI_MODEL`.

### 8.3 Servicio de Consultas Predefinidas (`predefinedQueries.js`)

**Responsabilidad:** proporcionar respuestas inmediatas sin depender de la API de IA.

**Entradas:** pregunta del usuario.

**Procesamiento:** búsqueda de palabras clave en la pregunta contra un arreglo de consultas predefinidas.

**Salidas:** objeto con la consulta SQL y el origen ('predefinida'), o null si no hay coincidencia.

**Dependencias:** ninguna externa.

---

## 9. Flujo de Autenticación

### 9.1 Proceso de Inicio de Sesión

1. El usuario ingresa su correo electrónico y contraseña en el formulario de inicio de sesión.
2. El frontend envía una solicitud `POST /api/login` con las credenciales.
3. El backend consulta la tabla `usuarios` filtrando por el correo proporcionado.
4. Si el usuario existe y está activo, se compara la contraseña ingresada con el hash almacenado usando `bcrypt.compare`.
5. Si la contraseña es correcta, se genera un token JWT con los siguientes claims:
   - `id`: identificador del usuario
   - `nombre`: nombre completo
   - `correo`: correo electrónico
   - `rol`: rol asignado (admin, operacion, contador)
   - `iat`: fecha de emisión
   - `exp`: fecha de expiración (+8 horas)
6. El backend retorna `{ token, usuario }`.
7. El frontend almacena el token y los datos del usuario en `localStorage`.

### 9.2 Proceso de Verificación de Token

1. Cada solicitud a un endpoint protegido incluye el header `Authorization: Bearer <token>`.
2. El middleware `authenticate` extrae el token, lo verifica con la clave secreta y decodifica los claims.
3. Si el token es válido, los datos del usuario se adjuntan a `req.usuario`.
4. Si el token ha expirado o es inválido, se retorna un error 401.

### 9.3 Flujo de Cierre de Sesión

1. El usuario hace clic en el botón de cerrar sesión.
2. El frontend elimina el token y los datos del usuario de `localStorage`.
3. El frontend limpia el estado global y redirige al formulario de inicio de sesión.
4. No se requiere contacto con el backend (el sistema es stateless).

---

## 10. Roles y Permisos

### 10.1 Definición de Roles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `admin` | Administrador del sistema | Acceso completo a todos los módulos y operaciones |
| `operacion` | Personal de operaciones y producción | Lectura de todas las entidades; creación de ventas |
| `contador` | Personal contable y financiero | Lectura de todas las entidades; creación de compras; gestión de insumos y recetas |

### 10.2 Matriz de Permisos

| Recurso | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| productos | todos | admin | admin | admin |
| clientes | todos | admin | admin | admin |
| ventas | todos | admin, operacion | — | admin |
| compras | todos | admin, contador | — | admin |
| insumos | todos | admin, contador | admin, contador | admin |
| precios-insumo | todos | admin, contador | — | admin |
| recetas | todos | admin, contador | — | admin |
| usuarios | admin | admin | admin | admin |
| consultas IA | todos | todos | — | — |
| reportes | todos | — | — | — |
| exportación | todos | — | — | — |

### 10.3 Implementación

La autorización se implementa mediante el middleware `authorize('admin', 'contador')` que se aplica a nivel de ruta. Si el rol del usuario autenticado no está en la lista de roles permitidos, se retorna un error 403. La protección del módulo de usuarios se aplica a nivel de montaje en `index.js`.

---

## 11. Módulo de IA

### 11.1 Arquitectura Interna

El módulo de IA se compone de tres capas:

1. **Capa de Coordinación** (`consultaController.responderConsulta`): orquesta el flujo completo.
2. **Capa de Servicio** (`aiService`): contiene la lógica de interacción con el LLM.
3. **Capa de Seguridad** (`validateSQL`): filtro de protección que previene consultas destructivas.

### 11.2 Estrategia de Cache de Esquema

El esquema de la base de datos se consulta a `INFORMATION_SCHEMA` y se cachea en memoria durante 300 segundos (5 minutos). La caché se almacena en una variable de módulo dentro de `aiService.js`. Cuando la caché expira, la siguiente solicitud refresca el esquema automáticamente.

### 11.3 Modo Offline

Cuando `generarSQL` recibe una pregunta, primero ejecuta `encontrarSQL` del módulo `predefinedQueries`. Si encuentra una coincidencia por palabras clave, utiliza la consulta predefinida sin invocar al LLM. Este mecanismo garantiza que el sistema pueda responder aunque la API de Gemini no esté disponible.

### 11.4 Control de Errores

- Timeout: 15 segundos para cada llamada a Gemini API.
- Fallo de API: si Gemini no responde, se utiliza una función local para generar explicaciones básicas.
- SQL inválido: si la validación falla, se retorna un error 400 sin ejecutar la consulta.
- Error de base de datos: se capturan excepciones de MySQL y se retorna un error 500 con mensaje genérico.

---

## 12. Integración con LLM

### 12.1 Configuración de Gemini API

La integración se realiza mediante el paquete oficial `@google/genai`. La configuración incluye:

- **API Key:** cargada desde la variable de entorno `GEMINI_API_KEY`.
- **Modelo:** configurable mediante `AI_MODEL` (por defecto `gemini-2.0-flash`).
- **Temperatura:** 0.2, para favorecer respuestas deterministas y consistentes.
- **Timeout:** 15 segundos por solicitud.

### 12.2 Estructura del Prompt de Generación SQL

```
Eres un asistente de inteligencia de negocios para NutriCampo S.A.S.,
una empresa agroindustrial de frutas en Colombia.
Genera únicamente consultas SQL SELECT.
No incluyas explicaciones, solo la consulta SQL.
Utiliza la siguiente estructura de base de datos:

[ESQUEMA DE LA BASE DE DATOS]

Pregunta del usuario: [PREGUNTA]

SQL:
```

### 12.3 Estructura del Prompt de Explicación

```
Eres un analista de negocios explicando resultados financieros.
Responde en máximo dos oraciones.
Los datos obtenidos son:

[DATOS JSON]

Pregunta original: [PREGUNTA]
```

---

## 13. Proceso ETL

### 13.1 Descripción del Proceso

En la versión actual del sistema, el proceso ETL se ejecuta de forma manual asistida por la interfaz de usuario. No existen conectores automatizados hacia el software contable externo.

### 13.2 Extracción

Los datos son ingresados por el personal administrativo a través de los formularios CRUD del sistema. Cada módulo de registro corresponde a una entidad del Data Warehouse.

### 13.3 Transformación

Las transformaciones principales ocurren en el momento del registro:

- **Cálculo de subtotales:** cantidad × precio/costo unitario en detalles de ventas y compras.
- **Costeo automático:** al registrar una venta, el sistema calcula el costo unitario del producto consultando la receta y los precios vigentes de insumos en la fecha de la venta.
- **Actualización opcional de precios:** al registrar una compra, el usuario puede optar por actualizar el precio semanal del insumo.

### 13.4 Carga

Los datos transformados se insertan en las tablas correspondientes mediante transacciones SQL. Las operaciones de ventas y compras se ejecutan dentro de transacciones que garantizan la atomicidad de la cabecera y sus detalles.

---

## 14. Diccionario de Datos

### 14.1 Tabla: `usuarios`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_usuario | INT | PK, AUTO_INCREMENT | Identificador único del usuario |
| nombre | VARCHAR(80) | NOT NULL | Nombre completo del usuario |
| correo | VARCHAR(120) | NOT NULL, UNIQUE | Correo electrónico para inicio de sesión |
| password | VARCHAR(255) | NOT NULL | Hash bcrypt de la contraseña |
| rol | ENUM('admin','operacion','contador') | NOT NULL, DEFAULT 'operacion' | Rol del usuario en el sistema |
| activo | BOOLEAN | NOT NULL, DEFAULT TRUE | Estado de actividad de la cuenta |

### 14.2 Tabla: `productos`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_producto | INT | PK, AUTO_INCREMENT | Identificador único del producto |
| nombre | VARCHAR(80) | NOT NULL | Nombre comercial del producto |
| categoria | VARCHAR(40) | NOT NULL | Categoría (pulpa, mermelada, base concentrada) |
| presentacion | VARCHAR(30) | NOT NULL | Formato de empaque (1 kg, 250 g, 1 L) |
| precio_venta | DECIMAL(10,2) | NOT NULL | Precio de venta al público |
| activo | BOOLEAN | NOT NULL, DEFAULT TRUE | Indica si el producto está activo en catálogo |

### 14.3 Tabla: `clientes`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_cliente | INT | PK, AUTO_INCREMENT | Identificador único del cliente |
| nombre | VARCHAR(100) | NOT NULL | Nombre o razón social del cliente |
| tipo | VARCHAR(40) | NOT NULL | Tipo (Restaurante, Catering, Frutería, Micromercado, Otro) |
| ciudad | VARCHAR(50) | — | Ciudad de ubicación |
| contacto | VARCHAR(80) | — | Nombre de la persona de contacto |

### 14.4 Tabla: `costos_insumos`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_insumo | INT | PK, AUTO_INCREMENT | Identificador único del insumo |
| nombre | VARCHAR(80) | NOT NULL | Nombre del insumo |
| tipo | VARCHAR(30) | NOT NULL | Tipo (Fruta, Empaque, Aditivo, Azúcar, Otro) |
| unidad | VARCHAR(15) | NOT NULL | Unidad de medida (kg, unidad, L) |
| costo_unitario | DECIMAL(10,2) | NOT NULL | Costo por unidad en la fecha del período |
| periodo | DATE | NOT NULL | Fecha de inicio del período de vigencia del precio |

### 14.5 Tabla: `ventas`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_venta | INT | PK, AUTO_INCREMENT | Identificador único de la venta |
| fecha | DATE | NOT NULL | Fecha de la transacción |
| id_cliente | INT | FK → clientes(id_cliente) | Cliente que realiza la compra |
| id_usuario | INT | FK → usuarios(id_usuario) | Usuario que registró la venta |
| total | DECIMAL(12,2) | NOT NULL, DEFAULT 0 | Monto total de la venta |

### 14.6 Tabla: `detalle_ventas`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_detalle_venta | INT | PK, AUTO_INCREMENT | Identificador único del detalle |
| id_venta | INT | FK → ventas(id_venta) ON DELETE CASCADE | Venta a la que pertenece |
| id_producto | INT | FK → productos(id_producto) | Producto vendido |
| cantidad | INT | NOT NULL | Cantidad de unidades vendidas |
| precio_unitario | DECIMAL(10,2) | NOT NULL | Precio unitario de venta |
| costo_unitario | DECIMAL(10,2) | NOT NULL | Costo unitario del producto en la fecha de venta |
| subtotal | DECIMAL(12,2) | NOT NULL | cantidad × precio_unitario |

### 14.7 Tabla: `compras`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_compra | INT | PK, AUTO_INCREMENT | Identificador único de la compra |
| fecha | DATE | NOT NULL | Fecha de la transacción |
| proveedor | VARCHAR(100) | NOT NULL | Nombre del proveedor |
| id_usuario | INT | FK → usuarios(id_usuario) | Usuario que registró la compra |
| total | DECIMAL(12,2) | NOT NULL, DEFAULT 0 | Monto total de la compra |

### 14.8 Tabla: `detalle_compras`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_detalle_compra | INT | PK, AUTO_INCREMENT | Identificador único del detalle |
| id_compra | INT | FK → compras(id_compra) ON DELETE CASCADE | Compra a la que pertenece |
| id_insumo | INT | FK → costos_insumos(id_insumo) | Insumo comprado |
| cantidad | DECIMAL(10,2) | NOT NULL | Cantidad del insumo (permite decimales) |
| costo_unitario | DECIMAL(10,2) | NOT NULL | Costo unitario pagado |
| subtotal | DECIMAL(12,2) | NOT NULL | cantidad × costo_unitario |

### 14.9 Tabla: `recetas`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_receta | INT | PK, AUTO_INCREMENT | Identificador único de la receta |
| id_producto | INT | FK → productos(id_producto) ON DELETE CASCADE | Producto asociado |
| id_insumo | INT | FK → costos_insumos(id_insumo) | Insumo utilizado |
| cantidad | DECIMAL(10,2) | NOT NULL | Cantidad del insumo requerida por unidad de producto |

### 14.10 Tabla: `historial_consultas`

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id_consulta | INT | PK, AUTO_INCREMENT | Identificador único de la consulta |
| id_usuario | INT | FK → usuarios(id_usuario) | Usuario que realizó la consulta |
| pregunta | TEXT | NOT NULL | Pregunta original en lenguaje natural |
| sql_generado | TEXT | — | Consulta SQL generada por el LLM |
| respuesta | TEXT | — | Explicación generada por el LLM |
| fecha | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha y hora de la consulta |

---

## 15. Configuraciones

### 15.1 Variables de Entorno del Backend

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `GEMINI_API_KEY` | Clave de API para Google Gemini | — |
| `DB_HOST` | Host del servidor MySQL | localhost |
| `DB_USER` | Usuario de la base de datos | root |
| `DB_PASSWORD` | Contraseña del usuario de BD | — |
| `DB_NAME` | Nombre de la base de datos | nutribi |
| `AI_MODEL` | Modelo de Gemini a utilizar | gemini-2.0-flash |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | — |
| `PORT` | Puerto del servidor Express | 3000 |

### 15.2 Variables de Entorno del Frontend

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API REST | http://localhost:3000/api |

---

## 16. Instalación

### 16.1 Requisitos Previos

- Node.js 18 o superior
- MySQL 8 o superior
- Navegador web moderno (Chrome, Firefox, Edge)
- Clave de API de Google Gemini (obtener en https://ai.google.dev)

### 16.2 Pasos de Instalación

**Paso 1: Base de Datos**

Ejecutar los scripts SQL en el siguiente orden:

```bash
mysql -u root -p < database/Schema.sql
mysql -u root -p < database/Seed.sql
```

**Paso 2: Backend**

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con las credenciales reales
npm run dev
```

**Paso 3: Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 16.3 Verificación de Instalación

1. El backend debe responder con `{ "mensaje": "NutriBI API funcionando" }` en `GET http://localhost:3000/`.
2. El frontend debe cargar el formulario de inicio de sesión en `http://localhost:5173/`.
3. Iniciar sesión con las credenciales de prueba para verificar la conexión completa.

---

## 17. Estructura del Proyecto

```
NutriBI/
├── frontend/
│   ├── public/              # Archivos estáticos (favicon, iconos)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js    # Cliente HTTP centralizado
│   │   ├── components/
│   │   │   ├── charts/      # Componentes de gráficos Chart.js
│   │   │   │   ├── SalesByMonthChart.jsx
│   │   │   │   ├── MarginByProductChart.jsx
│   │   │   │   └── FruitPriceChart.jsx
│   │   │   ├── registro/    # Formularios CRUD por entidad
│   │   │   │   ├── RegistroProductos.jsx
│   │   │   │   ├── RegistroInsumos.jsx
│   │   │   │   ├── RegistroPrecios.jsx
│   │   │   │   ├── RegistroRecetas.jsx
│   │   │   │   ├── RegistroClientes.jsx
│   │   │   │   ├── RegistroVentas.jsx
│   │   │   │   ├── RegistroCompras.jsx
│   │   │   │   └── RegistroTable.jsx
│   │   │   ├── Alertas.jsx
│   │   │   ├── AsistenteChat.jsx
│   │   │   ├── Bitacora.jsx
│   │   │   ├── Datos.jsx
│   │   │   ├── ErrorBanner.jsx
│   │   │   ├── KpiRow.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Panel.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── RegistroDatos.jsx
│   │   │   ├── ResultChart.jsx
│   │   │   ├── Tabs.jsx
│   │   │   └── TopBar.jsx
│   │   ├── utils/
│   │   │   ├── format.js    # Formateo de moneda y fechas
│   │   │   └── metrics.js   # Cálculo de KPIs y costos
│   │   ├── styles/
│   │   │   ├── theme.css    # Sistema de diseño (tema oscuro)
│   │   │   └── app.css      # Estilos de componentes
│   │   ├── App.jsx          # Componente raíz
│   │   └── main.jsx         # Punto de entrada
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── consultaController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validateSQL.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── clientes.js
│   │   │   ├── compras.js
│   │   │   ├── consulta.js
│   │   │   ├── consultasIa.js
│   │   │   ├── costeo.js
│   │   │   ├── exportar.js
│   │   │   ├── insumos.js
│   │   │   ├── preciosInsumo.js
│   │   │   ├── productos.js
│   │   │   ├── recetas.js
│   │   │   ├── reportes.js
│   │   │   ├── usuarios.js
│   │   │   └── ventas.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── dbService.js
│   │   │   └── predefinedQueries.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── Schema.sql
│   └── Seed.sql
└── docs/
    ├── DOCUMENTO_FINAL.md
    ├── MANUAL_TECNICO.md
    └── ...
```

---

## 18. Manejo de Errores

### 18.1 Estrategia General

El sistema implementa manejo de errores en tres niveles:

1. **Middleware de Express:** captura excepciones no controladas en las rutas.
2. **Try-catch en servicios:** cada servicio encapsula sus operaciones en bloques try-catch.
3. **Validación de entrada:** los datos de entrada se validan antes de ser procesados.

### 18.2 Códigos de Error en la API

| Código | Causa | Mensaje |
|--------|-------|---------|
| 400 | Pregunta vacía o SQL inválido | "La pregunta es requerida." / "La consulta generada no es válida." |
| 401 | Token faltante o expirado | "Token no proporcionado." / "Token inválido o expirado." |
| 403 | Rol sin permisos | "No tienes permisos para realizar esta acción." |
| 404 | Recurso no encontrado | "{Recurso} no encontrado." |
| 500 | Error interno | "Ocurrió un error al procesar tu consulta." |

### 18.3 Logs

El backend registra en consola los siguientes eventos:
- Inicio del servidor y puerto asignado.
- Errores de conexión a la base de datos.
- Errores de llamada a Gemini API.
- Consultas SQL generadas (para depuración).

No se implementa un sistema de logs persistente en la versión actual.

---

## 19. Seguridad

### 19.1 Controles Implementados

| Control | Descripción | Ubicación |
|---------|-------------|-----------|
| Hashing de contraseñas | bcrypt con salt de 10 rondas | authController.js |
| Autenticación JWT | Token con expiración de 8 horas | auth.js middleware |
| Autorización por roles | Middleware authorize(rol1, rol2, ...) | auth.js middleware |
| Validación SQL | Solo SELECT, sin palabras clave peligrosas | validateSQL.js middleware |
| Queries parametrizadas | Uso de parámetros posicionales en mysql2 | dbService.js |
| API key oculta | La clave de Gemini solo existe en backend/.env | aiService.js |
| Protección CORS | Middleware cors configurado | index.js |

### 19.2 Buenas Prácticas de Seguridad

- El archivo `.env` está incluido en `.gitignore` y no se sube al repositorio.
- El frontend no tiene acceso directo a la base de datos ni a la API key de Gemini.
- Las contraseñas nunca se retornan en las respuestas de la API.
- El endpoint de login no requiere autenticación previa; todos los demás endpoints sí.
- La validación SQL actúa como segunda barrera después de la generación por IA.

---

## 20. Escalabilidad

### 20.1 Limitaciones Actuales

- El pool de conexiones MySQL está limitado a 10 conexiones simultáneas.
- El esquema de base de datos no está indexado para consultas analíticas pesadas.
- No existe caché de respuestas de consultas frecuentes.
- El servidor Express se ejecuta en un solo hilo (limitación de Node.js).

### 20.2 Estrategias de Escalamiento

- **Horizontal:** el frontend estático puede servirse desde cualquier CDN; el backend puede replicarse detrás de un balanceador de carga.
- **Base de Datos:** incorporar índices compuestos en las columnas más consultadas (fecha, id_producto, id_cliente).
- **Caché:** implementar Redis para cachear resultados de consultas frecuentes y el esquema de base de datos.
- **Consulta IA:** implementar rate limiting con `express-rate-limit` para proteger el endpoint de consultas contra uso excesivo.

---

## 21. Mantenimiento

### 21.1 Tareas Rutinarias

- **Respaldo de base de datos:** programar backups periódicos del Data Warehouse mediante `mysqldump`.
- **Actualización de datos de prueba:** el archivo `Seed.sql` puede ejecutarse nuevamente para restablecer los datos a su estado inicial.
- **Rotación de API key:** renovar periódicamente la clave de Gemini API.
- **Rotación de JWT_SECRET:** cambiar la clave secreta de JWT en caso de compromiso.

### 21.2 Actualización del Sistema

Para actualizar el sistema a una nueva versión:
1. Detener el servidor backend.
2. Actualizar el código fuente desde el repositorio.
3. Ejecutar migraciones de base de datos si existen.
4. Reinstalar dependencias si cambiaron (`npm install`).
5. Reiniciar el servidor backend.

---

## 22. Buenas Prácticas

### 22.1 Código

- El código sigue una estructura de capas bien definida: rutas → controladores → servicios → middleware.
- Las variables y funciones utilizan nombres descriptivos en español, alineados con el dominio del negocio.
- Los controladores no contienen lógica de negocio; delegan en los servicios.
- Los servicios no manejan solicitudes HTTP; retornan datos o lanzan excepciones.

### 22.2 Base de Datos

- Todas las consultas utilizan parámetros posicionales, nunca concatenación de cadenas.
- Las transacciones se utilizan para operaciones que afectan múltiples tablas.
- Los identificadores son auto-incrementales, no se utilizan UUIDs para mantener la simplicidad.

### 22.3 Frontend

- Estado global centralizado en el componente raíz, evitando librerías externas innecesarias.
- Cliente HTTP único y reutilizable, no se duplica lógica de red en cada componente.
- Separación entre componentes de presentación y lógica de negocio.

---

*Documento elaborado para la asignatura Sistemas de Información e Informática Industrial — Universidad de Caldas — Julio 2026*
