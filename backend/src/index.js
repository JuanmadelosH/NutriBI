require('dotenv').config();
const express = require('express');
const cors = require('cors');
const consultaRoutes = require('./routes/consulta');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', consultaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'NutriBI API funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
