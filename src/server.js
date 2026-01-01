const express = require('express');
const sequelize = require('./infra/database/database');
const sensorRoutes = require('./api/routes/sensorRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

// Sincronização do Banco de Dados
sequelize.sync().then(() => console.log('Banco sincronizado!'));

// Rota de Teste (Opcional, mas útil)
app.get('/', (req, res) => {
  res.json({ message: 'SENSOR - API está online!' });
});

// Usando as rotas de sensores
app.use('/sensores', sensorRoutes); 

app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));