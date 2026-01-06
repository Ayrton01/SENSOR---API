const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Função auxiliar para formatar a data no padrão de Manaus
 * Transforma o horário UTC (Z) no horário local de Manaus (UTC-4)
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

const Leitura = sequelize.define('Leitura', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false // Aceita qualquer valor numérico (temperatura, umidade, etc)
  },
  dataMedicao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    get() {
      return formatarData(this.getDataValue('dataMedicao'));
    }
  }
}, {
  tableName: 'leituras',
  timestamps: true,
  createdAt: 'dataRecebido', // Auditoria de quando o dado chegou no servidor
  updatedAt: false,
  getterMethods: {
    dataRecebido() {
      return formatarData(this.getDataValue('dataRecebido'));
    }
  }
});

module.exports = Leitura;