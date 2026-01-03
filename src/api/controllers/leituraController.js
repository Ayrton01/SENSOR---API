const Leitura = require('../../infra/database/models/Leitura');
const Sensor = require('../../infra/database/models/Sensor');

module.exports = {
 // Dentro de leituraController.js
 async cadastrar(requisicao, resposta) {
  try {
    // Agora incluímos a dataMedicao na desestruturação
    const { valor, tipo, sensorId, dataMedicao } = requisicao.body;

    if (!valor || !tipo || !sensorId) {
      return resposta.status(400).json({ erro: 'Dados incompletos!' });
    }

    const sensorExiste = await Sensor.findByPk(sensorId);
    if (!sensorExiste) {
      return resposta.status(404).json({ erro: 'O sensor informado não existe.' });
    }

    // Passamos a dataMedicao para o create. 
    // Se ela for nula, o defaultValue: DataTypes.NOW do Model entrará em ação.
    const novaLeitura = await Leitura.create({ 
      valor, 
      tipo, 
      sensorId, 
      dataMedicao 
    });

     return resposta.status(201).json(novaLeitura);
    } catch (erro) {
     return resposta.status(500).json({ erro: 'Erro ao registrar leitura.' });
    }
  },

  // Rota para listar todas as leituras (GET)
  async listar(requisicao, resposta) {
    try {
      const leituras = await Leitura.findAll({
        include: [{ model: Sensor, attributes: ['local'] }] // Isso traz o local do sensor junto!
      });
      return resposta.json(leituras);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar leituras.' });
    }
  },

  async listar_Sensor(requisicao, resposta) {
    try {
      const { sensorId } = requisicao.params;

      // LÓGICA: Se existir o sensorId, criamos o filtro. Se não, deixamos o filtro vazio.
      const filtro = sensorId ? { where: { sensorId } } : {};

      const leituras = await Leitura.findAll({
        ...filtro, // Aplica o filtro (se houver)
        order: [['dataMedicao', 'DESC']], // Mantém sempre os mais recentes primeiro
        include: [{ model: Sensor, attributes: ['local', 'tipo'] }]
      });

      if (leituras.length === 0) {
        return resposta.status(404).json({ mensagem: 'Nenhuma leitura encontrada.' });
      }

      return resposta.json(leituras);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar dados.' });
    }
  }

};