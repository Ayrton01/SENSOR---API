const express = require('express');
const router = express.Router();

// IMPORTAÇÃO DOS CONTROLADORES
const authController = require('../controllers/authController');
const sensorController = require('../controllers/sensorController');
const graficoController = require('../controllers/graficoController'); // 1. Importe o novo
const dashboardController = require('../controllers/dashboardController'); // Novo controlador importado!
const authMiddleware = require('../middlewares/authMiddleware');

// 1. PROTEÇÃO GLOBAL: Todas as rotas abaixo exigem token JWT
// 1.1 Esta é a rota que o seu Overlay do React vai chamar
router.post('/login', authController.gerarToken);
router.use(authMiddleware);


// 2. ROTAS DE INTELIGÊNCIA (Agregadores e Relatórios)
// Note que agora usamos o dashboardController para o resumo
router.get('/reports/summary', sensorController.gerarRelatorio);
router.get('/dashboard/resumo', dashboardController.getResumo); 

// 3. ROTAS DE DEFINIÇÃO (CRUD - Gerenciamento de Sensores)
router.post('/', sensorController.criar);
router.get('/', sensorController.listar);

// 4. ROTAS DINÂMICAS (Operações por ID)
// Sempre por último para evitar conflitos com nomes de rotas estáticas
router.put('/:id', sensorController.atualizar);
router.delete('/:id', sensorController.remover);
router.get('/:id/history', graficoController.getHistory);
router.post('/readings', sensorController.receberLeitura);

module.exports = router;