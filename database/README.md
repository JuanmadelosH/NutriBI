# Base de Datos — NutriBI

Esquema MySQL para el ecosistema BI-GenIA NutriCampo.

## Stack

MySQL 8 + MySQL Workbench

## Estado

Completado. 10 tablas con datos de prueba realistas (8 productos, 10 clientes, 30 ventas, 16 compras, 24 insumos, 8 recetas, 3 usuarios).

## Estructura

| # | Tabla | Descripción | Filas Seed |
|---|-------|-------------|-----------|
| 1 | `usuarios` | Usuarios del sistema con roles | 3 |
| 2 | `productos` | Catálogo de productos (pulpa, mermelada, base) | 8 |
| 3 | `clientes` | Clientes B2B con tipo y ciudad | 10 |
| 4 | `costos_insumos` | Histórico de precios de materia prima por período | 24 |
| 5 | `ventas` | Cabecera de factura de venta | 30 |
| 6 | `detalle_ventas` | Líneas de cada factura con costeo | 71 |
| 7 | `compras` | Cabecera de compra a proveedores | 16 |
| 8 | `detalle_compras` | Insumos comprados por compra | 27 |
| 9 | `recetas` | Bill of Materials (producto ↔ insumo + cantidad) | 28 |
| 10 | `historial_consultas` | Trazabilidad de consultas IA | 0 (se llena en uso) |

## Instalación

```bash
# En MySQL Workbench o línea de comandos:
source database/Schema.sql
source database/Seed.sql
```

La base de datos `nutribi` se crea automáticamente en Schema.sql.

## Diagrama de Relaciones

- `ventas` → `clientes` (FK), `usuarios` (FK)
- `detalle_ventas` → `ventas` (FK CASCADE), `productos` (FK)
- `compras` → `usuarios` (FK)
- `detalle_compras` → `compras` (FK CASCADE), `costos_insumos` (FK)
- `recetas` → `productos` (FK CASCADE), `costos_insumos` (FK)
- `historial_consultas` → `usuarios` (FK)

## Conexión

```
Host: localhost
Puerto: 3306
Base de datos: nutribi
Usuario: root (configurable en backend/.env)
```

## Archivos

- `Schema.sql` — CREATE DATABASE + 10 CREATE TABLE con FK y ENGINE InnoDB
- `Seed.sql` — TRUNCATE + INSERT con datos realistas y verificación final de conteo
