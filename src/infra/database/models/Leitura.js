const { DataTypes } = require('sequelize');
const sequelize = require('../database');

/**
 * Função auxiliar para formatar a data no padrão de Manaus
 * Transforma o horário UTC (Z) no horário local de Manaus (UTC-4)
 */
const formatarDataManaus = (valor) => {
  if (!valor) return null;
  
  // Opções para o formato: 2026-01-02 19:57:00
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

  // Retorna no formato que você pediu: AAAA-MM-DD HH:mm:ss
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
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataMedicao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    // Este "get" intercepta o dado antes de ele sair para a sua tela
    get() {
      return formatarDataManaus(this.getDataValue('dataMedicao'));
    }
  }
}, {
  tableName: 'leituras',
  timestamps: true,
  createdAt: 'dataRecebido', // Renomeia createdAt para dataRecebido
  updatedAt: false,
  // Formata também o campo automático dataRecebido
  getterMethods: {
    dataRecebido() {
      return formatarDataManaus(this.getDataValue('dataRecebido'));
    }
  }
});

module.exports = Leitura;