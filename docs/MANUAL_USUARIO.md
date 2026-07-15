# Manual de Usuario

## BI-GenIA NutriCampo (NutriBI)

---

| | |
|---|---|
| **Proyecto** | BI-GenIA NutriCampo (NutriBI) |
| **Empresa** | NutriCampo S.A.S. |
| **Versión** | 1.0 |
| **Fecha** | Julio 2026 |
| **Destinatario** | Usuarios finales del sistema |

---

## Tabla de Contenido

1. [Introducción](#1-introducción)
2. [Ingreso al Sistema](#2-ingreso-al-sistema)
3. [Inicio de Sesión](#3-inicio-de-sesión)
4. [Pantalla Principal](#4-pantalla-principal)
5. [Consultar Indicadores](#5-consultar-indicadores)
6. [Consultar Ventas](#6-consultar-ventas)
7. [Consultar Costos](#7-consultar-costos)
8. [Consultar Rentabilidad](#8-consultar-rentabilidad)
9. [Consultar Mediante Lenguaje Natural](#9-consultar-mediante-lenguaje-natural)
10. [Interpretar Dashboards](#10-interpretar-dashboards)
11. [Exportar Resultados](#11-exportar-resultados)
12. [Administrar Perfil](#12-administrar-perfil)
13. [Cerrar Sesión](#13-cerrar-sesión)
14. [Preguntas Frecuentes](#14-preguntas-frecuentes)
15. [Errores Comunes](#15-errores-comunes)
16. [Buenas Prácticas](#16-buenas-prácticas)

---

## 1. Introducción

BI-GenIA NutriCampo (NutriBI) es una plataforma de inteligencia de negocios diseñada para el personal directivo y administrativo de NutriCampo S.A.S. El sistema le permite realizar consultas sobre la información financiera y operativa de la empresa utilizando lenguaje cotidiano, sin necesidad de conocimientos técnicos en bases de datos o herramientas de análisis.

Este manual le guiará paso a paso en el uso de todas las funcionalidades del sistema.

---

## 2. Ingreso al Sistema

### 2.1 Requisitos

Para utilizar el sistema, necesita:

- Un computador con conexión a internet o a la red local de la empresa.
- Un navegador web moderno (Google Chrome, Mozilla Firefox o Microsoft Edge en sus versiones actualizadas).
- Las credenciales de acceso proporcionadas por el administrador del sistema (correo electrónico y contraseña).

### 2.2 Acceso a la Plataforma

1. Abra su navegador web.
2. En la barra de direcciones, escriba la dirección donde está alojado el sistema. Si la instalación es local, la dirección será similar a `http://localhost:5173`.
3. Presione Enter. Se cargará la pantalla de inicio de sesión.

*[En esta sección debe incluirse una captura de pantalla de la pantalla de inicio de sesión]*

---

## 3. Inicio de Sesión

### 3.1 Cómo Iniciar Sesión

1. En la pantalla de inicio de sesión, ubique el campo **Correo electrónico**.
2. Escriba la dirección de correo que le fue asignada por el administrador.
3. En el campo **Contraseña**, escriba su contraseña.
4. Haga clic en el botón **Iniciar sesión**.

*[Captura de pantalla del formulario de inicio de sesión completado]*

### 3.2 Credenciales de Prueba

El sistema incluye tres usuarios de prueba para familiarizarse con la plataforma:

| Usuario | Correo | Contraseña | Rol |
|---------|--------|------------|-----|
| Juan Manuel Herrera | juanma@nutricampo.com.co | nutricampo123 | Administrador |
| Luisa Fernanda Ospina | luisa@nutricampo.com.co | nutricampo123 | Operaciones |
| Carlos Andres Gomez | contador@nutricampo.com.co | nutricampo123 | Contador |

### 3.3 Inicio de Sesión Exitoso

Una vez que el sistema verifique sus credenciales, será redirigido automáticamente a la pantalla principal. En la parte superior de la pantalla aparecerá su nombre y su rol.

*[Captura de pantalla de la pantalla principal después del inicio de sesión]*

---

## 4. Pantalla Principal

### 4.1 Elementos de la Pantalla

La pantalla principal se compone de las siguientes secciones:

**Barra superior:** muestra el logotipo de NutriCampo, el nombre del sistema, su nombre de usuario y el botón para cerrar sesión.

**Barra de pestañas:** contiene cinco pestañas para navegar entre las diferentes secciones del sistema:
- **Panel:** dashboard con indicadores y gráficos.
- **Registrar datos:** formularios para ingresar y administrar información.
- **Asistente IA:** interfaz para realizar consultas en lenguaje natural.
- **Alertas:** lista de transacciones que requieren atención.
- **Datos:** tablas con información detallada y opciones de exportación.

*[Captura de pantalla de la barra de pestañas]*

**Área de contenido:** cambia según la pestaña seleccionada.

---

## 5. Consultar Indicadores

### 5.1 Acceso al Panel de Indicadores

1. Haga clic en la pestaña **Panel** en la barra de navegación superior.
2. El sistema cargará automáticamente los indicadores del mes actual.

*[Captura de pantalla del panel con indicadores]*

### 5.2 Indicadores Disponibles

En la parte superior del panel encontrará cuatro tarjetas con los siguientes indicadores:

**Ventas del mes:** muestra el valor total de las ventas realizadas durante el mes calendario actual, junto con el número de transacciones.

**Margen bruto:** muestra el porcentaje de ganancia bruta sobre el total de ventas. Un margen positivo indica que los productos se están vendiendo por encima de su costo de producción.

**Costo de fruta / ventas:** muestra qué porcentaje de los ingresos por ventas se destina a la compra de frutas, la materia prima principal.

**Alertas activas:** muestra el número de ventas en los últimos 30 días que se realizaron a un precio inferior al costo de producción.

*[Captura de pantalla de las tarjetas de KPIs]*

---

## 6. Consultar Ventas

### 6.1 Visualización de Ventas Mensuales

En la sección **Ventas y margen** del panel, encontrará un gráfico de barras que muestra la evolución de las ventas mes a mes.

- Cada barra representa el total de ventas de un mes.
- Puede pasar el cursor sobre cada barra para ver el valor exacto.

*[Captura de pantalla del gráfico de ventas mensuales]*

### 6.2 Visualización de Ventas Detalladas

1. Haga clic en la pestaña **Datos**.
2. En la sección de ventas, encontrará una tabla con todas las transacciones registradas, ordenadas de la más reciente a la más antigua.

*[Captura de pantalla de la tabla de ventas]*

La tabla incluye la siguiente información por cada venta:
- Fecha de la transacción.
- Cliente que realizó la compra.
- Productos incluidos.
- Valor total.

---

## 7. Consultar Costos

### 7.1 Costo de Producción por Producto

En la sección **Ficha de costeo por producto** del panel, encontrará una cuadrícula con todos los productos activos. Cada tarjeta muestra:

- **Nombre del producto.**
- **Precio de venta:** valor al que se comercializa el producto.
- **Costo real:** costo unitario calculado según la receta y los precios vigentes de los insumos.
- **Margen:** diferencia entre el precio de venta y el costo real, expresada como porcentaje.

Los márgenes aparecen en color verde cuando son positivos y en color rojo cuando son negativos.

*[Captura de pantalla de la cuadrícula de productos con costos]*

### 7.2 Costo Histórico de Insumos

En el panel, el gráfico **Evolución del precio de la fruta** muestra cómo han variado los precios de las frutas semana a semana. Cada línea representa un tipo de fruta diferente (mango, mora, maracuyá, lulo).

*[Captura de pantalla del gráfico de evolución de precios de frutas]*

---

## 8. Consultar Rentabilidad

### 8.1 Margen por Producto

En el panel, el gráfico **Margen por producto** muestra de forma visual qué productos generan mayor rentabilidad. Las barras verdes representan productos con margen positivo; las barras rojas representan productos que se están vendiendo por debajo de su costo.

*[Captura de pantalla del gráfico de márgenes por producto]*

### 8.2 Interpretación de la Rentabilidad

- Un producto con margen positivo contribuye a las ganancias de la empresa.
- Un producto con margen negativo está generando pérdidas. El sistema alerta sobre estas situaciones para que la dirección pueda tomar decisiones correctivas, como ajustar el precio de venta o revisar la receta del producto.

---

## 9. Consultar Mediante Lenguaje Natural

### 9.1 Acceso al Asistente IA

1. Haga clic en la pestaña **Asistente IA**.
2. Se abrirá una interfaz de chat similar a un mensajero instantáneo.

*[Captura de pantalla de la interfaz del asistente IA]*

### 9.2 Realizar una Consulta

1. En la parte inferior de la pantalla, encontrará un campo de texto con el mensaje "Escribe tu pregunta aquí...".
2. Escriba su pregunta en español, como si estuviera hablando con un colega. Por ejemplo:
   - "¿Cuál es mi producto más rentable?"
   - "¿Cuánto vendimos el mes pasado?"
   - "¿Qué insumo ha subido más de precio?"
   - "¿Cuántas unidades se vendieron la semana pasada?"
3. Presione la tecla Enter o haga clic en el botón de enviar.

*[Captura de pantalla del campo de texto con una pregunta escrita]*

### 9.3 Preguntas Rápidas

El sistema incluye cuatro preguntas predefinidas que puede utilizar con un solo clic:

- **Producto más rentable**
- **Margen por línea**
- **Insumos más costosos**
- **Tendencia de ventas**

Haga clic en cualquiera de estos botones para obtener una respuesta inmediata.

*[Captura de pantalla de los botones de preguntas rápidas]*

### 9.4 Interpretación de la Respuesta

Después de enviar su pregunta, el sistema procesará la información y mostrará:

1. **El SQL generado:** la consulta que el sistema tradujo de su pregunta (aparece en un bloque de código).
2. **Los datos:** los resultados de la consulta presentados en un gráfico o una tabla.
3. **La explicación:** un texto en lenguaje natural que resume los hallazgos.

*[Captura de pantalla de una respuesta completa del asistente]*

### 9.5 Ejemplos de Preguntas

| Pregunta | Qué obtendrá |
|----------|-------------|
| "¿Cuál es mi producto más rentable?" | El producto con mayor margen de ganancia |
| "¿Cómo han variado las ventas en los últimos 3 meses?" | Gráfico con la tendencia de ventas |
| "¿Qué cliente genera más ingresos?" | El cliente con mayor volumen de compras |
| "¿Qué insumo ha subido más de precio este mes?" | El insumo con mayor incremento porcentual |
| "¿Cuántas unidades se vendieron la semana pasada?" | Total de unidades vendidas en la última semana |

---

## 10. Interpretar Dashboards

### 10.1 Dashboard del Panel

El dashboard reúne en una sola pantalla la información más relevante para la toma de decisiones:

- **Fila superior:** indicadores numéricos de alto nivel (ventas, margen, costos, alertas).
- **Fila media:** gráficos que muestran tendencias y comparaciones (ventas por mes, márgenes por producto, precios de frutas).
- **Fila inferior:** cuadrícula de costeo por producto.

### 10.2 Frecuencia de Actualización

Los datos del dashboard se actualizan en tiempo real a medida que se registran nuevas transacciones. Si acaba de registrar una venta o una compra, puede hacer clic en otra pestaña y volver al Panel para ver los indicadores actualizados.

---

## 11. Exportar Resultados

### 11.1 Exportar Ventas a CSV

1. Haga clic en la pestaña **Datos**.
2. En la parte superior de la sección de ventas, haga clic en el enlace **Descargar CSV de ventas**.
3. El sistema descargará un archivo con todas las ventas registradas.

*[Captura de pantalla del enlace de exportación]*

### 11.2 Exportar Compras a CSV

1. Haga clic en la pestaña **Datos**.
2. En la parte superior de la sección de compras, haga clic en el enlace **Descargar CSV de compras**.
3. El sistema descargará un archivo con todas las compras registradas.

### 11.3 Formato del Archivo

Los archivos CSV pueden abrirse en Microsoft Excel, Google Sheets o cualquier programa de hoja de cálculo. Los valores monetarios están formateados en pesos colombianos.

---

## 12. Administrar Perfil

### 12.1 Información del Usuario

En la barra superior, a la derecha, aparece su nombre y su rol. Esta información es proporcionada por el administrador del sistema y no puede modificarla desde la interfaz.

### 12.2 Gestión de Usuarios (Solo Administradores)

Si tiene rol de administrador, puede acceder a la funcionalidad de gestión de usuarios a través del sistema:

1. Navegue a la pestaña **Registrar datos**.
2. Los usuarios no se gestionan desde esta interfaz; consulte con el administrador del sistema para crear, modificar o eliminar cuentas de usuario.

---

## 13. Cerrar Sesión

1. En la barra superior, haga clic en el botón **Cerrar sesión** ubicado junto a su nombre.
2. El sistema cerrará su sesión y lo redirigirá a la pantalla de inicio de sesión.

*[Captura de pantalla del botón de cerrar sesión]*

**Recomendación:** cierre siempre la sesión cuando termine de utilizar el sistema, especialmente si está usando un computador compartido.

---

## 14. Preguntas Frecuentes

### 14.1 ¿Qué tipo de preguntas puedo hacer al asistente?

Puede hacer cualquier pregunta relacionada con ventas, compras, productos, clientes, costos e insumos. Por ejemplo: ventas por período, productos más vendidos, clientes con mayores compras, evolución de precios de insumos, márgenes de ganancia, etc.

### 14.2 ¿El asistente entiende cualquier forma de preguntar?

El asistente está entrenado para entender español natural. Puede preguntar de diferentes formas: "¿Cuánto vendimos?", "¿Cuáles fueron las ventas?", "Dame las ventas del mes".

### 14.3 ¿Puedo descargar los datos para analizarlos en Excel?

Sí. Desde la pestaña **Datos** puede descargar archivos CSV de ventas y compras que puede abrir en cualquier hoja de cálculo.

### 14.4 ¿Qué hago si olvido mi contraseña?

Contacte al administrador del sistema para solicitar el restablecimiento de su contraseña.

### 14.5 ¿El sistema funciona sin conexión a internet?

El sistema requiere conexión a la red local o a internet para funcionar, ya que el backend y la base de datos deben estar accesibles.

### 14.6 ¿Puedo usar el sistema desde mi celular?

La interfaz está diseñada para computadores de escritorio. Aunque puede visualizarse en dispositivos móviles, la experiencia óptima se obtiene en una pantalla de computador.

---

## 15. Errores Comunes

### 15.1 No puedo iniciar sesión

**Causas posibles:**
- El correo electrónico o la contraseña son incorrectos.
- Su cuenta está desactivada.

**Qué hacer:**
- Verifique que las credenciales estén escritas correctamente (distingue mayúsculas de minúsculas en la contraseña).
- Si el problema persiste, contacte al administrador del sistema.

### 15.2 El asistente no responde

**Causas posibles:**
- La API del asistente IA no está disponible temporalmente.
- El servidor backend está fuera de servicio.

**Qué hacer:**
- Espere unos segundos e intente nuevamente.
- Si el problema continúa, contacte al administrador del sistema.

### 15.3 Los datos no se actualizan

**Causas posibles:**
- El navegador tiene información en caché.
- La conexión con el servidor se interrumpió.

**Qué hacer:**
- Recargue la página del navegador.
- Si el problema persiste, cierre sesión y vuelva a iniciarla.

### 15.4 Veo un mensaje de "Error interno del servidor"

**Causas posibles:**
- Problema temporal en el servidor backend.
- Error al procesar una consulta muy compleja.

**Qué hacer:**
- Espere unos minutos e intente nuevamente.
- Si el error persiste, contacte al administrador del sistema.

---

## 16. Buenas Prácticas

### 16.1 Para Obtener Mejores Resultados del Asistente IA

- Sea específico en sus preguntas. En lugar de "¿cómo van las ventas?", pregunte "¿cuánto fue el total de ventas de pulpa de mango en junio?".
- Incluya referencias temporales cuando sea relevante ("este mes", "la semana pasada", "en el primer trimestre").
- Si la primera respuesta no es lo que esperaba, intente reformular la pregunta.

### 16.2 Para Mantener la Información Actualizada

- Registre las ventas y compras el mismo día en que ocurren.
- Actualice los precios de los insumos cuando reciba nueva cotización de sus proveedores.
- Revise las alertas periódicamente para identificar productos con rentabilidad comprometida.

### 16.3 Para la Seguridad de la Información

- No comparta su contraseña con otros usuarios.
- Cierre la sesión cuando termine de usar el sistema.
- No utilice el sistema en computadores públicos o no confiables.

---

*Documento elaborado para la asignatura Sistemas de Información e Informática Industrial — Universidad de Caldas — Julio 2026*
