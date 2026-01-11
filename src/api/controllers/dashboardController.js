const Sensor = require('../../infra/database/models/Sensor');
const Leitura = require('../../infra/database/models/Leitura');
const { Op, fn, col } = require('sequelize');

const dashboardController = {
  async getResumo(req, res) {
    try {
      // 1. Definição do período de 24 horas (Tempo Real)
      const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // 2. CONSULTA AGREGADA: Buscamos Média, Máximo, Mínimo e Total de uma vez só
      const estatisticasGerais = await Leitura.findAll({
        attributes: [
          [fn('AVG', col('valor')), 'media'],
          [fn('MAX', col('valor')), 'pico'],
          [fn('MIN', col('valor')), 'minimo'],
          [fn('COUNT', col('id')), 'total']
        ],
        where: {
          dataMedicao: { [Op.gte]: vinteQuatroHorasAtras }
        },
        raw: true // Recebemos um objeto simples do banco
      });
      const resumo24h = estatisticasGerais[0];

      // 3. PREPARAÇÃO DOS VALORES (Com tratamento para nulos)
      const mediaReal = resumo24h.media ? parseFloat(resumo24h.media).toFixed(1) : "0.0";
      const picoReal = resumo24h.pico ? parseFloat(resumo24h.pico).toFixed(1) : "0.0";
      const minimoReal = resumo24h.minimo ? parseFloat(resumo24h.minimo).toFixed(1) : "0.0";
      const totalReal = resumo24h.total || 0;

      // 4. A GRANDE COLETA: Busca todos os sensores e sua última leitura
      const sensoresNoBanco = await Sensor.findAll({
        include: [{
          model: Leitura,
          as: 'Leituras', 
          limit: 1,
          order: [['dataMedicao', 'DESC']]
        }]
      });

      // 1.1 NOVA CONSULTA: Busca as 5 últimas leituras GERAIS (Histórico real)
      const historicoLeituras = await Leitura.findAll({
        limit: 5,
        where: {
        dataMedicao: { [Op.ne]: null }
        },
        // 💡 MUDANÇA CHAVE: Ordenar pela data garante a ordem dos fatos
        order: [['dataMedicao', 'DESC']],
        include: [{
          model: Sensor,
          attributes: ['tipo', 'local', 'setor', 'limiteMinimo', 'limiteMaximo']
        }]
      });

      // --- Variáveis para o Agregador ---
      let totalAlertas = 0;
      let totalLeiturasValidas = 0;
      const setoresAgrupados = {};

      // 2. PROCESSAMENTO DE INTELIGÊNCIA (Loop por cada sensor)
      for (const sensor of sensoresNoBanco) {
        const ultimaLeitura = sensor.Leituras[0];
        const valorAtual = ultimaLeitura ? ultimaLeitura.valor : 0;

        // 2.1 Checagem de Segurança (Status Crítico)
        const isCritico = ultimaLeitura && (valorAtual > sensor.limiteMaximo || valorAtual < sensor.limiteMinimo);
        if (isCritico) totalAlertas++;

        // --- LÓGICA DE PICO (Peak Hold) ---
        // Se estiver crítico, buscamos o maior valor das últimas 24h para exibir o "pior caso"
        let valorPico = valorAtual;
        if (isCritico) {
          const ontem = new Date();
          ontem.setDate(ontem.getDate() - 1); // Subtrai 1 dia (24h)
          
          const maxBanco = await Leitura.max('valor', {
            where: { 
              sensorId: sensor.id,
              dataMedicao: { [Op.gte]: ontem }
            }
          });
          if (maxBanco && maxBanco > valorPico) valorPico = maxBanco;
        }

        // 2.2 Tradutor de Unidades (Mapper)
        let unidade = "";
        const tipo = sensor.tipo.toLowerCase();
        if (tipo.includes('temp')) unidade = "°C";
        else if (tipo.includes('press')) unidade = "bar";
        else if (tipo.includes('vibr')) unidade = "mm/s";
        else if (tipo.includes('corr')) unidade = "A";

        // Prepara o objeto do sensor formatado
        const sensorFormatado = {
          id: sensor.id,
          nome: `${sensor.tipo} - ${sensor.local}`,
          setor: sensor.setor,
          valor: valorAtual.toFixed(1),
          valorPico: valorPico.toFixed(1), // Enviamos o pico para o Frontend
          unidade: unidade,
          critico: isCritico,
          limite: `${sensor.limiteMaximo} ${unidade}`
        };

        // 3. AGRUPADOR HIERÁRQUICO (Organiza por Setor)
        if (!setoresAgrupados[sensor.setor]) {
          setoresAgrupados[sensor.setor] = {
            id: Object.keys(setoresAgrupados).length + 1,
            nome: sensor.setor,
            status: 'normal',
            sensores: []
          };
        }
        setoresAgrupados[sensor.setor].sensores.push(sensorFormatado);
        if (isCritico) setoresAgrupados[sensor.setor].status = 'alerta';

        // 4. CALCULADOR DE MÉTRICAS (Estatísticas)
        if (ultimaLeitura) {
          totalLeiturasValidas++;
        }
      }

      // 3. PROCESSAMENTO DA LISTA DE LEITURAS (Mapeamento da nova consulta)
      const listaLeiturasReal = historicoLeituras.map(leitura => {
        const sensor = leitura.Sensor;
        if (!sensor) return null;

        const valor = leitura.valor;
        const isCritico = valor > sensor.limiteMaximo || valor < sensor.limiteMinimo;
        
        let unidade = "";
        const tipo = sensor.tipo ? sensor.tipo.toLowerCase() : "";
        if (tipo.includes('temp')) unidade = "°C";
        else if (tipo.includes('press')) unidade = "bar";
        else if (tipo.includes('vibr')) unidade = "mm/s";
        else if (tipo.includes('corr')) unidade = "A";

        const rawData = leitura.getDataValue('dataMedicao');
        const dataObj = rawData ? new Date(rawData) : null;
        const horarioFormatado = (dataObj && !isNaN(dataObj)) 
          ? dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
          : '--:--';

        return {
          id: leitura.id,
          sensor: `${sensor.tipo} - ${sensor.local}`,
          setor: sensor.setor,
          valor: valor.toFixed(1),
          unidade: unidade,
          status: isCritico ? 'CRÍTICO' : 'NORMAL',
          horario: horarioFormatado,
          timestamp: dataObj
        };
      }).filter(Boolean);

      // =========================================================
      // 5. CÁLCULOS DINÂMICOS DE EFICIÊNCIA (Lógica de Saúde)
      // =========================================================
      const totalSensores = sensoresNoBanco.length;
      const sensoresOk = totalSensores - totalAlertas;
      
      // Eficiência = (Sensores sem erro / Total de sensores) * 100
      const eficienciaCalculada = totalSensores > 0 
        ? Math.round((sensoresOk / totalSensores) * 100) 
        : 0;

      // 6. RETORNO ÚNICO (O banquete completo para o Frontend)
      return res.json({
        totalAlertas,
        listaSetores: Object.values(setoresAgrupados),
        listaLeituras: listaLeiturasReal,
        metricasTurno: {
          periodo: "Últimas 24h",
          totalLeituras: totalReal, // Agora reflete o volume total de dados
          media: mediaReal,        // Média real de todas as leituras do dia
          picoMaximo: picoReal,    // O maior valor atingido em 24h
          minimo: minimoReal,      // O menor valor atingido em 24h
          eficienciaTurno: `${eficienciaCalculada}%` // DINÂMICO
        },
        resumoGeral: {
          sensoresAtivos: totalLeiturasValidas,
          sensoresTotal: totalSensores,
          leiturasHoje: totalReal, // Sincronizado com as métricas do turno
          eficienciaAtual: `${eficienciaCalculada}%` // DINÂMICO
        }
      });

    } catch (error) {
      console.error("Erro no Agregador do Dashboard:", error);
      return res.status(500).json({ error: "Erro interno ao processar dados do painel." });
    }
  }
};

module.exports = dashboardController;