const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. PROTEÇÃO GLOBAL: Todas as rotas abaixo exigem token JWT
router.use(authMiddleware);

// 2. ROTAS DE INTELIGÊNCIA (Estáticas - Devem vir primeiro)
// Colocamos o relatório no topo para o Express não confundir com IDs
router.get('/reports/summary', sensorController.gerarRelatorio);

// 3. ROTAS DE DEFINIÇÃO (CRUD - Fase 2)
router.post('/', sensorController.criar);
router.get('/', sensorController.listar);

// 4. ROTAS DINÂMICAS (Com parâmetros :id - Devem vir por último)
router.put('/:id', sensorController.atualizar);
router.delete('/:id', sensorController.remover);

module.exports = router;