import { useState, useRef, useEffect } from 'react';
import { api } from '../api/client';
import ResultChart from './ResultChart';

const PREGUNTAS_RAPIDAS = [
  '¿Cuál fue el margen global del último mes?',
  '¿Qué producto tiene el margen más bajo hoy?',
  '¿Qué productos están en pérdida y con qué clientes?',
  '¿Cuáles son mis clientes con más ventas?',
];

// Contrato real del backend POST /api/consulta:
// { sql: "SELECT ...", datos: [{ ... }], respuesta: "texto en lenguaje natural" }
export default function AsistenteChat({ hayDatos, onNuevaConsulta }) {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [mensajes]);

  async function preguntar(pregunta) {
    if (!pregunta.trim() || enviando) return;
    if (!hayDatos) {
      setMensajes((m) => [...m,
        { role: 'user', text: pregunta },
        { role: 'bot', text: 'Todavía no hay datos registrados. Ve a "Registrar datos" antes de preguntar.' },
      ]);
      return;
    }
    setEnviando(true);
    setMensajes((m) => [...m, { role: 'user', text: pregunta }, { role: 'bot', loading: true }]);
    try {
      const res = await api.preguntarAsistente(pregunta);
      setMensajes((m) => {
        const copia = [...m];
        copia[copia.length - 1] = {
          role: 'bot',
          sql: res.sql,
          filas: res.datos || [],
          explicacion: res.respuesta || '',
        };
        return copia;
      });
      onNuevaConsulta?.();
    } catch (err) {
      setMensajes((m) => {
        const copia = [...m];
        copia[copia.length - 1] = { role: 'bot', error: err.message };
        return copia;
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="panel">
      <h2>Pregúntale a tus datos</h2>
      <p className="panel-sub">
        Escribe en español natural. El asistente traduce tu pregunta a SQL, la ejecuta sobre lo que has registrado y te explica el resultado.
      </p>
      <div className="quick-row">
        {PREGUNTAS_RAPIDAS.map((q) => (
          <div className="quick-chip" key={q} onClick={() => preguntar(q)}>{q}</div>
        ))}
      </div>
      <div className="chat-log" ref={logRef}>
        {mensajes.map((m, i) => (
          <div className={`msg ${m.role === 'user' ? 'user' : 'bot'}`} key={i}>
            <div className="bubble">
              {m.role === 'user' && m.text}
              {m.role === 'bot' && m.loading && (
                <div className="typing"><span /><span /><span /></div>
              )}
              {m.role === 'bot' && m.error && `Hubo un problema consultando el asistente (${m.error}).`}
              {m.role === 'bot' && m.text && m.text}
              {m.role === 'bot' && m.sql && (
                <>
                  <div className="sql-label">Consulta SQL generada (RF-13)</div>
                  <div className="sql-block">{m.sql}</div>
                  <ResultChart filas={m.filas} chart={null} />
                  {m.explicacion && <div style={{ marginTop: 10 }}>{m.explicacion}</div>}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          type="text"
          placeholder="Ej: ¿qué producto perdió más margen este mes por el costo del empaque?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { preguntar(input); setInput(''); }
          }}
        />
        <button disabled={enviando} onClick={() => { preguntar(input); setInput(''); }}>Preguntar</button>
      </div>
    </div>
  );
}
