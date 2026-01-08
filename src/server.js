const express = require('express');
const cors = require('cors'); // <--- 1. NOVA IMPORTAÇÃO
const sequelize = require('./infra/database/database');

// 1. IMPORTAÇÕES DE ROTAS E MODELOS
const sensorRoutes = require('./api/routes/sensorRoutes');
const leituraRoutes = require('./api/routes/leituraRoutes');
const authRoutes = require('./api/routes/authRoutes');

const Sensor = require('./infra/database/models/Sensor');
const Leitura = require('./infra/database/models/Leitura');

const app = express();
const PORT = 3000;

// 2. CONFIGURAÇÕES
app.use(cors()); // <--- 2. LIBERA O ACESSO PARA QUALQUER FRONTEND
app.use(express.json());

// 3. RELACIONAMENTOS (Mantenha como está)
Sensor.hasMany(Leitura, { foreignKey: 'sensorId', onDelete: 'CASCADE' });
Leitura.belongsTo(Sensor, { foreignKey: 'sensorId' });

// 4. ROTAS
app.get('/', (req, res) => {
  res.json({ message: 'SENSOR - API está online!' });
});

app.use('/auth', authRoutes);
app.use('/sensors', sensorRoutes); 
app.use('/readings', leituraRoutes);

// 5. INICIALIZAÇÃO
sequelize.sync().then(() => {
  console.log('Banco sincronizado!');
  app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
});