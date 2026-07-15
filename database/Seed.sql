USE nutribi;

INSERT INTO usuarios (id_usuario, nombre, correo, rol, activo) VALUES
  (1, 'Juan Manuel Herrera', 'juanma@nutricampo.com.co', 'admin', TRUE),
  (2, 'Luisa Fernanda Ospina', 'luisa@nutricampo.com.co', 'operacion', TRUE),
  (3, 'Carlos Andres Gomez', 'contador@nutricampo.com.co', 'contador', TRUE);
  
INSERT INTO productos (id_producto, nombre, categoria, presentacion, precio_venta, activo) VALUES
  (1, 'Pulpa de Mango', 'Pulpa congelada', '1 kg', 12000.00, TRUE),
  (2, 'Pulpa de Mora', 'Pulpa congelada', '1 kg', 13500.00, TRUE),
  (3, 'Pulpa de Maracuya', 'Pulpa congelada', '1 kg', 14000.00, TRUE),
  (4, 'Mermelada de Mora', 'Mermelada', '250 g', 9000.00, TRUE),
  (5, 'Base Concentrada de Maracuya', 'Base concentrada', '1 L', 8500.00, TRUE);
  
INSERT INTO clientes (id_cliente, nombre, tipo, ciudad, contacto) VALUES
  (1, 'Restaurante La Fogata', 'Restaurante', 'Manizales', 'Ana Ruiz'),
  (2, 'Catering Andino', 'Catering', 'Manizales', 'Pedro Salas'),
  (3, 'Fruteria El Vergel', 'Fruteria', 'Pereira', 'Marta Diaz'),
  (4, 'Restaurante Sabor Caldas', 'Restaurante', 'Manizales', 'Jose Lopez'),
  (5, 'Hotel Termales del Ruiz', 'Catering', 'Villamaria', 'Sofia Cano'),
  (6, 'Micromercado La Plaza', 'Micromercado', 'Chinchina', 'Ivan Mejia'),
  (7, 'Cafe del Parque', 'Restaurante', 'Manizales', 'Laura Peña'),
  (8, 'Eventos Nevado', 'Catering', 'Pereira', 'Diego Cruz'),
  (9, 'Fruteria Tropical', 'Fruteria', 'Armenia', 'Camila Rios'),
  (10, 'Micromercado San Jose', 'Micromercado', 'Manizales', 'Hernan Vega');
  
INSERT INTO costos_insumos (id_insumo, nombre, tipo, unidad, costo_unitario, periodo) VALUES
  (1, 'Mango Tommy', 'Fruta', 'kg', 2330.00, '2026-02-01'),
  (2, 'Mango Tommy', 'Fruta', 'kg', 2800.00, '2026-03-01'),
  (3, 'Maracuya', 'Fruta', 'kg', 4620.00, '2026-02-01'),
  (4, 'Maracuya', 'Fruta', 'kg', 4350.00, '2026-03-01'),
	(5, 'Azucar', 'Aditivo', 'kg', 3280.00, '2026-03-01'),
  (6, 'Azucar', 'Aditivo', 'kg', 3250.00, '2026-04-01'),
   (7, 'Acido citrico', 'Aditivo', 'kg', 8720.00, '2026-03-01'),
  (8, 'Acido citrico', 'Aditivo', 'kg', 8660.00, '2026-04-01'),
  (9, 'Frasco vidrio 250 g', 'Empaque', 'unidad', 710.00, '2026-04-01'),
  (10, 'Botella PET 1 L', 'Empaque', 'unidad', 510.00, '2026-06-01');
  
  INSERT INTO ventas (id_venta, fecha, id_cliente, id_usuario, total) VALUES
  (1, '2026-06-07', 7, 2, 191820.00),
  (2, '2026-03-07', 1, 1, 509160.00),
    (3, '2026-05-12', 3, 1, 244950.00),
  (4, '2026-05-03', 1, 1, 318460.00),
   (5, '2026-02-05', 7, 2, 88720.00),
  (6, '2026-06-25', 10, 2, 370940.00),
   (7, '2026-02-27', 1, 1, 362020.00),
  (8, '2026-03-14', 9, 1, 176400.00),
  (9, '2026-03-06', 7, 2, 278840.00),
  (10, '2026-06-21', 5, 1, 507520.00);
  
  INSERT INTO detalle_ventas (id_detalle_venta, id_venta, id_producto, cantidad, precio_unitario, costo_unitario, subtotal) VALUES
  (1, 1, 5, 16, 8060.00, 1909.00, 128960.00),
  (2, 1, 4, 7, 8980.00, 2366.00, 62860.00),
  (3, 6, 2, 24, 10880.00, 5305.00, 261120.00),
  (4, 7, 4, 23, 7400.00, 2408.00, 170200.00),
  (5, 10, 3, 11, 12720.00, 5618.00, 139920.00),
  (6, 2, 5, 13, 7690.00, 2199.00, 99970.00),
  (7, 4, 1, 4, 11880.00, 3030.00, 47520.00),
  (8, 8, 5, 5, 8240.00, 2276.00, 41200.00),
  (9, 2, 2, 7, 12980.00, 5364.00, 90860.00),
  (10, 10, 3, 14, 12910.00, 4862.00, 180740.00);
  
  INSERT INTO compras (id_compra, fecha, proveedor, id_usuario, total) VALUES
  (1, '2026-06-02', 'Plaza de Abastos Manizales', 1, 880000.0),
  (2, '2026-06-05', 'Agricultor La Palma', 2, 718390.0),
  (3, '2026-06-11', 'Cooperativa Fruticola del Eje', 1, 996000.0),
  (4, '2026-06-16', 'Empaques Andinos S.A.S.', 2, 175000.0),
  (5, '2026-06-24', 'Distribuidora El Campo', 1, 288000.0),
  (6, '2026-07-02', 'Plaza de Abastos Manizales', 2, 873600.0),
  (7, '2026-07-07', 'Agricultor La Palma', 1, 998955.0),
  (8, '2026-07-13', 'Cooperativa Fruticola del Eje', 2, 856050.0),
  (9, '2026-07-18', 'Empaques Andinos S.A.S.', 1, 171000.0),
  (10, '2026-07-22', 'Distribuidora El Campo', 2, 358600.0);
  
  INSERT INTO detalle_compras (id_detalle_compra, id_compra, id_insumo, cantidad, costo_unitario, subtotal) VALUES
  (1, 1, 1, 320.0, 2750.00, 880000.0),
  (2, 2, 2, 180.5, 3980.00, 718390.0),
  (3, 3, 3, 240.0, 4150.00, 996000.0),
  (4, 4, 5, 500.0, 350.00, 175000.0),
  (5, 5, 4, 90.0, 3200.00, 288000.0),
  (6, 6, 6, 280.0, 3120.00, 873600.0),
  (7, 7, 7, 210.75, 4740.00, 998955.0),
  (8, 8, 8, 195.0, 4390.00, 856050.0),
  (9, 9, 10, 450.0, 380.00, 171000.0),
  (10, 10, 9, 110.0, 3260.00, 358600.0);
  
  SELECT 'usuarios' AS tabla, COUNT(*) AS filas FROM usuarios
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL SELECT 'costos_insumos', COUNT(*) FROM costos_insumos
UNION ALL SELECT 'ventas', COUNT(*) FROM ventas
UNION ALL SELECT 'detalle_ventas', COUNT(*) FROM detalle_ventas
UNION ALL SELECT 'compras', COUNT(*) FROM compras
UNION ALL SELECT 'detalle_compras', COUNT(*) FROM detalle_compras;

