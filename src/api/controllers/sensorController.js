const Sensor = require('../../infra/database/models/Sensor');
const Leitura = require('../../infra/database/models/Leitura');
const GerarResumoBI = require('../../core/use-cases/gerarResumo'); // Importamos a inteligência de BI

module.exports = {
  // POST: Cadastrar novo sensor
  async criar(requisicao, resposta) {
    try {
      const { tipo, setor, local, limiteMinimo, limiteMaximo } = requisicao.body;

      if (!tipo?.trim() || !setor?.trim() || !local?.trim()) {
        return resposta.status(400).json({ 
          erro: 'Dados inválidos. "tipo", "setor" e "local" são obrigatórios.' 
        });
      }

      if (typeof limiteMinimo !== 'number' || typeof limiteMaximo !== 'number') {
        return resposta.status(400).json({ 
          erro: 'Os limites mínimo e máximo devem ser valores numéricos.' 
        });
      }

      const novoSensor = await Sensor.create({ 
        tipo, setor, local, limiteMinimo, limiteMaximo 
      });

      return resposta.status(201).json(novoSensor);
    } catch (erro) {
      console.error(erro);
      return resposta.status(400).json({ erro: 'Erro ao cadastrar sensor.' });
    }
  },

  // GET: Listar todos os sensores
  async listar(requisicao, resposta) {
    try {
      const sensores = await Sensor.findAll();
      return resposta.json(sensores);
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao buscar sensores.' });
    }
  },

  // PUT: Atualizar dados do sensor
  async atualizar(requisicao, resposta) {
    try {
      const { id } = requisicao.params;
      const { tipo, setor, local, limiteMinimo, limiteMaximo } = requisicao.body;

      const sensor = await Sensor.findByPk(id);
      if (!sensor) return resposta.status(404).json({ erro: 'Sensor não encontrado.' });

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

  // DELETE: Remover sensor
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

  // GET: Gerar Relatório de BI (Refatorado para Use Case)
  async gerarRelatorio(requisicao, resposta) {
    try {
      // Delegamos a agregação de dados e o fuso de Manaus para o Use Case
      const relatorio = await GerarResumoBI.executar();

      return resposta.json(relatorio);

    } catch (erro) {
      console.error(erro);
      return resposta.status(500).json({ erro: 'Erro ao gerar relatório de BI.' });
    }
  },

  // POST: Receber dados de telemetria do sensor
  async receberLeitura(requisicao, resposta) {
    try {
      const { sensorId, valor } = requisicao.body;

      // Validação básica
      if (!sensorId || valor === undefined) {
        return resposta.status(400).json({ erro: 'ID do sensor e valor são obrigatórios.' });
      }

      // Verifica se o sensor existe antes de salvar a leitura
      const sensorExiste = await Sensor.findByPk(sensorId);
      if (!sensorExiste) {
        return resposta.status(404).json({ erro: 'Sensor não encontrado no sistema.' });
      }

      // Cria o registro na tabela de Leituras
      const novaLeitura = await Leitura.create({
        sensorId,
        valor,
        dataMedicao: new Date() // Garante o registro do exato momento
      });

      return resposta.status(201).json(novaLeitura);
    } catch (erro) {
      console.error("Erro ao registrar leitura:", erro);
      return resposta.status(500).json({ erro: 'Erro interno ao salvar leitura.' });
    }
  }
  
};