const Sensor = require('../../infra/database/models/Sensor');

module.exports = {
  // Função para cadastrar (POST) com VALIDAÇÃO
  async criar(requisicao, resposta) {
    try {
      const { tipo, local } = requisicao.body;

      // Validação: Verifica se os campos existem e não estão vazios
      if (!tipo || !tipo.trim() || !local || !local.trim()) {
        return resposta.status(400).json({ 
          erro: 'Dados inválidos. O "tipo" e o "local" não podem ser vazios ou apenas espaços.' 
        });
      }

      const novoSensor = await Sensor.create({ tipo, local });
      return resposta.status(201).json(novoSensor);
    } catch (erro) {
      return resposta.status(400).json({ erro: 'Erro ao cadastrar sensor.' });
    }
  },

  // Função para listar (GET)
  async listar(requisicao, resposta) {
    try {
      const sensores = await Sensor.findAll();
      return resposta.json(sensores);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar sensores.' });
    }
  },

  // Função para atualizar (PUT) com VALIDAÇÃO
  async atualizar(requisicao, resposta) {
    try {
      const { id } = requisicao.params;
      const { tipo, local } = requisicao.body;

      // Validação de segurança para atualização
      if (!tipo || !tipo.trim() || !local || !local.trim()) {
        return resposta.status(400).json({ 
          erro: 'Dados inválidos. O "tipo" e o "local" não podem ser vazios ou apenas espaços.' 
        });
      }
      
      const sensor = await Sensor.findByPk(id);
      if (!sensor) return resposta.status(404).json({ erro: 'Sensor não encontrado.' });

      await sensor.update({ tipo, local });
      return resposta.json(sensor);
    } catch (erro) {
      return resposta.status(400).json({ erro: 'Erro ao atualizar sensor.' });
    }
  },

  // Função para remover (DELETE)
  async remover(requisicao, resposta) {
    try {
      const { id } = requisicao.params;
      const sensor = await Sensor.findByPk(id);
      if (!sensor) return resposta.status(404).json({ erro: 'Sensor não encontrado.' });

      await sensor.destroy();
      return resposta.json({ mensagem: 'Sensor removido com sucesso.' });
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao remover sensor.' });
    }
  }
};
