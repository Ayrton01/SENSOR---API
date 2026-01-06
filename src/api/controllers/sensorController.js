const Sensor = require('../../infra/database/models/Sensor');
const Leitura = require('../../infra/database/models/Leitura');
const { Op, fn, col } = require('sequelize');

module.exports = {
  // Função para cadastrar (POST) com VALIDAÇÃO AMPLIADA
  async criar(requisicao, resposta) {
    try {
      const { tipo, setor, local, limiteMinimo, limiteMaximo } = requisicao.body;

      // Validação de campos obrigatórios (Strings)
      if (!tipo?.trim() || !setor?.trim() || !local?.trim()) {
        return resposta.status(400).json({ 
          erro: 'Dados inválidos. "tipo", "setor" e "local" são obrigatórios.' 
        });
      }

      // Validação de limites (Garantir que são números)
      if (typeof limiteMinimo !== 'number' || typeof limiteMaximo !== 'number') {
        return resposta.status(400).json({ 
          erro: 'Os limites mínimo e máximo devem ser valores numéricos.' 
        });
      }

      const novoSensor = await Sensor.create({ 
        tipo, 
        setor, 
        local, 
        limiteMinimo, 
        limiteMaximo 
      });

      return resposta.status(201).json(novoSensor);
    } catch (erro) {
      console.error(erro);
      return resposta.status(400).json({ erro: 'Erro ao cadastrar sensor.' });
    }
  },

  // Função para listar (GET) - Agora retorna os novos campos automaticamente
  async listar(requisicao, resposta) {
    try {
      const sensores = await Sensor.findAll();
      return resposta.json(sensores);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar sensores.' });
    }
  },

  // Função para atualizar (PUT) com VALIDAÇÃO AMPLIADA
  async atualizar(requisicao, resposta) {
    try {
      const { id } = requisicao.params;
      const { tipo, setor, local, limiteMinimo, limiteMaximo } = requisicao.body;

      const sensor = await Sensor.findByPk(id);
      if (!sensor) return resposta.status(404).json({ erro: 'Sensor não encontrado.' });

      // Validação de campos obrigatórios se enviados
      if (!tipo?.trim() || !setor?.trim() || !local?.trim()) {
        return resposta.status(400).json({ 
          erro: 'Dados inválidos. "tipo", "setor" e "local" não podem ser vazios.' 
        });
      }

      // Validação de limites numéricos
      if (typeof limiteMinimo !== 'number' || typeof limiteMaximo !== 'number') {
        return resposta.status(400).json({ 
          erro: 'Os limites mínimo e máximo devem ser valores numéricos.' 
        });
      }

      await sensor.update({ tipo, setor, local, limiteMinimo, limiteMaximo });
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
  },

  async gerarRelatorio(requisicao, resposta) {
    try {
      // 1. Total de Sensores por Setor
      const totalPorSetor = await Sensor.findAll({
        attributes: ['setor', [fn('COUNT', col('id')), 'quantidade']],
        group: ['setor']
      });

      // 2. Estatísticas de Leituras (Média e Pico por Sensor)
      const estatisticasLeituras = await Leitura.findAll({
        attributes: [
          'sensorId',
          [fn('AVG', col('valor')), 'mediaValor'],
          [fn('MAX', col('valor')), 'picoValor'],
          [fn('COUNT', col('Leitura.id')), 'totalLeituras']
        ],
        include: [{ model: Sensor, attributes: ['tipo', 'setor', 'local'] }],
        group: ['sensorId', 'Sensor.id', 'Sensor.tipo', 'Sensor.setor', 'Sensor.local']
      });

      const dataAtual = new Date();
      // Formatamos para YYYY-MM-DD HH:mm:ss no fuso de Manaus
      const dataFormatada = dataAtual.toLocaleString('sv-SE', { timeZone: 'America/Manaus' });

      // 3. Resumo Consolidado para o Dashboard
      return resposta.json({
        dataGeracao: dataFormatada, // Agora no formato: 2026-01-05 23:18:01
        resumoSetores: totalPorSetor,
        detalhesSensores: estatisticasLeituras
      });

    } catch (erro) {
      console.error(erro);
      return resposta.status(500).json({ erro: 'Erro ao gerar relatório de BI.' });
    }
  }
};