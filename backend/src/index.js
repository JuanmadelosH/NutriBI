require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authenticate, authorize } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const consultaRoutes = require('./routes/consulta');
const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const ventasRoutes = require('./routes/ventas');
const comprasRoutes = require('./routes/compras');
const insumosRoutes = require('./routes/insumos');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'NutriBI API funcionando' });
});

app.use('/api', authRoutes);

app.use('/api/consulta', authenticate, consultaRoutes);

app.use('/api/productos', authenticate, productosRoutes);
app.use('/api/clientes', authenticate, clientesRoutes);
app.use('/api/ventas', authenticate, ventasRoutes);
app.use('/api/compras', authenticate, comprasRoutes);
app.use('/api/insumos', authenticate, insumosRoutes);
app.use('/api/usuarios', authenticate, authorize('admin'), usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
