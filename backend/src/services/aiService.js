const dbService = require('./dbService');

const generarSQL = async (pregunta) => {
  const esquema = await dbService.obtenerEsquema();

  const prompt = `
Eres un asistente que traduce preguntas en español a SQL para una base de datos MySQL de una empresa agroindustrial llamada NutriCampo.

Esquema de la base de datos:
${esquema}

Reglas:
- Genera únicamente sentencias SELECT.
- No uses DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, CREATE, ni ninguna operación de modificación.
- Usa nombres de columna y tabla exactamente como están definidos.
- Si la pregunta no tiene sentido con los datos disponibles, responde solo con: -- NO SE PUEDE RESPONDER

Pregunta del usuario: "${pregunta}"

SQL generado:`;

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let sql = response.text().trim();

    if (sql.startsWith('```sql')) sql = sql.replace(/```sql\s*/i, '');
    if (sql.startsWith('```')) sql = sql.replace(/```/g, '');
    sql = sql.trim();

    if (sql.startsWith('-- NO SE PUEDE RESPONDER')) {
      throw new Error('No se pudo generar una consulta para esta pregunta.');
    }

    return sql;
  } catch (error) {
    if (error.message.includes('connect') || error.message.includes('AI')) {
      throw new Error('Error al conectar con el servicio de IA.');
    }
    throw error;
  }
};

const generarExplicacion = async (pregunta, datos) => {
  const prompt = `
Eres un analista de negocios. Basado en la siguiente pregunta y datos, genera una explicación clara y profesional en español.

Pregunta: "${pregunta}"

Datos obtenidos: ${JSON.stringify(datos)}

Explicación:`;

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch {
    return 'No se pudo generar una explicación en este momento.';
  }
};

module.exports = { generarSQL, generarExplicacion };
