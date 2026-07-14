# Backend — Persona B

## Stack
Node.js + Express + MySQL + Gemini API

## Tareas

### Día 1
- [x] Inicializar proyecto con `npm init`
- [x] Instalar dependencias: `express`, `cors`, `dotenv`, `mysql2`, `nodemon`
- [x] Crear `src/index.js` — servidor Express
- [x] Crear `src/routes/consulta.js` — ruta POST /api/consulta
- [x] Crear `src/controllers/consultaController.js` — lógica del endpoint
- [x] Crear `src/services/aiService.js` — integración con Gemini API
- [x] Crear `src/services/dbService.js` — conexión MySQL
- [x] Crear `src/middleware/validateSQL.js` — validación solo SELECT
- [ ] Crear `.env` con credenciales reales (a partir de `.env.example`)
- [ ] Probar endpoint con curl/Postman (respuesta mock)

### Día 2
- [ ] Integrar Gemini API (Text-to-SQL)
- [ ] Pipelines: pregunta → SQL → ejecutar → datos + explicación
- [ ] Probar con la base de datos real

### Día 3
- [ ] Rate limiting (`express-rate-limit`)
- [ ] Manejo de errores (timeout, tokens, SQL inválido)
- [ ] Logging de consultas
- [ ] Documentación de la API

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | / | Health check |
| POST | /api/consulta | Enviar pregunta en lenguaje natural |

## Contrato

```
POST /api/consulta
{ "pregunta": "¿cuál es mi producto más rentable?" }

Response 200:
{
  "sql": "SELECT ...",
  "datos": [{ ... }],
  "respuesta": "Tu producto más rentable es..."
}

Response 400:
{ "error": "La pregunta es requerida." }

Response 400:
{ "error": "La consulta generada contiene operaciones no permitidas." }

Response 500:
{ "error": "Ocurrió un error al procesar tu consulta." }
```

## Seguridad

- [ ] API key en `.env` (nunca subir a GitHub)
- [ ] Validar que el SQL solo contenga SELECT
- [ ] Rate limiting
- [ ] No exponer API key al frontend
