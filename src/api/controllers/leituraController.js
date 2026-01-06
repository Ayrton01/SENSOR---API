const Leitura = require('../../infra/database/models/Leitura');
const Sensor = require('../../infra/database/models/Sensor');
const axios = require('axios');

module.exports = {
  // POST: Registro de Telemetria com Alerta Sincronizado (Fase 5)
  async cadastrar(requisicao, resposta) {
    try {
      const { valor, sensorId, dataMedicao } = requisicao.body;

      if (valor === undefined || !sensorId) {
        return resposta.status(400).json({ erro: 'Dados incompletos!' });
      }

      const sensor = await Sensor.findByPk(sensorId);
      if (!sensor) {
        return resposta.status(404).json({ erro: 'O sensor informado não existe.' });
      }

      const ehAnomalia = valor < sensor.limiteMinimo || valor > sensor.limiteMaximo;
      let statusOperacional = 'NORMAL';

      if (ehAnomalia) {
        statusOperacional = 'CRÍTICO';
        
        console.log(`\n⚠️  ANOMALIA DETECTADA - INICIANDO DISPARO DE ALERTA`);

        try {
          // Ajustado para a rota '/api/alerts' e campos esperados pelo Legado
          await axios.post('http://localhost:3001/api/alerts', {
            sensorId: sensor.id,
            tipoSensor: sensor.tipo,      // Nome de campo corrigido
            setor: sensor.setor,
            local: sensor.local,
            valor: valor,                 // Nome de campo corrigido
            limiteMin: sensor.limiteMinimo,
            limiteMax: sensor.limiteMaximo,
            dataMedicao: dataMedicao || new Date().toISOString() // Nome de campo corrigido
          });
          console.log('🚀 Alerta entregue com sucesso ao Sistema Legado (:3001)');
        } catch (erroAxios) {
          console.error('❌ Erro na integração com o Sistema Legado:', erroAxios.message);
        }
      }

      const novaLeitura = await Leitura.create({ valor, sensorId, dataMedicao });

      return resposta.status(201).json({
        ...novaLeitura.toJSON(),
        statusOperacional 
      });

    } catch (erro) {
      console.error(erro);
      return resposta.status(500).json({ erro: 'Erro ao registrar leitura.' });
    }
  },

  // GET: Listar histórico (Fase 3)
  async listar(requisicao, resposta) {
    try {
      const leituras = await Leitura.findAll({
        include: [{ model: Sensor, attributes: ['tipo', 'local', 'setor'] }],
        order: [['dataRecebido', 'DESC']]
      });
      return resposta.json(leituras);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar leituras.' });
    }
  },

  // GET: Leituras de um sensor específico
  async listar_Sensor(requisicao, resposta) {
    try {
      const { sensorId } = requisicao.params;
      const leituras = await Leitura.findAll({
        where: { sensorId },
        include: [{ model: Sensor, attributes: ['tipo', 'local'] }],
        order: [['dataMedicao', 'DESC']]
      });
      if (leituras.length === 0) return resposta.status(404).json({ mensagem: 'Nenhuma leitura encontrada.' });
      return resposta.json(leituras);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar dados.' });
    }
  }
};