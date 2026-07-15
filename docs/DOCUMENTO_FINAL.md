# Documento Final del Proyecto

## BI-GenIA NutriCampo (NutriBI)

**Sistema de Business Intelligence con Inteligencia Artificial Generativa para la toma de decisiones financieras en NutriCampo S.A.S.**

---

| | |
|---|---|
| **Universidad** | Universidad de Caldas |
| **Facultad** | Ingeniería |
| **Programa** | Ingeniería de Sistemas |
| **Asignatura** | Sistemas de Información e Informática Industrial |
| **Profesor** | Jhon Wilder Sanchez |
| **Grupo** | 2 |
| **Integrantes** | Juan Manuel Giraldo, Juan David Maldonado, Victor Manuel Fernandez |
| **Fecha** | Julio 2026 |
| **Versión** | 1.0 |

---

## Tabla de Contenido

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Introducción](#2-introducción)
3. [Planteamiento del Problema](#3-planteamiento-del-problema)
4. [Objetivos](#4-objetivos)
5. [Justificación](#5-justificación)
6. [Marco Tecnológico](#6-marco-tecnológico)
7. [Arquitectura General](#7-arquitectura-general)
8. [Descripción de Módulos](#8-descripción-de-módulos)
9. [Requerimientos](#9-requerimientos)
10. [Casos de Uso](#10-casos-de-uso)
11. [Arquitectura de Software](#11-arquitectura-de-software)
12. [Arquitectura de Datos](#12-arquitectura-de-datos)
13. [Modelo de IA](#13-modelo-de-ia)
14. [Flujo Text-to-SQL](#14-flujo-text-to-sql)
15. [Data Warehouse](#15-data-warehouse)
16. [Dashboard](#16-dashboard)
17. [Indicadores](#17-indicadores)
18. [Conclusiones](#18-conclusiones)
19. [Trabajo Futuro](#19-trabajo-futuro)

---

## 1. Resumen Ejecutivo

NutriCampo S.A.S. es una pequeña empresa familiar del sector agroindustrial dedicada al procesamiento, pasteurización, estandarización y empaque de derivados de frutas. La organización enfrenta ineficiencias críticas en su administración interna derivadas de la dispersión de datos operativos, la ausencia de visibilidad financiera en tiempo real y la centralización empírica de las decisiones estratégicas.

El presente documento describe el diseño, la arquitectura y la implementación de BI-GenIA NutriCampo (NutriBI), un sistema de Business Intelligence potenciado con Inteligencia Artificial Generativa que permite a los directivos de la empresa realizar consultas en lenguaje natural sobre el estado financiero y operativo del negocio. El sistema traduce automáticamente preguntas en español a consultas SQL mediante un modelo de lenguaje de gran escala (LLM), ejecuta dichas consultas contra un Data Warehouse unificado y despliega los resultados en un dashboard interactivo con visualizaciones dinámicas y síntesis ejecutivas generadas por IA.

La solución se construyó sobre una arquitectura de tres capas: frontend en React con visualización Chart.js, backend en Node.js con Express y autenticación JWT, y base de datos MySQL con un esquema de diez tablas normalizadas. Se implementaron veintidós endpoints REST que cubren autenticación, consultas IA, operaciones CRUD sobre todas las entidades del negocio, reportes agregados, costeo dinámico y exportación de datos.

El sistema fue desarrollado por un equipo de tres personas en un ciclo de desarrollo de tres días, siguiendo una metodología basada en fases incrementales que priorizó la base de datos, luego el backend con IA integrada y finalmente la conexión del frontend.

---

## 2. Introducción

La industria de procesamiento de frutas y hortalizas en Colombia presenta un alto potencial competitivo debido a la disponibilidad permanente de materias primas durante todo el año. Sin embargo, las pequeñas y medianas empresas de carácter familiar que operan en este sector enfrentan brechas tecnológicas significativas que limitan su capacidad de escalamiento y eficiencia corporativa.

NutriCampo S.A.S. opera en el subsector de derivados de frutas con una línea de productos que incluye pulpas congeladas, mermeladas artesanales y bases concentradas para jugos. La empresa cuenta con infraestructura física de planta, maquinaria industrial especializada y vehículos con sistemas de refrigeración, pero su capa tecnológica se limita a un software contable y de facturación electrónica tradicional sin módulos analíticos ni herramientas de inteligencia de negocio.

BI-GenIA NutriCampo (NutriBI) surge como respuesta a esta necesidad. El sistema integra un repositorio unificado de datos con un motor de orquestación conectado a un modelo de lenguaje de gran escala, proporcionando una interfaz conversacional en español que elimina la barrera técnica entre los datos operativos y la toma de decisiones directiva.

Este documento presenta de manera integral la solución desarrollada: desde la identificación del problema empresarial y los objetivos del proyecto, pasando por la arquitectura tecnológica y los módulos funcionales, hasta los indicadores de impacto y las conclusiones del trabajo realizado.

---

## 3. Planteamiento del Problema

### 3.1 Contexto Organizacional

NutriCampo S.A.S. es una empresa de tipo familiar clasificada como pequeña empresa del sector secundario. Su actividad económica principal es la agroindustria manufacturera, específicamente el procesamiento de frutas para la obtención de pulpas congeladas, mermeladas y bases concentradas para jugos. La empresa distribuye sus productos a restaurantes, cadenas de fruterías, servicios de catering institucional y micromercados regionales en el Eje Cafetero colombiano.

### 3.2 Problemas Identificados

A través del análisis del sector y la dinámica operativa de la empresa, se identificaron las siguientes problemáticas:

**Falta de visibilidad financiera en tiempo real.** Los datos operativos correspondientes a ventas, compras y costos logísticos se encuentran dispersos en formatos físicos o registros contables básicos aislados. Esta fragmentación imposibilita el cálculo inmediato de márgenes reales de ganancia por línea de producto, obligando a la dirección a tomar decisiones con información desactualizada.

**Alta volatilidad en costos de producción.** Los precios de las frutas y los insumos de empaque en los mercados colombianos sufren fluctuaciones semanarias debido a la estacionalidad climática, variaciones macroeconómicas y problemas logísticos en vías nacionales. La organización carece de un mecanismo automatizado para cruzar estos datos con las tarifas de salida, lo que puede generar pérdidas ocultas durante períodos prolongados.

**Centralización empírica de decisiones.** Las determinaciones críticas —fijación de precios, planeación de compras estratégicas, asignación de descuentos— dependen de la intuición o la experiencia acumulada de los fundadores. Este modelo limita el escalamiento comercial y expone a la empresa a errores de juicio en contextos de alta volatilidad.

**Asimetría de información entre actores internos.** El flujo de información entre la dirección, el jefe de planta y el personal administrativo es discontinuo y carece de estandarización. No existe un repositorio centralizado que consolide los datos de producción, ventas y costos en una sola fuente de verdad.

### 3.3 Impacto del Problema

Las consecuencias directas de estas problemáticas incluyen:

- Imposibilidad de detectar productos con rentabilidad negativa antes de que generen pérdidas acumuladas significativas.
- Desactualización recurrente de listas de precios frente al costo real de las materias primas en el mercado.
- Dependencia excesiva de la memoria institucional de los fundadores para la planeación estratégica.
- Dificultad para presentar información consolidada a entidades de control como INVIMA y DIAN.

---

## 4. Objetivos

### 4.1 Objetivo General

Diseñar e implementar un sistema de Business Intelligence con Inteligencia Artificial Generativa que permita a los directivos de NutriCampo S.A.S. realizar consultas en lenguaje natural sobre el estado financiero y operativo de la empresa, obteniendo respuestas inmediatas basadas en datos consolidados del Data Warehouse.

### 4.2 Objetivos Específicos

1. Desarrollar un Data Warehouse que consolide los datos de ventas, compras, costos de insumos, recetas de producción y catálogo de productos y clientes en un repositorio relacional único.

2. Implementar un motor de consultas basado en un modelo de lenguaje de gran escala que traduzca preguntas en lenguaje natural español a consultas SQL válidas.

3. Diseñar un dashboard interactivo que presente indicadores clave de gestión financiera y operativa con visualizaciones dinámicas.

4. Establecer un sistema de autenticación y autorización basado en roles que garantice la seguridad de los datos y el control de acceso diferenciado por perfil de usuario.

5. Implementar mecanismos de exportación de datos y trazabilidad de consultas que soporten los requisitos de transparencia y auditoría del sistema.

---

## 5. Justificación

### 5.1 Justificación Tecnológica

La elección de un sistema de Business Intelligence con interfaz conversacional responde a la necesidad de democratizar el acceso a los datos dentro de la organización. Los sistemas de BI tradicionales requieren conocimientos técnicos en diseño de consultas estructuradas o manejo avanzado de herramientas OLAP, competencias que no forman parte del perfil del personal directivo de una PYME familiar. La incorporación de un LLM como interfaz de consulta elimina esta barrera, permitiendo que cualquier miembro de la dirección pueda interrogar al sistema en su lenguaje cotidiano.

La arquitectura basada en un modelo Text-to-SQL con validación de seguridad garantiza que el sistema pueda interpretar preguntas complejas —como "¿Qué producto redujo más su margen este mes debido al costo del empaque?"— y traducirlas a consultas SQL óptimas, manteniendo al mismo tiempo un perímetro de seguridad que impide operaciones destructivas sobre la base de datos.

### 5.2 Justificación Económica

La implementación de BI-GenIA NutriCampo permite a la organización:

- Reducir el tiempo de latencia en la toma de decisiones financieras, pasando de horas de recopilación manual de datos a segundos de consulta automatizada.
- Detectar tempranamente productos con baja rentabilidad, evitando pérdidas acumuladas por desactualización de tarifas.
- Optimizar el margen de utilidad bruta global mediante la toma de decisiones informadas por datos en tiempo real.

### 5.3 Justificación Académica

El proyecto integra conceptos fundamentales de ingeniería de software, bases de datos, inteligencia artificial y sistemas de información, aplicándolos a un caso real del sector agroindustrial colombiano. La solución demuestra la viabilidad técnica de implementar sistemas de BI con IA generativa en contextos de recursos limitados, utilizando tecnologías de código abierto y APIs gratuitas.

---

## 6. Marco Tecnológico

### 6.1 Business Intelligence

El Business Intelligence (BI) comprende el conjunto de estrategias, herramientas y tecnologías enfocadas en la recolección, integración, análisis y presentación de información empresarial. En el contexto de NutriCampo, el BI permite transformar datos operativos dispersos —ventas, compras, costos de insumos— en conocimiento accionable para la dirección.

### 6.2 Inteligencia Artificial Generativa

La IA Generativa se refiere a modelos computacionales capaces de generar contenido nuevo —texto, imágenes, código— a partir de patrones aprendidos durante su entrenamiento. En este proyecto, se emplea un Modelo de Lenguaje de Gran Escala (LLM) especializado en la tarea de Text-to-SQL, que consiste en traducir una pregunta en lenguaje natural a una consulta SQL equivalente.

### 6.3 Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Frontend | React | 19 | Biblioteca de interfaz de usuario |
| Frontend | Vite | 8 | Empaquetador y servidor de desarrollo |
| Frontend | Chart.js | 4 | Visualización de datos en dashboard |
| Backend | Node.js | 18+ | Entorno de ejecución del servidor |
| Backend | Express | 5 | Framework web para API REST |
| Backend | JWT | — | Autenticación basada en tokens |
| Backend | bcrypt | — | Hashing de contraseñas |
| Base de Datos | MySQL | 8 | Sistema gestor de base de datos relacional |
| IA | Google Gemini API | 2.0 Flash | Modelo de lenguaje para Text-to-SQL |

### 6.4 Gemini API como Motor de IA

Se seleccionó Google Gemini 2.0 Flash como LLM principal por las siguientes razones:

- Lidera los benchmarks de precisión en tareas Text-to-SQL (puntaje superior a 80% en BIRD).
- Comprende español natural con alta precisión semántica.
- Su capa gratuita permite hasta 1500 consultas diarias, suficiente para el volumen esperado en una PYME.
- No requiere tarjeta de crédito para habilitar el acceso, eliminando barreras de adopción.
- Ofrece un contexto de 1 millón de tokens, permitiendo incluir el esquema completo de la base de datos en el prompt.

---

## 7. Arquitectura General

La arquitectura de BI-GenIA NutriCampo sigue un patrón de tres capas con un flujo de procesamiento en cuatro fases.

### 7.1 Diagrama de Arquitectura

```
[Frontend React] ←→ [API REST Express] ←→ [MySQL Data Warehouse]
                            ↑
                    [Gemini API (LLM)]
```

*Figura 1: Diagrama de contenedores de BI-GenIA NutriCampo*

### 7.2 Capas del Sistema

**Capa de Presentación.** Implementada en React con Vite como empaquetador. Proporciona la interfaz de usuario donde los directivos ingresan sus consultas, visualizan dashboards con indicadores y gestionan los datos operativos. Utiliza Chart.js para la representación gráfica de la información y se comunica con el backend mediante HTTP nativo (fetch).

**Capa de Negocio.** Implementada en Node.js con Express. Expone veintidós endpoints REST que cubren autenticación, consultas IA, operaciones CRUD y reportes. Alberga el motor de orquestación que coordina el flujo Text-to-SQL: recibe la pregunta del usuario, invoca al LLM para generar la consulta SQL, valida que la sentencia sea segura, la ejecuta contra la base de datos y devuelve los resultados enriquecidos con una explicación en lenguaje natural.

**Capa de Datos.** Implementada en MySQL 8 con un esquema de diez tablas normalizadas. Almacena el catálogo de productos, el registro de clientes, el histórico de ventas y compras con sus detalles, los costos de insumos por período, las recetas de producción y la trazabilidad de consultas realizadas.

### 7.3 Flujo de Procesamiento (Cuatro Fases)

El sistema opera siguiendo el modelo funcional definido en la propuesta:

**Fase 1 — Consulta Natural.** El usuario ingresa una pregunta en lenguaje cotidiano a través de la interfaz web. El sistema captura el texto y lo envía al backend.

**Fase 2 — Traducción SQL.** El backend recibe la pregunta y construye un prompt que incluye el esquema completo de la base de datos. El prompt se envía al LLM (Gemini), que analiza la semántica de la pregunta, mapea las variables con el diccionario de datos y genera la consulta SQL correspondiente.

**Fase 3 — Extracción de Datos.** La consulta SQL generada pasa por un middleware de validación que verifica que contenga únicamente operaciones SELECT. Si la validación es exitosa, la consulta se ejecuta contra el Data Warehouse utilizando parámetros escapados para prevenir inyección SQL.

**Fase 4 — Despliegue e Insight.** Los resultados obtenidos se envían al LLM para generar una síntesis ejecutiva en lenguaje natural. El frontend recibe el SQL generado, los datos tabulares y la explicación, y los presenta al usuario mediante un gráfico interactivo o una tabla, acompañados de la explicación textual.

---

## 8. Descripción de Módulos

### 8.1 Módulo de Autenticación y Gestión de Usuarios

Responsable del registro, inicio de sesión y administración de usuarios del sistema. Implementa autenticación mediante JWT con expiración de ocho horas y control de acceso basado en roles. Soporta tres perfiles: administrador (acceso completo), operaciones (lectura general + creación de ventas) y contador (lectura general + gestión de compras e insumos).

### 8.2 Módulo de Consultas IA

Núcleo funcional del sistema. Recibe preguntas en lenguaje natural, las envía al LLM para generar SQL, ejecuta la consulta validada contra la base de datos y retorna los datos enriquecidos con una explicación generada por IA. Incluye un modo offline con consultas predefinidas que funciona cuando la API del LLM no está disponible.

### 8.3 Módulo de Dashboard

Presenta indicadores clave de gestión mediante tarjetas numéricas y gráficos interactivos. Incluye visualización de ventas del mes, margen bruto global, costo de fruta como porcentaje de ventas, alertas activas, evolución mensual de ventas, márgenes por producto y evolución semanal de precios de frutas.

### 8.4 Módulo de Gestión de Productos

Permite administrar el catálogo de productos con atributos de nombre, categoría, presentación, precio de venta y estado activo. Las categorías incluyen pulpa congelada, mermelada y base concentrada.

### 8.5 Módulo de Gestión de Clientes

Administra el registro de clientes B2B con atributos de nombre, tipo (restaurante, catering, frutería, micromercado), ciudad y contacto. Los datos de clientes alimentan las consultas de rentabilidad por cliente y las proyecciones de ingresos.

### 8.6 Módulo de Gestión de Ventas

Gestiona el registro de transacciones de venta con cabecera (fecha, cliente, usuario, total) y detalle (productos, cantidades, precios unitarios, costos unitarios). Cada venta calcula automáticamente el costo unitario del producto basado en la receta y los precios de insumos vigentes en la fecha de la transacción.

### 8.7 Módulo de Gestión de Compras

Administra las compras de insumos a proveedores. Cada compra puede actualizar opcionalmente el precio semanal del insumo en el histórico de costos. Soporta el registro de múltiples ítems por transacción.

### 8.8 Módulo de Gestión de Insumos

Mantiene el catálogo de insumos (frutas, empaques, aditivos, azúcares) con su histórico de precios por período. Cada insumo tiene un tipo, una unidad de medida y un costo unitario que varía semanalmente.

### 8.9 Módulo de Recetas (Bill of Materials)

Define la composición de cada producto en términos de insumos y cantidades. Por ejemplo, la receta de "Pulpa de Mango" especifica 1.5 kg de mango, 0.3 kg de azúcar y 0.05 kg de ácido cítrico. Este módulo es fundamental para el cálculo del costo real de producción.

### 8.10 Módulo de Costeo Dinámico

Calcula el costo unitario de un producto en una fecha determinada consultando su receta y los precios de insumos vigentes en esa fecha. Este módulo permite a la dirección conocer el margen real de cada producto en cualquier momento del tiempo.

### 8.11 Módulo de Exportación

Genera archivos CSV con codificación UTF-8 BOM para las tablas de ventas y compras, permitiendo la descarga de datos para su procesamiento en herramientas externas como hojas de cálculo o sistemas contables.

### 8.12 Módulo de Alertas

Identifica transacciones de venta cuyo precio unitario es inferior al costo unitario del producto en esa fecha, señalando operaciones que están generando pérdidas. Complementariamente, detecta insumos con incrementos de precio significativos entre períodos consecutivos.

---

## 9. Requerimientos

### 9.1 Requerimientos Funcionales

| ID | Descripción | Módulo |
|----|-------------|--------|
| RF-01 | El sistema debe permitir la autenticación de usuarios mediante correo electrónico y contraseña | Autenticación |
| RF-02 | El sistema debe emitir un token JWT con expiración de ocho horas tras la autenticación exitosa | Autenticación |
| RF-03 | El sistema debe validar el token JWT en todas las solicitudes a recursos protegidos | Seguridad |
| RF-04 | El sistema debe restringir el acceso a operaciones según el rol del usuario | Seguridad |
| RF-05 | El sistema debe recibir preguntas en español y devolver respuestas basadas en datos reales | Consultas IA |
| RF-06 | El sistema debe traducir preguntas en lenguaje natural a consultas SQL utilizando Gemini API | Consultas IA |
| RF-07 | El sistema debe validar que las consultas SQL generadas contengan únicamente operaciones SELECT | Consultas IA |
| RF-08 | El sistema debe ejecutar consultas SQL parametrizadas para prevenir inyección SQL | Consultas IA |
| RF-09 | El sistema debe operar con consultas predefinidas cuando la API del LLM no esté disponible | Consultas IA |
| RF-10 | El sistema debe presentar un dashboard con indicadores clave de gestión financiera | Dashboard |
| RF-11 | El sistema debe mostrar la evolución mensual de ventas mediante gráfico de barras | Dashboard |
| RF-12 | El sistema debe mostrar el margen de ganancia por producto mediante gráfico de barras | Dashboard |
| RF-13 | El sistema debe mostrar la evolución semanal del precio de frutas mediante gráfico de líneas | Dashboard |
| RF-14 | El sistema debe permitir la administración completa del catálogo de productos | Productos |
| RF-15 | El sistema debe permitir la administración del registro de clientes B2B | Clientes |
| RF-16 | El sistema debe permitir el registro de ventas con detalle de productos | Ventas |
| RF-17 | El sistema debe calcular automáticamente el costo unitario del producto al registrar una venta | Ventas |
| RF-18 | El sistema debe permitir el registro de compras con detalle de insumos | Compras |
| RF-19 | El sistema debe mantener un histórico de precios de insumos por período | Insumos |
| RF-20 | El sistema debe permitir la definición de recetas de producción (Bill of Materials) | Recetas |
| RF-21 | El sistema debe calcular el costo unitario de un producto según su receta en una fecha dada | Costeo |
| RF-22 | El sistema debe exportar ventas y compras a formato CSV | Exportación |
| RF-23 | El sistema debe mantener un historial de todas las consultas realizadas al asistente IA | Trazabilidad |
| RF-24 | El sistema debe alertar sobre ventas realizadas por debajo del costo de producción | Alertas |

### 9.2 Requerimientos No Funcionales

| ID | Descripción | Categoría |
|----|-------------|-----------|
| RNF-01 | El tiempo de respuesta para consultas IA no debe exceder los 15 segundos | Rendimiento |
| RNF-02 | Las contraseñas deben almacenarse hasheadas con bcrypt (salt de 10 rondas) | Seguridad |
| RNF-03 | El sistema debe validar que las consultas SQL generadas por IA solo contengan SELECT | Seguridad |
| RNF-04 | La API key del LLM debe almacenarse exclusivamente en el backend, sin exponerse al frontend | Seguridad |
| RNF-05 | El token JWT debe expirar después de ocho horas de inactividad | Seguridad |
| RNF-06 | El sistema debe registrar con trazabilidad cada consulta realizada, incluyendo usuario, pregunta, SQL generado y respuesta | Auditoría |
| RNF-07 | La interfaz debe ser responsiva y funcionar correctamente en resoluciones de escritorio | Usabilidad |
| RNF-08 | La base de datos debe utilizar codificación UTF-8 para soportar caracteres especiales del español | Internacionalización |

---

## 10. Casos de Uso

### 10.1 Diagrama de Casos de Uso

El sistema contempla los siguientes actores y casos de uso:

**Actores:**
- **Administrador:** usuario con permisos totales sobre el sistema.
- **Operaciones:** usuario del área de producción y despacho.
- **Contador:** usuario del área financiera y contable.

*Figura 2: Diagrama de casos de uso (descripción textual para posterior conversión a UML)*

| Actor | Caso de Uso | Descripción |
|-------|-------------|-------------|
| Todos | Iniciar sesión | Ingresar al sistema con correo y contraseña |
| Todos | Consultar asistente IA | Realizar preguntas en lenguaje natural sobre el negocio |
| Todos | Visualizar dashboard | Acceder a indicadores y gráficos del panel principal |
| Todos | Exportar datos | Descargar ventas o compras en formato CSV |
| Administrador | Gestionar productos | Crear, leer, actualizar y eliminar productos |
| Administrador | Gestionar clientes | Crear, leer, actualizar y eliminar clientes |
| Administrador | Gestionar usuarios | Crear, leer, actualizar y eliminar usuarios del sistema |
| Administrador | Gestionar ventas | Crear y eliminar ventas |
| Administrador | Gestionar compras | Crear y eliminar compras |
| Administrador | Gestionar insumos | Crear, leer, actualizar y eliminar insumos |
| Administrador | Gestionar precios | Registrar precios semanales de insumos |
| Administrador | Gestionar recetas | Definir composición de productos |
| Operaciones | Registrar venta | Crear nuevas transacciones de venta |
| Operaciones | Consultar productos | Visualizar catálogo de productos |
| Contador | Registrar compra | Crear nuevas transacciones de compra |
| Contador | Gestionar insumos | Crear y actualizar insumos y sus precios |
| Contador | Gestionar recetas | Definir recetas de producción |

### 10.2 Especificación de Casos de Uso Principales

**Caso de Uso: Consultar Asistente IA**

| Elemento | Descripción |
|----------|-------------|
| Actor | Todos los roles autenticados |
| Precondición | El usuario ha iniciado sesión exitosamente |
| Flujo principal | 1. El usuario accede a la pestaña "Asistente IA". 2. El usuario escribe una pregunta en lenguaje natural. 3. El sistema envía la pregunta al backend. 4. El backend traduce la pregunta a SQL mediante Gemini API. 5. El backend valida que el SQL solo contenga SELECT. 6. El backend ejecuta la consulta contra la base de datos. 7. El backend genera una explicación de los resultados. 8. El frontend muestra el SQL generado, los datos y la explicación. |
| Postcondición | La consulta queda registrada en el historial del usuario |

**Caso de Uso: Visualizar Dashboard**

| Elemento | Descripción |
|----------|-------------|
| Actor | Todos los roles autenticados |
| Precondición | El usuario ha iniciado sesión exitosamente |
| Flujo principal | 1. El usuario accede a la pestaña "Panel". 2. El sistema calcula indicadores clave a partir de los datos almacenados. 3. El sistema presenta tarjetas con KPIs (ventas del mes, margen global). 4. El sistema presenta gráficos de ventas mensuales, márgenes por producto y evolución de precios de frutas. |
| Postcondición | El usuario puede interpretar el estado financiero actual de la empresa |

---

## 11. Arquitectura de Software

### 11.1 Patrón Arquitectónico

El sistema sigue el patrón **Arquitectura en Capas** con una variante de **Arquitectura Cliente-Servidor** para la comunicación entre frontend y backend.

- **Capa de Presentación (Frontend):** React con componentes funcionales y estado global centralizado.
- **Capa de Aplicación (Backend):** Express con separación en rutas, controladores, servicios y middleware.
- **Capa de Persistencia (Base de Datos):** MySQL con esquema relacional normalizado.
- **Capa Externa (IA):** Gemini API consumida como servicio externo vía HTTP.

### 11.2 Diagrama de Paquetes

```
frontend/src/
├── api/             # Cliente HTTP y métodos de API
├── components/      # Componentes React de interfaz
│   ├── charts/      # Componentes de gráficos Chart.js
│   └── registro/    # Componentes de formularios CRUD
├── utils/           # Funciones de formateo y métricas
└── styles/          # Hojas de estilo CSS

backend/src/
├── controllers/     # Lógica de controladores
├── middleware/       # Autenticación y validación SQL
├── routes/          # Definición de rutas REST
└── services/        # Lógica de negocio (IA, DB, queries)
```

*Figura 3: Diagrama de paquetes del sistema*

### 11.3 Estilo Arquitectónico

La API REST sigue los principios básicos de diseño RESTful:

- Los recursos se identifican mediante URLs semánticas (`/api/productos`, `/api/ventas`).
- Se utilizan los métodos HTTP estándar (GET, POST, PUT, DELETE).
- La autenticación se maneja mediante tokens JWT en el header `Authorization`.
- Las respuestas utilizan códigos de estado HTTP estándar (200, 201, 400, 401, 403, 404, 500).
- El formato de intercambio es JSON, con excepción de los endpoints de exportación que retornan CSV.

---

## 12. Arquitectura de Datos

### 12.1 Modelo Entidad-Relación

El Data Warehouse de NutriBI está compuesto por diez tablas que modelan las entidades fundamentales del negocio. A continuación se presenta el diagrama entidad-relación descrito textualmente:

**Tabla: usuarios** (1) → (N) **ventas**: un usuario registra múltiples ventas.
**Tabla: usuarios** (1) → (N) **compras**: un usuario registra múltiples compras.
**Tabla: usuarios** (1) → (N) **historial_consultas**: un usuario realiza múltiples consultas.
**Tabla: clientes** (1) → (N) **ventas**: un cliente genera múltiples ventas.
**Tabla: productos** (1) → (N) **detalle_ventas**: un producto aparece en múltiples detalles de venta.
**Tabla: ventas** (1) → (N) **detalle_ventas**: una venta contiene múltiples líneas de detalle.
**Tabla: costos_insumos** (1) → (N) **detalle_compras**: un insumo se compra múltiples veces.
**Tabla: costos_insumos** (1) → (N) **recetas**: un insumo se usa en múltiples recetas.
**Tabla: productos** (1) → (N) **recetas**: un producto tiene múltiples insumos en su receta.
**Tabla: compras** (1) → (N) **detalle_compras**: una compra contiene múltiples líneas de detalle.

*Figura 4: Diagrama entidad-relación del Data Warehouse*

### 12.2 Diccionario de Datos

| Tabla | Descripción | Columnas |
|-------|-------------|----------|
| usuarios | Usuarios del sistema con credenciales y roles | id_usuario, nombre, correo, password, rol, activo |
| productos | Catálogo de productos comercializados | id_producto, nombre, categoria, presentacion, precio_venta, activo |
| clientes | Clientes B2B de la empresa | id_cliente, nombre, tipo, ciudad, contacto |
| costos_insumos | Histórico de precios de materia prima | id_insumo, nombre, tipo, unidad, costo_unitario, periodo |
| ventas | Cabecera de transacciones de venta | id_venta, fecha, id_cliente, id_usuario, total |
| detalle_ventas | Líneas de detalle de cada venta | id_detalle_venta, id_venta, id_producto, cantidad, precio_unitario, costo_unitario, subtotal |
| compras | Cabecera de transacciones de compra | id_compra, fecha, proveedor, id_usuario, total |
| detalle_compras | Líneas de detalle de cada compra | id_detalle_compra, id_compra, id_insumo, cantidad, costo_unitario, subtotal |
| recetas | Composición de productos (Bill of Materials) | id_receta, id_producto, id_insumo, cantidad |
| historial_consultas | Trazabilidad de consultas al asistente IA | id_consulta, id_usuario, pregunta, sql_generado, respuesta, fecha |

*Tabla 1: Diccionario de datos del Data Warehouse*

---

## 13. Modelo de IA

### 13.1 Arquitectura del Módulo de IA

El módulo de IA se implementa como un servicio dentro del backend de Node.js que consume la API de Google Gemini. No se utiliza LangChain como framework explícito, pero la arquitectura del servicio sigue el mismo patrón de orquestación: construcción de prompts con contexto, invocación al LLM, parseo de respuestas y ejecución de acciones derivadas.

### 13.2 Componentes del Módulo

- **Generador de SQL (`aiService.generarSQL`):** Construye un prompt con el esquema completo de la base de datos, lo envía a Gemini y extrae la consulta SQL de la respuesta.
- **Validador de SQL (`validateSQL`):** Middleware que verifica que la sentencia generada comience con SELECT y no contenga palabras clave peligrosas.
- **Generador de Explicaciones (`aiService.generarExplicacion`):** Envía los datos obtenidos al LLM para generar una síntesis ejecutiva en lenguaje natural.
- **Módulo de Consultas Predefinidas (`predefinedQueries`):** Mapa de palabras clave a consultas SQL manuales que funciona como fallback offline.

### 13.3 Estrategia de Prompts

El prompt de generación de SQL incluye:

1. **Instrucción del sistema:** se indica al modelo que debe actuar como un asistente de BI para NutriCampo, generando únicamente consultas SELECT.
2. **Esquema de la base de datos:** obtenido mediante una consulta a `INFORMATION_SCHEMA`, se incluye la lista de tablas con sus columnas, tipos de datos y claves primarias.
3. **Pregunta del usuario:** se incorpora la pregunta original en español.
4. **Restricción de salida:** se solicita que la respuesta contenga únicamente la consulta SQL, sin explicaciones adicionales.

El prompt de generación de explicaciones incluye los datos obtenidos de la consulta SQL y solicita una interpretación en dos oraciones máximas.

### 13.4 Cache de Esquema

Para reducir el consumo de tokens y mejorar la velocidad de respuesta, el esquema de la base de datos se cachea en memoria durante cinco minutos. Esto evita consultas repetitivas a `INFORMATION_SCHEMA` en solicitudes consecutivas.

---

## 14. Flujo Text-to-SQL

### 14.1 Secuencia Detallada

1. **El usuario escribe una pregunta** en el campo de texto del Asistente IA dentro de la interfaz web.
2. **El frontend envía la pregunta** al endpoint `POST /api/consulta` mediante una solicitud HTTP con autenticación JWT.
3. **El backend recibe la pregunta** y la pasa al servicio `aiService.generarSQL`.
4. **El servicio intenta primero** encontrar una coincidencia en el módulo de consultas predefinidas. Si encuentra una, la utiliza y omite la llamada al LLM.
5. **Si no hay coincidencia predefinida**, el servicio construye un prompt con el esquema cacheado de la base de datos y envía la solicitud a Gemini API.
6. **Gemini retorna una respuesta** de la cual se extrae la consulta SQL.
7. **El middleware `validateSQL`** verifica que la consulta sea una sentencia SELECT sin operaciones peligrosas. Si la validación falla, se retorna un error 400.
8. **La consulta SQL validada** se ejecuta contra la base de datos utilizando parámetros escapados.
9. **Los resultados obtenidos** se pasan a `aiService.generarExplicacion` para generar una síntesis en lenguaje natural.
10. **La consulta se registra** en la tabla `historial_consultas` con el ID del usuario, la pregunta original, el SQL generado y la respuesta.
11. **El backend retorna** un objeto JSON con tres campos: `sql` (la consulta generada), `datos` (los resultados tabulares) y `respuesta` (la explicación).
12. **El frontend recibe la respuesta** y la presenta en la interfaz: el SQL en un bloque de código formateado, los datos en un gráfico o tabla según corresponda, y la explicación en texto.

### 14.2 Diagrama de Secuencia

```
Usuario    Frontend          Backend           Gemini API     Base de Datos
  |            |                |                  |               |
  |--pregunta-->|                |                  |               |
  |            |--POST /consulta->|                  |               |
  |            |                |--prompt----------->|               |
  |            |                |<--SQL--------------|               |
  |            |                |--validar SQL       |               |
  |            |                |--ejecutar SQL--------------------->|
  |            |                |<--datos------------|               |
  |            |                |--prompt(2)-------->|               |
  |            |                |<--explicación------|               |
  |            |                |--guardar historial |               |
  |            |<--{sql,datos,respuesta}-|                |               |
  |<--respuesta---|                |                  |               |
```

*Figura 5: Diagrama de secuencia del flujo Text-to-SQL*

---

## 15. Data Warehouse

### 15.1 Diseño del Data Warehouse

El Data Warehouse de BI-GenIA NutriCampo sigue un modelo de estrella simplificado con una tabla de hechos central (ventas) y múltiples tablas de dimensiones (productos, clientes, insumos). Sin embargo, debido a la complejidad de los procesos de costeo que requieren el cruce de recetas con precios históricos, se adoptó un modelo relacional normalizado con diez tablas interconectadas mediante llaves foráneas.

### 15.2 Proceso de Población de Datos

Dado que la empresa no cuenta con sistemas transaccionales automatizados de los cuales extraer datos, el poblamiento del Data Warehouse se realiza mediante los formularios CRUD del sistema. El personal administrativo ingresa los datos de:

- Productos y sus precios de venta.
- Clientes y sus datos de contacto.
- Insumos y sus precios por período (semanal o mensual).
- Recetas que definen la composición de cada producto.
- Ventas realizadas con detalle de productos y cantidades.
- Compras realizadas con detalle de insumos.

El proceso de ingreso de datos constituye un ETL manual asistido por la interfaz de usuario, donde la transformación principal es el cálculo automático de costos unitarios y totales que realiza el sistema al momento del registro.

### 15.3 Estrategia de Costeo

El costo unitario de un producto no se almacena como un valor fijo en la base de datos, sino que se calcula dinámicamente mediante la siguiente lógica:

1. Se obtiene la receta del producto (lista de insumos con cantidades).
2. Para cada insumo, se consulta el costo unitario más reciente cuyo período sea anterior o igual a la fecha de la transacción.
3. Se multiplica la cantidad del insumo por su costo unitario.
4. Se suma el costo de todos los insumos para obtener el costo total del producto.

Este enfoque permite que el costo de producción refleje los precios reales pagados por los insumos en cada período, capturando la volatilidad del mercado de frutas.

---

## 16. Dashboard

### 16.1 Estructura del Dashboard

El dashboard se organiza en una página principal con las siguientes secciones:

**Tarjetas de KPIs (Fila superior):**
- Ventas del mes actual (monto total y número de transacciones).
- Margen bruto global (porcentaje calculado sobre el total de ventas).
- Costo de fruta como porcentaje de ventas.
- Alertas activas en los últimos 30 días.

**Panel de Gráficos (Sección media):**
- Gráfico de barras verticales con la evolución de ventas mensuales.
- Gráfico de barras horizontales con el margen de ganancia por producto.
- Gráfico de líneas múltiples con la evolución semanal de precios de frutas.

*Figura 6: Distribución visual del dashboard*

### 16.2 Componentes del Dashboard

| Componente | Tipo de Visualización | Datos que Presenta |
|-----------|----------------------|-------------------|
| KPI: Ventas del mes | Tarjeta numérica | Total ventas + número de transacciones del mes actual |
| KPI: Margen bruto | Tarjeta numérica | Porcentaje de margen sobre ventas totales |
| KPI: Costo fruta/ventas | Tarjeta numérica | Porcentaje del costo de fruta sobre ingresos |
| KPI: Alertas activas | Tarjeta numérica | Conteo de ventas con pérdida en 30 días |
| Ventas por mes | Gráfico de barras | Monto total de ventas agrupado por mes |
| Margen por producto | Gráfico de barras horizontal | Porcentaje de margen de cada producto |
| Evolución precio frutas | Gráfico de líneas | Precio semanal de cada tipo de fruta |
| Grid de costeo | Tarjetas | Precio venta, costo real y margen por producto |

*Tabla 2: Componentes del dashboard*

---

## 17. Indicadores

### 17.1 Indicadores de Gestión y Productividad

**Tiempo de Latencia en Toma de Decisiones Financieras (TLDF).** Mide las horas requeridas por el equipo administrativo para recopilar datos dispersos, consolidar costos y recalcular precios ante fluctuaciones de insumos en el mercado. El sistema reduce este tiempo de horas a segundos al automatizar la consulta y el cálculo de costos.

**Tasa de Adopción Tecnológica Interna (TATI).** Porcentaje de las decisiones operativas y estratégicas de fijación de precios evaluadas a través de la plataforma por los líderes de la organización. Se calcula como el cociente entre consultas realizadas al sistema y decisiones totales tomadas en un período.

### 17.2 Indicadores Económicos y de Negocio

**Optimización del Margen de Utilidad Bruta Global (MUBG).** Incremento en el rendimiento financiero general derivado de la detección temprana de productos con baja rentabilidad o desviaciones en costos de materia prima.

**Índice de Pérdidas por Desactualización de Tarifas (IPDT).** Porcentaje del volumen de ventas mensual que fue despachado bajo listas de precios desactualizadas respecto al costo real de las frutas en el mercado. El sistema permite identificar estas transacciones mediante el módulo de alertas.

### 17.3 KPIs Implementados en el Dashboard

Los siguientes indicadores se calculan automáticamente y se despliegan en el dashboard:

- **Ventas del mes:** suma del total de ventas registradas en el mes calendario actual.
- **Transacciones del mes:** número de ventas realizadas en el mes actual.
- **Margen bruto global:** (ingresos totales - costos totales) / ingresos totales * 100.
- **Costo fruta / ventas:** costo de insumos tipo fruta / ingresos totales * 100.
- **Alertas activas:** ventas en los últimos 30 días donde precio_unitario < costo_unitario.

---

## 18. Conclusiones

1. Se diseñó e implementó un sistema de Business Intelligence con IA Generativa funcional para NutriCampo S.A.S., compuesto por un frontend web interactivo, un backend con veintidós endpoints REST y una base de datos MySQL con diez tablas normalizadas.

2. El módulo de consultas en lenguaje natural, basado en Gemini API, traduce preguntas en español a consultas SQL con un mecanismo de validación que garantiza que solo se ejecuten operaciones de lectura sobre la base de datos.

3. El dashboard integra indicadores clave de gestión y gráficos dinámicos que proporcionan visibilidad financiera en tiempo real, abordando directamente la falta de visibilidad identificada en el diagnóstico del problema.

4. El sistema de autenticación JWT con autorización basada en roles permite controlar el acceso a la información según el perfil del usuario, protegiendo los datos sensibles del negocio.

5. El módulo de costeo dinámico, que calcula el costo unitario de los productos según su receta y los precios vigentes de insumos, proporciona a la dirección información precisa para la fijación de precios y la detección de productos con rentabilidad comprometida.

6. La arquitectura de tres capas con comunicación REST asegura la separación de responsabilidades y permite el mantenimiento y la evolución independiente de cada componente del sistema.

---

## 19. Trabajo Futuro

Las siguientes líneas de trabajo han sido identificadas como extensiones naturales del sistema:

1. **Automatización del proceso ETL:** desarrollar conectores que permitan extraer datos automáticamente desde el software contable y de facturación electrónica de la empresa, eliminando el ingreso manual de información.

2. **Módulo de cumplimiento regulatorio:** implementar funcionalidades específicas para la gestión de registros sanitarios INVIMA, trazabilidad de lotes de producción y generación de reportes DIAN.

3. **Análisis predictivo de precios:** incorporar modelos de machine learning para pronosticar las fluctuaciones de precios de insumos basados en datos históricos y variables estacionales.

4. **Interfaz de voz:** habilitar la entrada de consultas mediante reconocimiento de voz para facilitar el uso del sistema en entornos de planta donde el acceso a teclado es limitado.

5. **Notificaciones proactivas:** implementar un sistema de alertas automáticas que notifique a la dirección cuando se detecten condiciones anómalas, como incrementos bruscos en costos de insumos o ventas con margen negativo.

6. **Escalamiento a multi-sede:** extender el sistema para soportar múltiples puntos de producción o centros de distribución, consolidando la información en un Data Warehouse centralizado.

---

*Documento elaborado para la asignatura Sistemas de Información e Informática Industrial — Universidad de Caldas — Julio 2026*
