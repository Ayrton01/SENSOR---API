const Leitura = require('../../infra/database/models/Leitura');
const Sensor = require('../../infra/database/models/Sensor');
const axios = require('axios');
const services = require('../config/services'); // Centralização de portas

class AnalisarLeitura {
  async executar({ valor, sensorId, dataMedicao }) {
    // 1. Busca o sensor
    const sensor = await Sensor.findByPk(sensorId);
    if (!sensor) throw new Error('O sensor informado não existe.');

    // 2. Motor de Regras (Fase 5)
    const ehAnomalia = valor < sensor.limiteMinimo || valor > sensor.limiteMaximo;
    let statusOperacional = 'NORMAL';

    if (ehAnomalia) {
      statusOperacional = 'CRÍTICO';
      
      // 3. Orquestração de Alerta Externo (Axios)
      try {
        await axios.post(services.SISTEMA_LEGADO.URL_ALERTS, {
          sensorId: sensor.id,
          tipoSensor: sensor.tipo,
          setor: sensor.setor,
          local: sensor.local,
          valor: valor,
          limiteMin: sensor.limiteMinimo,
          limiteMax: sensor.limiteMaximo,
          dataMedicao: dataMedicao || new Date().toISOString()
        });
      } catch (erro) {
        // Logamos o erro mas permitimos que o Use Case continue (Resiliência)
        console.error('❌ Falha na notificação externa:', erro.message);
      }
    }

    // 4. Persistência dos dados
    const novaLeitura = await Leitura.create({ valor, sensorId, dataMedicao });

    return {
      leitura: novaLeitura.toJSON(),
      statusOperacional
    };
  }
}

module.exports = new AnalisarLeitura();