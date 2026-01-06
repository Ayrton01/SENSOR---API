const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. PROTEÇÃO GLOBAL: A partir daqui, todas as rotas exigem token JWT (Fase 4)
router.use(authMiddleware);

// 2. ROTAS DE DEFINIÇÃO (CRUD - Fase 2)
router.post('/', sensorController.criar);
router.get('/', sensorController.listar);
router.put('/:id', sensorController.atualizar);
router.delete('/:id', sensorController.remover);

// 3. ROTAS DE INTELIGÊNCIA (BI - Fase 5)
// Nota: Removido o authMiddleware redundante, pois o router.use acima já protege esta rota.
router.get('/reports/summary', sensorController.gerarRelatorio);

module.exports = router;