const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Sensor = sequelize.define('Sensor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'sensores',
  timestamps: true,
  // Mapeamento para os nomes exatos do seu planejamento
  createdAt: 'dataCriacao', 
  updatedAt: 'ultimaAtualizacao'
});

module.exports = Sensor;