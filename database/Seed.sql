USE nutribi;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE detalle_compras;
TRUNCATE TABLE detalle_ventas;
TRUNCATE TABLE recetas;
TRUNCATE TABLE historial_consultas;
TRUNCATE TABLE ventas;
TRUNCATE TABLE compras;
TRUNCATE TABLE costos_insumos;
TRUNCATE TABLE productos;
TRUNCATE TABLE clientes;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO usuarios (id_usuario, nombre, correo, password, rol, activo) VALUES
  (1, 'Juan Manuel Herrera', 'juanma@nutricampo.com.co', '$2b$10$Vc/cX/toAj2xLhllUAgKZ.Zt4A0i80/ap3iq1037/.6yQmf6NDH3.', 'admin', TRUE),
  (2, 'Luisa Fernanda Ospina', 'luisa@nutricampo.com.co', '$2b$10$Vc/cX/toAj2xLhllUAgKZ.Zt4A0i80/ap3iq1037/.6yQmf6NDH3.', 'operacion', TRUE),
  (3, 'Carlos Andres Gomez', 'contador@nutricampo.com.co', '$2b$10$Vc/cX/toAj2xLhllUAgKZ.Zt4A0i80/ap3iq1037/.6yQmf6NDH3.', 'contador', TRUE);
  
INSERT INTO productos (id_producto, nombre, categoria, presentacion, precio_venta, activo) VALUES
  (1, 'Pulpa de Mango', 'Pulpa congelada', '1 kg', 12000.00, TRUE),
  (2, 'Pulpa de Mora', 'Pulpa congelada', '1 kg', 13500.00, TRUE),
  (3, 'Pulpa de Maracuya', 'Pulpa congelada', '1 kg', 14000.00, TRUE),
  (4, 'Mermelada de Mora', 'Mermelada', '250 g', 9000.00, TRUE),
  (5, 'Base Concentrada de Maracuya', 'Base concentrada', '1 L', 8500.00, TRUE),
  (6, 'Pulpa de Lulo', 'Pulpa congelada', '1 kg', 15500.00, TRUE),
  (7, 'Mermelada de Mango', 'Mermelada', '250 g', 9500.00, TRUE),
  (8, 'Base Concentrada de Mora', 'Base concentrada', '1 L', 9000.00, TRUE);
  
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
  (3, 'Mango Tommy', 'Fruta', 'kg', 3200.00, '2026-05-01'),
  (4, 'Mango Tommy', 'Fruta', 'kg', 3500.00, '2026-07-01'),
  (5, 'Maracuya', 'Fruta', 'kg', 4620.00, '2026-02-01'),
  (6, 'Maracuya', 'Fruta', 'kg', 4350.00, '2026-03-01'),
  (7, 'Maracuya', 'Fruta', 'kg', 4700.00, '2026-06-01'),
  (8, 'Mora', 'Fruta', 'kg', 3800.00, '2026-02-01'),
  (9, 'Mora', 'Fruta', 'kg', 4100.00, '2026-04-01'),
  (10, 'Mora', 'Fruta', 'kg', 4400.00, '2026-07-01'),
  (11, 'Lulo', 'Fruta', 'kg', 5200.00, '2026-05-01'),
  (12, 'Lulo', 'Fruta', 'kg', 5800.00, '2026-07-01'),
  (13, 'Azucar', 'Aditivo', 'kg', 3280.00, '2026-03-01'),
  (14, 'Azucar', 'Aditivo', 'kg', 3250.00, '2026-04-01'),
  (15, 'Azucar', 'Aditivo', 'kg', 3400.00, '2026-07-01'),
  (16, 'Acido citrico', 'Aditivo', 'kg', 8720.00, '2026-03-01'),
  (17, 'Acido citrico', 'Aditivo', 'kg', 8660.00, '2026-04-01'),
  (18, 'Acido citrico', 'Aditivo', 'kg', 9100.00, '2026-07-01'),
  (19, 'Frasco vidrio 250 g', 'Empaque', 'unidad', 710.00, '2026-04-01'),
  (20, 'Frasco vidrio 250 g', 'Empaque', 'unidad', 780.00, '2026-07-01'),
  (21, 'Botella PET 1 L', 'Empaque', 'unidad', 510.00, '2026-06-01'),
  (22, 'Pectina', 'Aditivo', 'kg', 12500.00, '2026-04-01'),
  (23, 'Pectina', 'Aditivo', 'kg', 13200.00, '2026-07-01'),
  (24, 'Envase plastico 1 kg', 'Empaque', 'unidad', 350.00, '2026-06-01');
  
  INSERT INTO ventas (id_venta, fecha, id_cliente, id_usuario, total) VALUES
  (1, '2026-01-15', 1, 1, 480000.00),
  (2, '2026-01-22', 5, 2, 620000.00),
  (3, '2026-02-05', 7, 2, 88720.00),
  (4, '2026-02-12', 1, 1, 362020.00),
  (5, '2026-02-18', 5, 2, 540000.00),
  (6, '2026-02-27', 1, 1, 362020.00),
  (7, '2026-03-06', 7, 2, 278840.00),
  (8, '2026-03-07', 1, 1, 509160.00),
  (9, '2026-03-14', 9, 1, 176400.00),
  (10, '2026-03-20', 5, 1, 715000.00),
  (11, '2026-04-03', 3, 1, 244950.00),
  (12, '2026-04-10', 1, 1, 318460.00),
  (13, '2026-04-18', 5, 2, 580000.00),
  (14, '2026-04-25', 8, 1, 195000.00),
  (15, '2026-05-05', 7, 2, 310000.00),
  (16, '2026-05-12', 3, 1, 244950.00),
  (17, '2026-05-19', 5, 1, 490000.00),
  (18, '2026-05-26', 10, 2, 320000.00),
  (19, '2026-06-02', 2, 1, 285000.00),
  (20, '2026-06-07', 7, 2, 191820.00),
  (21, '2026-06-11', 5, 1, 507520.00),
  (22, '2026-06-18', 10, 2, 370940.00),
  (23, '2026-06-25', 1, 2, 445000.00),
  (24, '2026-07-02', 5, 1, 650000.00),
  (25, '2026-07-04', 7, 2, 278000.00),
  (26, '2026-07-08', 1, 1, 510000.00),
  (27, '2026-07-10', 5, 2, 385000.00),
  (28, '2026-07-14', 3, 1, 320000.00),
  (29, '2026-07-16', 8, 1, 178000.00),
  (30, '2026-07-18', 1, 2, 420000.00);
  
  INSERT INTO detalle_ventas (id_detalle_venta, id_venta, id_producto, cantidad, precio_unitario, costo_unitario, subtotal) VALUES
  -- Ene: ventas 1-2
  (1, 1, 1, 20, 12000, 4800, 240000),
  (2, 1, 5, 20, 8500, 3200, 170000),
  (3, 1, 7, 8, 9500, 4200, 76000),
  (4, 2, 3, 18, 14000, 6200, 252000),
  (5, 2, 6, 15, 15500, 7500, 232500),
  (6, 2, 4, 15, 9000, 4100, 135000),
  -- Feb: ventas 3-6
  (7, 3, 4, 12, 9000, 4100, 108000),
  (8, 4, 1, 15, 12000, 4800, 180000),
  (9, 4, 2, 10, 13500, 5800, 135000),
  (10, 5, 3, 20, 14000, 6200, 280000),
  (11, 5, 5, 20, 8500, 3200, 170000),
  (12, 6, 7, 15, 9500, 4200, 142500),
  (13, 6, 1, 18, 12000, 4800, 216000),
  -- Mar: ventas 7-10
  (14, 7, 1, 10, 12000, 4800, 120000),
  (15, 7, 2, 8, 13500, 5800, 108000),
  (16, 8, 3, 15, 14000, 6200, 210000),
  (17, 8, 6, 12, 15500, 7500, 186000),
  (18, 8, 5, 10, 8500, 3200, 85000),
  (19, 9, 4, 10, 9000, 4100, 90000),
  (20, 9, 7, 9, 9500, 4200, 85500),
  (21, 10, 1, 25, 12000, 4800, 300000),
  (22, 10, 3, 15, 14000, 6200, 210000),
  (23, 10, 8, 22, 9000, 3800, 198000),
  -- Abr: ventas 11-14
  (24, 11, 1, 10, 12000, 4900, 120000),
  (25, 11, 2, 8, 13500, 5900, 108000),
  (26, 12, 3, 12, 14000, 6300, 168000),
  (27, 12, 5, 15, 8500, 3300, 127500),
  (28, 13, 1, 20, 12000, 4900, 240000),
  (29, 13, 6, 14, 15500, 7600, 217000),
  (30, 13, 4, 12, 9000, 4200, 108000),
  (31, 14, 7, 10, 9500, 4300, 95000),
  (32, 14, 8, 10, 9000, 3900, 90000),
  -- May: ventas 15-18
  (33, 15, 1, 12, 12000, 5000, 144000),
  (34, 15, 3, 10, 14000, 6400, 140000),
  (35, 16, 2, 10, 13500, 6000, 135000),
  (36, 16, 6, 8, 15500, 7700, 124000),
  (37, 17, 1, 18, 12000, 5000, 216000),
  (38, 17, 5, 20, 8500, 3400, 170000),
  (39, 18, 4, 15, 9000, 4300, 135000),
  (40, 18, 7, 12, 9500, 4400, 114000),
  (41, 18, 8, 8, 9000, 4000, 72000),
  -- Jun: ventas 19-23
  (42, 19, 1, 10, 12000, 5000, 120000),
  (43, 19, 2, 12, 13500, 6000, 162000),
  (44, 20, 5, 16, 8500, 3400, 136000),
  (45, 20, 4, 6, 9000, 4300, 54000),
  (46, 21, 3, 14, 14000, 6500, 196000),
  (47, 21, 6, 12, 15500, 7800, 186000),
  (48, 21, 1, 10, 12000, 5000, 120000),
  (49, 22, 2, 18, 13500, 6000, 243000),
  (50, 22, 7, 14, 9500, 4400, 133000),
  (51, 23, 1, 15, 12000, 5000, 180000),
  (52, 23, 3, 12, 14000, 6500, 168000),
  (53, 23, 8, 10, 9000, 4000, 90000),
  -- Jul: ventas 24-30 (mes actual, KPI debe mostrar datos)
  (54, 24, 3, 20, 14000, 6500, 280000),
  (55, 24, 6, 15, 15500, 7800, 232500),
  (56, 24, 1, 12, 12000, 5000, 144000),
  (57, 25, 2, 10, 13500, 6000, 135000),
  (58, 25, 4, 14, 9000, 4300, 126000),
  (59, 26, 1, 22, 12000, 5000, 264000),
  (60, 26, 5, 18, 8500, 3400, 153000),
  (61, 26, 7, 10, 9500, 4400, 95000),
  (62, 27, 3, 12, 14000, 6500, 168000),
  (63, 27, 8, 15, 9000, 4000, 135000),
  (64, 27, 2, 6, 13500, 6000, 81000),
  (65, 28, 1, 14, 12000, 5000, 168000),
  (66, 28, 6, 10, 15500, 7800, 155000),
  (67, 29, 4, 12, 9000, 4300, 108000),
  (68, 29, 7, 8, 9500, 4400, 76000),
  (69, 30, 1, 18, 12000, 5000, 216000),
  (70, 30, 3, 8, 14000, 6500, 112000),
  (71, 30, 5, 12, 8500, 3400, 102000);
  
  INSERT INTO compras (id_compra, fecha, proveedor, id_usuario, total) VALUES
  (1, '2026-01-20', 'Plaza de Abastos Manizales', 1, 750000.0),
  (2, '2026-02-10', 'Agricultor La Palma', 2, 885000.0),
  (3, '2026-03-05', 'Cooperativa Fruticola del Eje', 1, 920000.0),
  (4, '2026-03-20', 'Empaques Andinos S.A.S.', 2, 165000.0),
  (5, '2026-04-08', 'Distribuidora El Campo', 1, 1240000.0),
  (6, '2026-04-22', 'Plaza de Abastos Manizales', 2, 680000.0),
  (7, '2026-05-06', 'Agricultor La Palma', 1, 960000.0),
  (8, '2026-05-21', 'Cooperativa Fruticola del Eje', 2, 1150000.0),
  (9, '2026-06-02', 'Plaza de Abastos Manizales', 1, 880000.0),
  (10, '2026-06-11', 'Empaques Andinos S.A.S.', 2, 195000.0),
  (11, '2026-06-18', 'Distribuidora El Campo', 1, 310000.0),
  (12, '2026-06-25', 'Agricultor La Palma', 2, 1100000.0),
  (13, '2026-07-02', 'Plaza de Abastos Manizales', 2, 873600.0),
  (14, '2026-07-09', 'Cooperativa Fruticola del Eje', 1, 980000.0),
  (15, '2026-07-16', 'Empaques Andinos S.A.S.', 2, 205000.0),
  (16, '2026-07-22', 'Distribuidora El Campo', 1, 380000.0);
  
  INSERT INTO detalle_compras (id_detalle_compra, id_compra, id_insumo, cantidad, costo_unitario, subtotal) VALUES
  (1, 1, 1, 250.0, 2330.00, 582500),
  (2, 1, 13, 50.0, 3280.00, 164000),
  (3, 2, 2, 200.0, 2800.00, 560000),
  (4, 2, 8, 80.0, 3800.00, 304000),
  (5, 3, 5, 160.0, 4620.00, 739200),
  (6, 3, 6, 40.0, 4350.00, 174000),
  (7, 4, 19, 200.0, 710.00, 142000),
  (8, 5, 9, 160.0, 4100.00, 656000),
  (9, 5, 14, 150.0, 3250.00, 487500),
  (10, 6, 3, 200.0, 3200.00, 640000),
  (11, 7, 11, 120.0, 5200.00, 624000),
  (12, 7, 24, 900.0, 350.00, 315000),
  (13, 8, 7, 180.0, 4700.00, 846000),
  (14, 8, 21, 500.0, 510.00, 255000),
  (15, 9, 4, 200.0, 3500.00, 700000),
  (16, 9, 13, 60.0, 3280.00, 196800),
  (17, 10, 19, 300.0, 710.00, 213000),
  (18, 11, 22, 20.0, 12500.00, 250000),
  (19, 12, 6, 180.0, 4350.00, 783000),
  (20, 12, 8, 80.0, 3800.00, 304000),
  (21, 13, 4, 180.0, 3500.00, 630000),
  (22, 13, 24, 600.0, 350.00, 210000),
  (23, 14, 10, 160.0, 4400.00, 704000),
  (24, 14, 18, 30.0, 9100.00, 273000),
  (25, 15, 20, 200.0, 780.00, 156000),
  (26, 16, 23, 20.0, 13200.00, 264000),
  (27, 16, 15, 30.0, 3400.00, 102000);
  
  INSERT INTO recetas (id_producto, id_insumo, cantidad) VALUES
  -- Pulpa de Mango: 1.5 kg Mango + 0.3 kg Azucar + 0.05 kg Acido citrico + 1 envase plastico
  (1, 4, 1.5),
  (1, 15, 0.3),
  (1, 18, 0.05),
  (1, 24, 1.0),
  -- Pulpa de Mora: 1.2 kg Mora + 0.4 kg Azucar + 1 envase plastico
  (2, 10, 1.2),
  (2, 15, 0.4),
  (2, 24, 1.0),
  -- Pulpa de Maracuya: 1.3 kg Maracuya + 0.05 kg Acido citrico + 1 envase plastico
  (3, 7, 1.3),
  (3, 18, 0.05),
  (3, 24, 1.0),
  -- Mermelada de Mora: 0.8 kg Mora + 0.6 kg Azucar + 0.05 kg Pectina + 1 frasco
  (4, 10, 0.8),
  (4, 15, 0.6),
  (4, 23, 0.05),
  (4, 20, 1.0),
  -- Base Concentrada de Maracuya: 1.0 kg Maracuya + 0.1 kg Acido citrico + 1 botella PET
  (5, 7, 1.0),
  (5, 18, 0.1),
  (5, 21, 1.0),
  -- Pulpa de Lulo: 1.3 kg Lulo + 0.3 kg Azucar + 1 envase plastico
  (6, 12, 1.3),
  (6, 15, 0.3),
  (6, 24, 1.0),
  -- Mermelada de Mango: 1.0 kg Mango + 0.5 kg Azucar + 0.04 kg Pectina + 1 frasco
  (7, 4, 1.0),
  (7, 15, 0.5),
  (7, 23, 0.04),
  (7, 20, 1.0),
  -- Base Concentrada de Mora: 1.0 kg Mora + 0.2 kg Azucar + 0.08 kg Acido citrico + 1 botella PET
  (8, 10, 1.0),
  (8, 15, 0.2),
  (8, 18, 0.08),
  (8, 21, 1.0);

  SELECT 'usuarios' AS tabla, COUNT(*) AS filas FROM usuarios
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'clientes', COUNT(*) FROM clientes
UNION ALL SELECT 'costos_insumos', COUNT(*) FROM costos_insumos
UNION ALL SELECT 'ventas', COUNT(*) FROM ventas
UNION ALL SELECT 'detalle_ventas', COUNT(*) FROM detalle_ventas
UNION ALL SELECT 'compras', COUNT(*) FROM compras
UNION ALL SELECT 'detalle_compras', COUNT(*) FROM detalle_compras
UNION ALL SELECT 'recetas', COUNT(*) FROM recetas
UNION ALL SELECT 'historial_consultas', COUNT(*) FROM historial_consultas;

