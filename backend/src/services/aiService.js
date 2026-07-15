const { GoogleGenAI } = require('@google/genai');
const { encontrarSQL } = require('./predefinedQueries');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let esquemaCache = null;
let esquemaCacheTime = 0;
const ESQUEMA_CACHE_TTL = 5 * 60 * 1000;

const getEsquemaCache = async (dbService) => {
  const ahora = Date.now();
  if (!esquemaCache || (ahora - esquemaCacheTime) > ESQUEMA_CACHE_TTL) {
    esquemaCache = await dbService.obtenerEsquema();
    esquemaCacheTime = ahora;
  }
  return esquemaCache;
};

const llamarGemini = async (prompt, maxTokens = 500) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL || 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: maxTokens,
      },
    });
    return (response.text || '').trim();
  } finally {
    clearTimeout(timeout);
  }
};

const generarExplicacionLocal = (pregunta, datos) => {
  if (!datos || datos.length === 0) {
    return 'No se encontraron datos para tu consulta.';
  }

  const keys = Object.keys(datos[0]);
  const nombreKey = keys.find(k => /nombre|producto|cliente|insumo|mes/i.test(k)) || keys[0];
  const valorKey = keys.find(k => /total|margen|ingreso|venta|precio|cantidad|monto/i.test(k)) || keys[keys.length - 1];
  const topValor = typeof datos[0][valorKey] === 'number'
    ? `$${datos[0][valorKey].toLocaleString('es-CO')}`
    : datos[0][valorKey];

  return `Se encontraron ${datos.length} resultado(s). El principal es "${datos[0][nombreKey]}" con ${topValor}. Revisa la tabla para más detalle.`;
};

const generarSQL = async (pregunta) => {
  const predefinida = encontrarSQL(pregunta);
  if (predefinida) return predefinida.sql;

  const dbService = require('./dbService');
  const esquema = await getEsquemaCache(dbService);

  const prompt = `Eres un asistente que traduce preguntas en español a SQL para MySQL de NutriCampo (agroindustria de frutas colombiana).

Esquema:
${esquema}

Reglas:
- Solo SELECT. No uses DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, CREATE, REPLACE, EXEC, EXECUTE, CALL.
- Usa nombres exactos de columnas y tablas.
- Responde SOLO con el SQL, SIN explicaciones ni formato.
- Si la pregunta no corresponde a los datos, responde exactamente: -- NO SE PUEDE RESPONDER
- las unicas exepciones son cuando el cliente diga hola o adios o cualquier saludo o despedida, en estos casos responde cordialmente en español y no en SQL.

Pregunta: "${pregunta}"

SQL:`;

  try {
    let sql = await llamarGemini(prompt);

    sql = sql.replace(/^```sql\s*/i, '').replace(/^```|```$/gi, '').replace(/;$/, '').trim();

    if (sql.startsWith('-- NO SE PUEDE RESPONDER')) {
      throw new Error('La pregunta no se puede responder con los datos disponibles.');
    }

    return sql;
  } catch (error) {
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key not')) {
      throw new Error('La clave de API de IA no es válida.');
    }
    throw error;
  }
};

const generarExplicacion = async (pregunta, datos) => {
  if (!datos || datos.length === 0) {
    return 'No se encontraron datos para tu consulta.';
  }

  try {
    const prompt = `Eres un analista de negocios de NutriCampo. Explica estos datos en máximo 2 oraciones en español con formato numérico.

Pregunta: "${pregunta}"
Datos: ${JSON.stringify(datos)}

Explicación:`;
    return await llamarGemini(prompt, 200);
  } catch {
    return generarExplicacionLocal(pregunta, datos);
  }
};

const generaSaludoDespedida = async (pregunta) => {
  const prompt = `Eres el asistente AI de NutriCampo que responde preguntas en español y es muy amigable y cordial, responde lo siguiente: "${pregunta}"`;
  return await llamarGemini(prompt, 200);
};

module.exports = { generarSQL, generarExplicacion, generaSaludoDespedida };
