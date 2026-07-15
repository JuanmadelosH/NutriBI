# Informe de Auditoría Técnica

## BI-GenIA NutriCampo (NutriBI)

---

| | |
|---|---|
| **Proyecto** | BI-GenIA NutriCampo (NutriBI) |
| **Empresa** | NutriCampo S.A.S. |
| **Tipo de Auditoría** | Técnica — seguridad, arquitectura y calidad de software |
| **Versión del Sistema** | 1.0 |
| **Fecha de Auditoría** | Julio 2026 |
| **Auditor** | Consultor externo independiente |
| **Clasificación** | Confidencial — uso interno del equipo de desarrollo y del cuerpo docente |

---

## Tabla de Contenido

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Alcance](#2-alcance)
3. [Metodología](#3-metodología)
4. [Evaluación de Arquitectura](#4-evaluación-de-arquitectura)
5. [Evaluación de Seguridad](#5-evaluación-de-seguridad)
6. [Evaluación de Disponibilidad](#6-evaluación-de-disponibilidad)
7. [Evaluación de Escalabilidad](#7-evaluación-de-escalabilidad)
8. [Evaluación de Calidad del Software](#8-evaluación-de-calidad-del-software)
9. [Identificación de Riesgos](#9-identificación-de-riesgos)
10. [Matriz de Riesgos](#10-matriz-de-riesgos)
11. [Hallazgos](#11-hallazgos)
12. [Recomendaciones](#12-recomendaciones)
13. [Nivel de Madurez](#13-nivel-de-madurez)
14. [Conclusiones](#14-conclusiones)

---

## 1. Resumen Ejecutivo

Se realizó una auditoría técnica al sistema BI-GenIA NutriCampo (NutriBI), desarrollado para la empresa agroindustrial NutriCampo S.A.S. como proyecto académico de la asignatura Sistemas de Información e Informática Industrial de la Universidad de Caldas.

La auditoría evaluó la arquitectura, seguridad, disponibilidad, escalabilidad y calidad del software del sistema. Se analizaron un total de 22 endpoints REST, 15 componentes de frontend, 10 tablas de base de datos y 4 módulos de servicios backend.

El sistema presenta una arquitectura sólida para su propósito y alcance. Se identificaron 5 hallazgos: 1 de criticidad alta (ausencia de rate limiting), 2 de criticidad media (falta de logs persistentes, ausencia de respaldo automatizado de base de datos) y 2 de criticidad baja (falta de paginación en listados, ausencia de pruebas automatizadas). Las recomendaciones correspondientes se detallan en la sección 12.

El nivel de madurez estimado del sistema corresponde al nivel 2 (Repetible) de la escala propuesta, con potencial para alcanzar el nivel 3 (Definido) tras implementar las recomendaciones planteadas.

---

## 2. Alcance

### 2.1 Objeto de la Auditoría

La auditoría cubrió los siguientes componentes del sistema:

- **Backend:** código fuente en Node.js/Express, 22 endpoints REST, middleware de autenticación y validación SQL, servicios de IA y base de datos.
- **Frontend:** código fuente en React, 15 componentes funcionales, cliente HTTP, lógica de negocio del lado del cliente.
- **Base de Datos:** esquema MySQL con 10 tablas, seed de datos de prueba, relaciones y restricciones de integridad.
- **Infraestructura:** configuración de conexiones, variables de entorno, dependencias.

### 2.2 Exclusiones

- Pruebas de penetración activas sobre el entorno de producción.
- Evaluación de rendimiento bajo carga (stress testing).
- Auditoría del código del LLM externo (Google Gemini API).
- Evaluación de la infraestructura de red subyacente.

---

## 3. Metodología

La auditoría se realizó mediante las siguientes actividades:

1. **Revisión de código fuente:** análisis estático del código backend y frontend para identificar vulnerabilidades, malas prácticas y desviaciones de estándares.
2. **Análisis de arquitectura:** evaluación de la estructura de capas, patrones de diseño y separación de responsabilidades.
3. **Pruebas de seguridad funcionales:** verificación de control de acceso, manejo de tokens, validación de entradas y protección contra inyección SQL.
4. **Revisión de configuración:** análisis de variables de entorno, dependencias y archivos de configuración.
5. **Análisis de documentación:** verificación de consistencia entre la documentación técnica, el manual de usuario y la implementación real.

---

## 4. Evaluación de Arquitectura

### 4.1 Puntuación General: 7.5/10

**Aciertos:**

- La arquitectura de tres capas con comunicación REST es adecuada para el dominio del problema y el tamaño del equipo de desarrollo.
- La separación entre rutas, controladores, servicios y middleware en el backend sigue el principio de responsabilidad única.
- El frontend centraliza el estado global en un solo componente, evitando la complejidad de librerías externas de gestión de estado innecesarias para este alcance.
- La comunicación entre frontend y backend es stateless, lo que facilita el escalamiento horizontal futuro.
- El módulo de IA está correctamente aislado en un servicio independiente, lo que permite cambiar de proveedor de LLM sin afectar el resto del sistema.

**Debilidades:**

- El esquema de base de datos carece de índices explícitos para las columnas más consultadas, lo que podría degradar el rendimiento a medida que crece el volumen de datos.
- El backend utiliza Express 5, que aún es una versión candidata (no LTS), introduciendo un riesgo de estabilidad a largo plazo.
- No existe un sistema de caché de respuestas para consultas frecuentes, lo que genera llamadas redundantes al LLM.
- La lógica de autorización se aplica a nivel de ruta, pero algunas rutas verifican roles dentro del controlador en lugar de hacerlo exclusivamente en el middleware.

### 4.2 Análisis de Patrones Arquitectónicos

El sistema implementa correctamente el patrón **Middleware Chain** de Express para la autenticación y validación SQL. Sin embargo, la cadena de middleware podría extenderse para incluir validación de datos de entrada, logging y rate limiting en versiones futuras.

El patrón **Service Layer** está bien implementado: los controladores delegan en servicios que encapsulan la lógica de negocio. No se detectaron casos de lógica de negocio dispersa en los controladores.

---

## 5. Evaluación de Seguridad

### 5.1 Puntuación General: 8.0/10

**Controles implementados (verificados):**

| Control | Estado | Efectividad |
|---------|--------|-------------|
| Hashing de contraseñas con bcrypt (salt 10) | Implementado | Alta |
| Autenticación JWT con expiración de 8 horas | Implementado | Alta |
| Autorización por roles en endpoints | Implementado | Alta |
| Validación SQL (solo SELECT) | Implementado | Alta |
| Queries parametrizadas (mysql2) | Implementado | Alta |
| API key oculta en backend | Implementado | Alta |
| .env en .gitignore | Implementado | Alta |

**Debilidades:**

| Control | Estado | Impacto |
|---------|--------|---------|
| Rate limiting en endpoint IA | No implementado | Alto: sin protección contra abuso del endpoint de consultas |
| Validación de entrada en formularios | Parcial | Medio: el frontend no valida tipos de datos antes de enviar |
| Headers de seguridad HTTP | No implementado | Medio: falta CSP, X-Frame-Options, X-Content-Type-Options |
| Logs de seguridad | No implementado | Medio: no hay registro de intentos fallidos de autenticación |

### 5.2 Análisis de Vulnerabilidades Potenciales

**Inyección SQL:** el riesgo es bajo. Todas las consultas utilizan el método `execute()` de `mysql2` con parámetros posicionales, lo que previene la inyección SQL incluso si los datos ingresados contienen caracteres maliciosos.

**Exposición de API key:** el riesgo es bajo. La clave de Gemini se almacena exclusivamente en el backend y nunca se envía al frontend.

**Fuga de información en errores:** el riesgo es medio. Los mensajes de error genéricos protegen los detalles internos, pero en algunos casos se retorna el error original de la base de datos, lo que podría exponer información de la estructura.

**Autenticación:** el riesgo es bajo. El flujo JWT es correcto y la expiración de 8 horas es razonable para un sistema interno.

---

## 6. Evaluación de Disponibilidad

### 6.1 Puntuación General: 5.0/10

**Aspectos evaluados:**

- **Punto único de fallo:** el backend se ejecuta en un solo proceso de Node.js. Si el proceso falla, todo el sistema queda inaccesible.
- **Sin redundancia:** no hay replicación del servidor backend ni de la base de datos.
- **Sin sistema de colas:** las solicitudes al LLM son síncronas y bloquean el hilo de Node.js durante la espera.
- **Dependencia externa:** el sistema depende de la disponibilidad de Gemini API. Si el servicio de Google está caído, el asistente IA falla (aunque el modo offline con consultas predefinidas mitiga parcialmente este riesgo).

**Tiempo de actividad estimado:**

- Backend: ~99% en condiciones normales (asumiendo reinicio automático con herramientas como PM2).
- Gemini API: ~99.9% (según el SLA de Google Cloud).
- Sistema completo (backend + frontend + BD): ~98.5%.

### 6.2 Estrategias de Mitigación Existentes

El modo offline con consultas predefinidas es la única estrategia de mitigación implementada. Para un sistema crítico para la toma de decisiones, se requieren medidas adicionales.

---

## 7. Evaluación de Escalabilidad

### 7.1 Puntuación General: 5.5/10

**Limitaciones identificadas:**

- **Base de datos:** sin índices en columnas de uso frecuente (fecha en ventas y compras, id_producto en detalle_ventas), las consultas agregadas degradarán su rendimiento linealmente con el crecimiento de datos.
- **Backend:** el servidor Express se ejecuta en un solo hilo. Node.js puede manejar múltiples solicitudes concurrentes gracias a su modelo asíncrono, pero operaciones CPU-intensivas (como el parseo de grandes conjuntos de datos) bloquearían el event loop.
- **Frontend:** la carga inicial completa de todos los datos mediante `Promise.all` no escalará bien con volúmenes grandes de transacciones.
- **Pool de conexiones:** el límite de 10 conexiones simultáneas puede ser insuficiente si múltiples usuarios realizan consultas pesadas al mismo tiempo.

**Potencial de escalamiento:**

La arquitectura stateless del backend permite el escalamiento horizontal mediante la adición de instancias detrás de un balanceador de carga. Este es un punto positivo significativo.

---

## 8. Evaluación de Calidad del Software

### 8.1 Puntuación General: 7.0/10

**Aciertos:**

- El código fuente está organizado en una estructura de carpetas consistente y predecible.
- Las convenciones de nomenclatura son uniformes en todo el proyecto.
- El cliente HTTP centralizado evita la duplicación de lógica de red.
- Los servicios tienen responsabilidades claramente definidas.

**Debilidades:**

- **Sin pruebas automatizadas:** no se identificaron pruebas unitarias, de integración ni funcionales. Esto representa un riesgo significativo para la calidad a largo plazo.
- **Manejo de errores asíncronos:** algunos controladores no capturan excepciones de operaciones asíncronas, lo que puede causar que el servidor deje de responder ante errores inesperados.
- **Código duplicado:** existe duplicación en la lógica de construcción de respuestas entre algunos controladores CRUD.
- **Sin tipado estático:** aunque el proyecto incluye configuración de TypeScript, los archivos fuente son JavaScript (.jsx), perdiendo los beneficios de verificación de tipos en tiempo de compilación.

### 8.2 Métricas de Calidad

| Indicador | Resultado | Observación |
|-----------|-----------|-------------|
| Cobertura de pruebas | 0% | No se implementaron pruebas automatizadas |
| Cumplimiento de estándares | Alto | Sigue las convenciones del ecosistema Node.js/React |
| Consistencia de estilo | Alta | Estilo uniforme en todos los archivos |
| Documentación del código | Media | Funciones documentadas, pero falta documentación de módulos complejos |
| Manejo de errores | Medio | Captura en servicios pero no consistente en controladores |

---

## 9. Identificación de Riesgos

### 9.1 Riesgos Operacionales

| ID | Riesgo | Descripción | Impacto |
|----|--------|-------------|---------|
| RO-01 | Dependencia de personal clave | El conocimiento del sistema está centralizado en el equipo de desarrollo original | Alto |
| RO-02 | Pérdida de datos | Sin backups automáticos, un fallo de hardware podría causar pérdida irreversible de información | Alto |
| RO-03 | Obsolescencia de datos de prueba | Los datos semilla pueden quedar desactualizados respecto a la operación real, dificultando pruebas | Medio |

### 9.2 Riesgos Tecnológicos

| ID | Riesgo | Descripción | Impacto |
|----|--------|-------------|---------|
| RT-01 | Dependencia de API externa | El sistema depende de Gemini API; cambios en la API o en los precios del servicio pueden afectar la operación | Alto |
| RT-02 | Versión no LTS de Express | Express 5 no tiene versión estable LTS, lo que puede generar problemas de compatibilidad o seguridad | Medio |
| RT-03 | Sin rate limiting | El endpoint de consultas IA puede ser abusado, generando costos inesperados en la API de Gemini | Alto |
| RT-04 | Sin pruebas automatizadas | Los cambios en el código pueden introducir regresiones no detectadas | Medio |

### 9.3 Riesgos de Seguridad

| ID | Riesgo | Descripción | Impacto |
|----|--------|-------------|---------|
| RS-01 | Exposición de API key | Si el archivo .env se sube accidentalmente al repositorio, la clave de Gemini quedaría expuesta | Alto |
| RS-02 | Fallo en validación SQL | Una evasión del middleware validateSQL podría permitir consultas destructivas en la base de datos | Alto |
| RS-03 | Headers de seguridad ausentes | La falta de CSP y otros headers expone al sistema a ataques XSS y clickjacking | Medio |

---

## 10. Matriz de Riesgos

| ID | Riesgo | Probabilidad | Impacto | Nivel | Prioridad |
|----|--------|-------------|---------|-------|-----------|
| RT-01 | Dependencia de API externa | Media | Alto | **Crítico** | Inmediata |
| RT-03 | Sin rate limiting | Alta | Alto | **Crítico** | Inmediata |
| RO-02 | Pérdida de datos | Baja | Alto | **Alto** | Corto plazo |
| RS-01 | Exposición de API key | Baja | Alto | **Alto** | Corto plazo |
| RS-02 | Fallo en validación SQL | Baja | Alto | **Alto** | Corto plazo |
| RO-01 | Dependencia de personal clave | Media | Alto | **Alto** | Corto plazo |
| RT-04 | Sin pruebas automatizadas | Alta | Medio | **Medio** | Mediano plazo |
| RS-03 | Headers de seguridad ausentes | Media | Medio | **Medio** | Mediano plazo |
| RT-02 | Versión no LTS de Express | Baja | Medio | **Bajo** | Largo plazo |
| RO-03 | Obsolescencia de datos de prueba | Media | Bajo | **Bajo** | Largo plazo |

*Tabla 1: Matriz de riesgos (Probabilidad × Impacto)*

---

## 11. Hallazgos

### 11.1 Hallazgo 1 — Criticidad Alta: Ausencia de Rate Limiting

**Descripción:** el endpoint `POST /api/consulta` no implementa limitación de tasa de solicitudes. Un usuario malintencionado o un error en el frontend podría realizar cientos de solicitudes por minuto, generando costos elevados en la API de Gemini y degradando el rendimiento del servidor.

**Evidencia:** revisión del middleware montado en `src/index.js`; no se encontró configuración de `express-rate-limit` ni ningún otro mecanismo de throttling.

**Impacto:** alto. Cada solicitud exitosa consume una cuota de la API de Gemini (1500 solicitudes/día en el tier gratuito). Sin control, un solo usuario podría agotar la cuota diaria en minutos.

**Recomendación:** implementar `express-rate-limit` con un límite de 10 solicitudes por minuto por usuario en el endpoint de consultas IA.

### 11.2 Hallazgo 2 — Criticidad Alta: Dependencia Externa Sin Resiliencia

**Descripción:** el sistema depende exclusivamente de Gemini API para la generación de SQL. Si el servicio de Google está caído, el asistente IA no puede responder consultas que no estén cubiertas por las consultas predefinidas.

**Evidencia:** revisión de `aiService.js` — la función `generarSQL` llama a Gemini API sin un mecanismo de reintento con backoff ni una estrategia de failover hacia otro proveedor de LLM.

**Impacto:** alto. El sistema se queda sin funcionalidad principal si Gemini no está disponible.

**Recomendación:** implementar un mecanismo de reintento con backoff exponencial (el paquete `exponential-backoff` ya está listado en `package.json` pero no se utiliza) y evaluar la integración con un proveedor alternativo (por ejemplo, Groq) como failover.

### 11.3 Hallazgo 3 — Criticidad Media: Ausencia de Logs Persistentes

**Descripción:** el sistema no implementa un sistema de logging persistente. Los errores y eventos solo se registran en la consola del servidor, sin almacenamiento en archivos ni en un servicio centralizado de logs.

**Evidencia:** revisión de `src/index.js` y los servicios — no se encontró configuración de Winston, Morgan, Pino ni ninguna otra librería de logging.

**Impacto:** medio. En caso de fallo, es difícil realizar ingeniería forense para determinar la causa raíz sin registros persistentes.

**Recomendación:** implementar Morgan para logging de solicitudes HTTP y Winston para logging estructurado de errores con rotación de archivos.

### 11.4 Hallazgo 4 — Criticidad Media: Sin Respaldo Automatizado de Base de Datos

**Descripción:** no existe un procedimiento automatizado para realizar backups de la base de datos. La información almacenada en el Data Warehouse no está protegida contra fallos de hardware o corrupción de datos.

**Evidencia:** revisión de la documentación y los scripts del proyecto — no se encontró configuración de backups.

**Impacto:** medio-alto. Una falla del disco duro o un error en una operación de borrado podría causar la pérdida permanente de todos los datos operativos.

**Recomendación:** programar backups diarios mediante `mysqldump` con retención de 7 días, y documentar el procedimiento de restauración.

### 11.5 Hallazgo 5 — Criticidad Baja: Ausencia de Paginación en Listados

**Descripción:** los endpoints GET que listan recursos no implementan paginación. A medida que crece el volumen de datos, las respuestas serán cada vez más grandes y lentas.

**Evidencia:** revisión de los controladores CRUD — ninguna función GET implementa parámetros `limit` y `offset`.

**Impacto:** bajo en el estado actual (volumen de datos manejable), pero creciente con el tiempo.

**Recomendación:** agregar paginación con parámetros `limit` y `offset` en los endpoints de listado, con un valor por defecto de 100 registros por página.

---

## 12. Recomendaciones

### 12.1 Recomendaciones Inmediatas (Prioridad Alta)

1. **Implementar rate limiting** en el endpoint `POST /api/consulta` utilizando `express-rate-limit`. Configurar un límite de 10 solicitudes por minuto por dirección IP o por token de usuario.

2. **Implementar reintentos con backoff exponencial** en las llamadas a Gemini API. El paquete `exponential-backoff` ya está en las dependencias pero no se utiliza en `aiService.js`.

### 12.2 Recomendaciones a Corto Plazo (Prioridad Media)

3. **Implementar logging persistente** con Morgan (para solicitudes HTTP) y Winston (para errores y eventos del sistema). Configurar rotación de archivos de log cada 7 días.

4. **Programar backups automáticos** de la base de datos mediante un script que ejecute `mysqldump` diariamente y almacene los respaldos con una retención mínima de 7 días.

5. **Agregar índices en columnas frecuentemente consultadas:** `ventas.fecha`, `costos_insumos.id_insumo` + `costos_insumos.periodo`, `detalle_ventas.id_producto`.

### 12.3 Recomendaciones a Mediano Plazo (Prioridad Baja)

6. **Implementar paginación** en los endpoints de listado con parámetros `limit` y `offset`.

7. **Escribir pruebas automatizadas:** comenzar con pruebas unitarias para los servicios (`aiService`, `dbService`, `validateSQL`) y pruebas de integración para los endpoints críticos (login, consulta IA, CRUD).

8. **Agregar headers de seguridad HTTP:** Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security.

9. **Migrar el código a TypeScript efectivo:** aprovechar la configuración ya existente de `tsconfig.json` para migrar progresivamente los archivos `.jsx` a `.tsx`.

### 12.4 Recomendaciones para una PYME Agroindustrial

Considerando que NutriCampo S.A.S. es una PYME con recursos limitados, las recomendaciones anteriores están priorizadas por impacto y esfuerzo. Las siguientes sugerencias adicionales son específicas para el contexto de la empresa:

- **Capacitación cruzada:** documentar los procedimientos de operación del sistema para que al menos dos personas puedan administrarlo, reduciendo la dependencia de personal clave.
- **Respaldo en la nube:** utilizar servicios gratuitos como Google Drive o OneDrive para almacenar los backups de la base de datos, complementando el respaldo local.
- **Revisión periódica de costos de API:** monitorear el consumo de la API de Gemini para anticipar cuándo podría ser necesario migrar a un plan de pago.

---

## 13. Nivel de Madurez

### 13.1 Escala de Evaluación

Se utilizó una escala adaptada del modelo de madurez de capacidades (CMM):

| Nivel | Descripción | Características |
|-------|-------------|-----------------|
| 1 | Inicial | Procesos improvisados, éxito depende del esfuerzo individual |
| 2 | Repetible | Procesos básicos documentados, prácticas consistentes |
| 3 | Definido | Procesos estandarizados, documentación completa |
| 4 | Gestionado | Procesos medidos y controlados cuantitativamente |
| 5 | Optimizado | Mejora continua basada en métricas |

### 13.2 Evaluación por Dimensión

| Dimensión | Nivel | Justificación |
|-----------|-------|---------------|
| Arquitectura | 3 | Bien definida y documentada, con separación clara de capas |
| Seguridad | 2 | Controles básicos implementados pero faltan medidas avanzadas |
| Disponibilidad | 1 | Sin redundancia, punto único de fallo, sin monitoreo |
| Escalabilidad | 2 | Arquitectura propicia para escalar pero sin implementación |
| Calidad del Software | 2 | Código organizado pero sin pruebas automatizadas |
| Documentación | 3 | Documentación completa y consistente para el alcance del proyecto |

### 13.3 Nivel de Madurez General: **Nivel 2 (Repetible)**

El sistema cuenta con procesos básicos documentados y prácticas de desarrollo consistentes. La arquitectura está bien definida y el código sigue estándares uniformes. Sin embargo, la ausencia de pruebas automatizadas, logging persistente y mecanismos de disponibilidad impiden alcanzar un nivel superior.

Con la implementación de las recomendaciones planteadas en la sección 12, el sistema podría alcanzar el Nivel 3 (Definido) en un plazo de 2 a 4 semanas de trabajo.

---

## 14. Conclusiones

1. El sistema BI-GenIA NutriCampo (NutriBI) cumple con los objetivos funcionales planteados en la propuesta del proyecto. La arquitectura de tres capas, el flujo Text-to-SQL, el dashboard con indicadores y los módulos CRUD están correctamente implementados y documentados.

2. En el aspecto de seguridad, el sistema implementa los controles fundamentales (JWT, bcrypt, validación SQL, queries parametrizadas) que son apropiados para un sistema interno de una PYME. Las debilidades identificadas (ausencia de rate limiting y headers de seguridad) son abordables con esfuerzo moderado.

3. La principal debilidad del sistema es la ausencia de pruebas automatizadas, que representa un riesgo para la calidad a largo plazo y la capacidad de realizar cambios sin introducir regresiones.

4. La dependencia exclusiva de Gemini API sin mecanismos de resiliencia (reintentos, failover) es el riesgo operacional más significativo. Sin embargo, el modo offline con consultas predefinidas mitiga parcialmente este riesgo para las preguntas más comunes.

5. El nivel de madurez general del sistema (Nivel 2) es adecuado para un proyecto académico con un ciclo de desarrollo de tres días. Con mejoras incrementales podría alcanzar un nivel profesional (Nivel 3) en el corto plazo.

6. La documentación técnica y el manual de usuario son completos y consistentes con la implementación real, lo cual es una fortaleza significativa del proyecto.

---

*Documento elaborado para la asignatura Sistemas de Información e Informática Industrial — Universidad de Caldas — Julio 2026*

*Auditoría realizada por consultor externo independiente.*
