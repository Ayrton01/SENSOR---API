const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para validação de chaves e emissão de tokens (Fase 4)
router.post('/token', authController.gerarToken);

module.exports = router;