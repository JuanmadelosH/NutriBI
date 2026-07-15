CREATE DATABASE IF NOT EXISTS nutribi;

USE nutribi;

CREATE TABLE usuarios (
  id_usuario  INT AUTO_INCREMENT PRIMARY KEY,      
  nombre      VARCHAR(80)  NOT NULL,             
  correo      VARCHAR(120) NOT NULL UNIQUE,       
  rol         ENUM('admin','operacion','contador') NOT NULL DEFAULT 'operacion',
  activo      BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;              -- soporta llaves foraneas                      


CREATE TABLE productos (
  id_producto   INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(80)  NOT NULL,             
  categoria     VARCHAR(40)  NOT NULL,             
  presentacion  VARCHAR(30)  NOT NULL,             
  precio_venta  DECIMAL(10,2) NOT NULL,            
  activo        BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE clientes (
  id_cliente  INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,               
  tipo        VARCHAR(40)  NOT NULL,               
  ciudad      VARCHAR(50),                          
  contacto    VARCHAR(80)
) ENGINE=InnoDB;

CREATE TABLE costos_insumos (
  id_insumo      INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(80) NOT NULL,             
  tipo           VARCHAR(30) NOT NULL,             
  unidad         VARCHAR(15) NOT NULL,             
  costo_unitario DECIMAL(10,2) NOT NULL,          
  periodo        DATE NOT NULL                    
) ENGINE=InnoDB;

CREATE TABLE ventas (
  id_venta    INT AUTO_INCREMENT PRIMARY KEY,
  fecha       DATE NOT NULL,
  id_cliente  INT NOT NULL,                        
  id_usuario  INT NOT NULL,                        
  total       DECIMAL(12,2) NOT NULL DEFAULT 0,    

  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE detalle_ventas (
  id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
  id_venta         INT NOT NULL,                  
  id_producto      INT NOT NULL,                  
  cantidad         INT NOT NULL,
  precio_unitario  DECIMAL(10,2) NOT NULL,         
  costo_unitario   DECIMAL(10,2) NOT NULL,         
  subtotal         DECIMAL(12,2) NOT NULL,         
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
) ENGINE=InnoDB;


CREATE TABLE compras (
  id_compra   INT AUTO_INCREMENT PRIMARY KEY,
  fecha       DATE NOT NULL,
  proveedor   VARCHAR(100) NOT NULL,               -- plaza de mercado / agricultor
  id_usuario  INT NOT NULL,
  total       DECIMAL(12,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE detalle_compras (
  id_detalle_compra INT AUTO_INCREMENT PRIMARY KEY,
  id_compra         INT NOT NULL,                  -- ¿a qué compra pertenece?
  id_insumo         INT NOT NULL,                  -- ¿qué insumo se compró?
  cantidad          DECIMAL(10,2) NOT NULL,        -- puede ser 12.5 kg
  costo_unitario    DECIMAL(10,2) NOT NULL,        -- costo pagado en ese momento
  subtotal          DECIMAL(12,2) NOT NULL,        -- cantidad * costo_unitario
  FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
  FOREIGN KEY (id_insumo) REFERENCES costos_insumos(id_insumo)
) ENGINE=InnoDB;

