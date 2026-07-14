const aiService = require('../services/aiService');
const dbService = require('../services/dbService');
const validateSQL = require('../middleware/validateSQL');

const MOCK_DATOS = [
  { nombre: 'Pulpa de Mango', margen_total: 12500000, veces_vendido: 48 },
  { nombre: 'Pulpa de Mora', margen_total: 8900000, veces_vendido: 35 },
  { nombre: 'Mermelada de Maracuyá', margen_total: 5600000, veces_vendido: 22 },
  { nombre: 'Base Concentrada de Lulo', margen_total: 4200000, veces_vendido: 18 },
  { nombre: 'Pulpa de Maracuyá', margen_total: 3100000, veces_vendido: 15 },
];

const responderConsulta = async (req, res) => {
  try {
    const { pregunta } = req.body;

    if (!pregunta || !pregunta.trim()) {
      return res.status(400).json({ error: 'La pregunta es requerida.' });
    }

    if (pregunta.toLowerCase().includes('hola') || pregunta.toLowerCase().includes('adios') || pregunta.toLowerCase().includes('saludo') || pregunta.toLowerCase().includes('despedida') || pregunta.toLowerCase().includes('como estas')) {
      return res.json({ respuesta: await aiService.generaSaludoDespedida(pregunta)});
    }

    const sql = await aiService.generarSQL(pregunta);

    if (!validateSQL(sql)) {
      return res.status(400).json({ error: 'La consulta generada contiene operaciones no permitidas. Solo se permiten consultas SELECT.' });
    }

    let datos;
    try {
      datos = await dbService.ejecutarConsulta(sql);
    } catch (dbError) {
      console.log('Modo mock: BD no disponible, usando datos de prueba.');
      datos = MOCK_DATOS;
    }

    const respuesta = await aiService.generarExplicacion(pregunta, datos);

    res.json({ sql, datos, respuesta });
  } catch (error) {
    console.error('Error en /api/consulta:', error.message);
    res.status(500).json({ error: 'Ocurrió un error al procesar tu consulta. Intenta de nuevo.' });
  }
};

module.exports = { responderConsulta };
