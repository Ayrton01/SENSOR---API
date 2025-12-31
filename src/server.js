const express = require('express');
const app = express();
const PORT = 3000;

// Configuração para permitir que o Express entenda JSON
app.use(express.json());

// Rota de Teste (Health Check) conforme o planejamento
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'SENSOR - API está operando corretamente!' 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado com sucesso na porta ${PORT}`);
});