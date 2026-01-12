const Leitura = require('../../infra/database/models/Leitura');
const Sensor = require('../../infra/database/models/Sensor');
const AnalisarLeitura = require('../../core/use-cases/analisarLeitura'); // Importamos o Use Case

module.exports = {
  async cadastrar(requisicao, resposta) {
    try {
      const { valor, sensorId, dataMedicao } = requisicao.body;

      if (valor === undefined || !sensorId) {
        return resposta.status(400).json({ erro: 'Dados incompletos!' });
      }

      // Delegamos toda a lógica para o Use Case
      const resultado = await AnalisarLeitura.executar({ valor, sensorId, dataMedicao });

      return resposta.status(201).json({
        ...resultado.leitura,
        statusOperacional: resultado.statusOperacional
      });

    } catch (erro) {
      console.error(erro);
      // Tratamento para o erro de sensor não encontrado vindo do Use Case
      if (erro.message === 'O sensor informado não existe.') {
        return resposta.status(404).json({ erro: erro.message });
      }
      return resposta.status(500).json({ erro: 'Erro ao processar telemetria.' });
    }
  },

// GET: Listagem Geral (Otimizada)
  async listar(requisicao, resposta) {
    try {
      const leituras = await Leitura.findAll({
        limit: 50, // Mantém o painel leve
        // PERFORMANCE: Trazemos apenas as colunas necessárias para o gráfico e tabela
        attributes: ['id', 'valor', 'status', 'dataRecebido', 'sensorId'], 
        include: [{ 
          model: Sensor, 
          attributes: ['tipo', 'local', 'setor'] 
        }],
        order: [['dataRecebido', 'DESC']]
      });
      return resposta.json(leituras);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar leituras.' });
    }
  },

  // GET: Histórico de um sensor específico (Otimizada)
  async listar_Sensor(requisicao, resposta) {
    try {
      const { id } = requisicao.params;
      const leituras = await Leitura.findAll({
        where: { sensorId: id },
        limit: 30, // Histórico individual costuma ser mais focado nas últimas medições
        attributes: ['id', 'valor', 'status', 'dataRecebido'], // Payload reduzido
        include: [{ 
          model: Sensor, 
          attributes: ['tipo', 'local'] 
        }],
        order: [['dataRecebido', 'DESC']]
      });
      return resposta.json(leituras);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar histórico.' });
    }
  }
};