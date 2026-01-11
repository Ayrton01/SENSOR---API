const express = require('express');
const router = express.Router();
const leituraController = require('../controllers/leituraController');
const authMiddleware = require('../middlewares/authMiddleware'); // <--- 1. IMPORTAR SEGURANÇA

// 2. APLICAR O FILTRO DE SEGURANÇA
// A partir desta linha, todas as rotas de leitura exigem o Token JWT
//router.use(authMiddleware);

// Rota para registar telemetria (POST)
router.post('/', leituraController.cadastrar);

// Rota para listar todas as leituras (Geral)
router.get('/', leituraController.listar);

// Rota para o histórico: Funciona para TODOS ou para um ID específico
router.get('/sensor', leituraController.listar_Sensor);
router.get('/sensor/:sensorId', leituraController.listar_Sensor);

module.exports = router;