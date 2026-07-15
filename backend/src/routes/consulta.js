const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

router.post('/', consultaController.responderConsulta);
module.exports = router;
