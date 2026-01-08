const Sensor = require('../../infra/database/models/Sensor');
const Leitura = require('../../infra/database/models/Leitura');
const { fn, col } = require('sequelize');

class GerarResumoBI {
  async executar() {
    // 1. Total de Sensores por Setor (Lógica movida do Controller)
    const totalPorSetor = await Sensor.findAll({
      attributes: ['setor', [fn('COUNT', col('id')), 'quantidade']],
      group: ['setor']
    });

    // 2. Estatísticas de Leituras (Lógica de agregação complexa movida)
    const estatisticasLeituras = await Leitura.findAll({
      attributes: [
        'sensorId',
        [fn('AVG', col('valor')), 'mediaValor'],
        [fn('MAX', col('valor')), 'picoValor'],
        // Mantendo a correção de ambiguidade que fizemos antes
        [fn('COUNT', col('Leitura.id')), 'totalLeituras'] 
      ],
      include: [{ model: Sensor, attributes: ['tipo', 'setor', 'local'] }],
      group: ['sensorId', 'Sensor.id', 'Sensor.tipo', 'Sensor.setor', 'Sensor.local']
    });

    // 3. Formatação de Data para o fuso de Manaus
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleString('sv-SE', { timeZone: 'America/Manaus' });

    // Retorna o objeto consolidado
    return {
      dataGeracao: dataFormatada,
      resumoSetores: totalPorSetor,
      detalhesSensores: estatisticasLeituras
    };
  }
}

module.exports = new GerarResumoBI();