const aiService = require('../services/aiService');
const dbService = require('../services/dbService');
const validateSQL = require('../middleware/validateSQL');

const responderConsulta = async (req, res) => {
  try {
    const { pregunta } = req.body;

    if (!pregunta || !pregunta.trim()) {
      return res.status(400).json({ error: 'La pregunta es requerida.' });
    }

    const sql = await aiService.generarSQL(pregunta);

    if (!validateSQL(sql)) {
      return res.status(400).json({ error: 'La consulta generada contiene operaciones no permitidas. Solo se permiten consultas SELECT.' });
    }

    const datos = await dbService.ejecutarConsulta(sql);

    const respuesta = await aiService.generarExplicacion(pregunta, datos);

    res.json({ sql, datos, respuesta });
  } catch (error) {
    console.error('Error en /api/consulta:', error.message);
    res.status(500).json({ error: 'Ocurrió un error al procesar tu consulta. Intenta de nuevo.' });
  }
};

module.exports = { responderConsulta };
