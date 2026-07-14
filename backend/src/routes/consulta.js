const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.post('/consulta', consultaController.responderConsulta);
module.exports = router;
