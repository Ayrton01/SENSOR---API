const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Função auxiliar para formatar a data no padrão de Manaus (UTC-4)
 * Formato final: 2026-01-05 18:43:00
 */
const formatarData = (valor) => {
  if (!valor) return null;
  
  const opcoes = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Manaus'
  };

  const formatador = new Intl.DateTimeFormat('en-CA', opcoes); // 'en-CA' gera YYYY-MM-DD
  const partes = formatador.formatToParts(new Date(valor));
  
  const d = partes.find(p => p.type === 'day').value;
  const m = partes.find(p => p.type === 'month').value;
  const y = partes.find(p => p.type === 'year').value;
  const h = partes.find(p => p.type === 'hour').value;
  const min = partes.find(p => p.type === 'minute').value;
  const seg = partes.find(p => p.type === 'second').value;

  return `${y}-${m}-${d} ${h}:${min}:${seg}`;
};

const Sensor = sequelize.define('Sensor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false // Ex: Temperatura, Pressão, Umidade
  },
  setor: {
    type: DataTypes.STRING,
    allowNull: false // Ex: Estamparia, Usinagem, Linha de Montagem
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false // Ex: Máquina A1, Forno 2
  },
  limiteMinimo: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0
  },
  limiteMaximo: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 100.0
  }
}, {
  tableName: 'sensores',
  timestamps: true,
  // Mapeia os nomes automáticos do Sequelize para o seu planejamento
  createdAt: 'dataCriacao', 
  updatedAt: 'ultimaAtualizacao',
  
  // Os getters formatam os dados ANTES de serem enviados para a API
  getterMethods: {
    dataCriacao() {
      return formatarData(this.getDataValue('dataCriacao'));
    },
    ultimaAtualizacao() {
      return formatarData(this.getDataValue('ultimaAtualizacao'));
    }
  }
});

module.exports = Sensor;