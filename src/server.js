const express = require('express');
const sequelize = require('./infra/database/database');

// 1. IMPORTAÇÕES DE ROTAS E MODELOS (Coloque a nova rota aqui)
const sensorRoutes = require('./api/routes/sensorRoutes');
const leituraRoutes = require('./api/routes/leituraRoutes');
const authRoutes = require('./api/routes/authRoutes'); // <--- NOVA LINHA AQUI!

const Sensor = require('./infra/database/models/Sensor');
const Leitura = require('./infra/database/models/Leitura');

const app = express();
const PORT = 3000;

// 2. CONFIGURAÇÕES (O tradutor de JSON)
app.use(express.json());

// 3. RELACIONAMENTOS
Sensor.hasMany(Leitura, { foreignKey: 'sensorId', onDelete: 'CASCADE' });
Leitura.belongsTo(Sensor, { foreignKey: 'sensorId' });

// 4. ROTAS (Avisar quais caminhos existem)
app.get('/', (req, res) => {
  res.json({ message: 'SENSOR - API está online!' });
});

// Registrar a rota de autenticação antes das outras (Organização)
app.use('/auth', authRoutes);     // <--- NOVA LINHA AQUI!
app.use('/sensores', sensorRoutes); 
app.use('/leituras', leituraRoutes);

// 5. INICIALIZAÇÃO
sequelize.sync().then(() => {
  console.log('Banco sincronizado!');
  app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
});