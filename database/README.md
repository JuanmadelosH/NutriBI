# Base de Datos — Persona C

## Stack
MySQL + MySQL Workbench

## Tareas

### Día 1
- [ ] Crear `database/schema.sql` con las 8 tablas:

### Tablas

| # | Tabla | Descripción | Columnas clave |
|---|-------|-------------|----------------|
| 1 | `productos` | Catálogo de productos | id, nombre, tipo, precio_venta, costo_produccion |
| 2 | `clientes` | Clientes B2B | id, nombre, tipo_cliente, ciudad, telefono |
| 3 | `ventas` | Facturas de venta | id, cliente_id, fecha, total, estado |
| 4 | `detalle_ventas` | Productos vendidos | id, venta_id, producto_id, cantidad, precio_unitario, subtotal |
| 5 | `compras` | Compras a proveedores | id, proveedor, fecha, total |
| 6 | `detalle_compras` | Insumos comprados | id, compra_id, insumo, cantidad, costo_unitario |
| 7 | `costos_insumos` | Histórico precios materia prima | id, insumo, fecha, precio_kilo |
| 8 | `usuarios` | Usuarios del sistema | id, nombre, email, rol |

- [ ] Escribir `database/seed.sql` con datos de prueba:
  - 5 productos (pulpa de mango, mora, maracuyá, mermelada, base concentrada)
  - 10 clientes B2B
  - 50 ventas con detalle
  - Compras y costos históricos
- [ ] Ejecutar schema + seed en MySQL Workbench
- [ ] Probar 3 consultas manuales

### Día 2
- [ ] Ayudar a Backend con consultas complejas (JOINs, GROUP BY)
- [ ] Probar preguntas de negocio 1-4

### Día 3
- [ ] Prueba integral (preguntas 1-7)
- [ ] Backup del schema
- [ ] Documentación de tablas y relaciones

## Preguntas de negocio

1. ¿Cuál es mi producto más rentable?
2. ¿Qué producto redujo más su margen este mes?
3. ¿Cómo han variado las ventas en los últimos 3 meses?
4. ¿Qué cliente genera más ingresos?
5. ¿Cuál es el margen de ganancia por línea de producto?
6. ¿Qué insumo ha subido más de precio este mes?
7. ¿Cuántas unidades se vendieron la semana pasada?

## Conexión

```
Host: localhost
Puerto: 3306
Base de datos: nutribi
Usuario: root
```
