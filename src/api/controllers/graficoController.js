const Sensor = require('../../infra/database/models/Sensor');
const Leitura = require('../../infra/database/models/Leitura');

const graficoController = {
  async getHistory(req, res) {
    try {
      const { id } = req.params;

      // Buscamos o sensor e suas últimas 15 leituras
      const sensorComLeituras = await Sensor.findByPk(id, {
        include: [{
          model: Leitura,
          as: 'Leituras', // Certifique-se que o 'as' bate com seu relacionamento no model
          limit: 15,
          order: [['dataMedicao', 'DESC']]
        }]
      });

      if (!sensorComLeituras) {
        return res.status(404).json({ error: "Sensor não encontrado." });
      }

      const resposta = {
        id: sensorComLeituras.id,
        nome: `${sensorComLeituras.tipo} - ${sensorComLeituras.local}`,
        limiteMaximo: sensorComLeituras.limiteMaximo,
        limiteMinimo: sensorComLeituras.limiteMinimo,
        unidade: sensorComLeituras.tipo.toLowerCase().includes('temp') ? '°C' : 
                 sensorComLeituras.tipo.toLowerCase().includes('press') ? 'bar' : 
                 sensorComLeituras.tipo.toLowerCase().includes('vibr') ? 'mm/s' : 'A',
        historico: sensorComLeituras.Leituras.reverse().map(l => ({
          id: l.id,
          valor: l.valor,
          horario: new Date(l.dataMedicao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }))
      };

      return res.json(resposta);
    } catch (error) {
      console.error("Erro ao buscar histórico no GraficoController:", error);
      return res.status(500).json({ error: "Erro interno ao buscar histórico." });
    }
  }
};

module.exports = graficoController;