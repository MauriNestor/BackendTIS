const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');

router.get('/:codigoClase', temaController.getTema);

module.exports = router;
