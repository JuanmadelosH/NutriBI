const router = require('express').Router();
const db = require('../services/dbService');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
  const rows = await db.ejecutarConsulta('SELECT id_usuario, nombre, correo, rol, activo FROM usuarios ORDER BY nombre');
  res.json(rows);
};

const getById = async (req, res) => {
  const [row] = await db.ejecutarConsulta('SELECT id_usuario, nombre, correo, rol, activo FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Usuario no encontrado.' });
  res.json(row);
};

const crear = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  if (!nombre || !correo || !password || !rol)
    return res.status(400).json({ error: 'nombre, correo, password y rol son requeridos.' });
  const hash = await bcrypt.hash(password, 10);
  const r = await db.ejecutarConsulta(
    'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, correo, hash, rol]
  );
  res.status(201).json({ id_usuario: r.insertId, mensaje: 'Usuario creado.' });
};

const actualizar = async (req, res) => {
  const campos = [];
  const valores = [];
  for (const key of ['nombre', 'correo', 'rol', 'activo']) {
    if (req.body[key] !== undefined) { campos.push(`${key} = ?`); valores.push(req.body[key]); }
  }
  if (req.body.password) {
    const hash = await bcrypt.hash(req.body.password, 10);
    campos.push('password = ?');
    valores.push(hash);
  }
  if (!campos.length) return res.status(400).json({ error: 'Sin campos para actualizar.' });
  valores.push(req.params.id);
  await db.ejecutarConsulta(`UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`, valores);
  res.json({ mensaje: 'Usuario actualizado.' });
};

const eliminar = async (req, res) => {
  await db.ejecutarConsulta('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
  res.json({ mensaje: 'Usuario eliminado.' });
};

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

module.exports = router;
