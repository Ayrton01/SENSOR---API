const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Define que quando houver um POST no endereço, ele chama a função criar
router.post('/', sensorController.criar);

// Define que quando houver um GET no endereço, ele chama a função listar
router.get('/', sensorController.listar);

// Novas rotas para Atualizar (PUT) e Deletar (DELETE)
router.put('/:id', sensorController.atualizar);
router.delete('/:id', sensorController.remover);

module.exports = router;