import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../services';

export const Alerta = () => {
  const [loading, setLoading] = useState(false);
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [listaSetores, setListaSetores] = useState([]);
  const [listaLeituras, setListaLeituras] = useState([]);
  
  // Estados iniciais para evitar erros de renderização antes dos dados chegarem
  const [resumoGeral, setResumoGeral] = useState({
    sensoresAtivos: 0,
    sensoresTotal: 0,
    leiturasHoje: 0,
    eficienciaAtual: "0%"
  });

  const [metricasTurno, setMetricasTurno] = useState({
    periodo: "Carregando...",
    totalLeituras: 0,
    media: "0.0",
    picoMaximo: "0.0",
    minimo: "0.0",
    eficienciaTurno: "0%"
  });

  // 2. BUSCA NA API (Com Cache Busting)
  const buscarDadosDaPlanta = async () => {
    // 1. Forçamos o estado de loading para "limpar" a percepção visual
    setLoading(true); 

    try {
      // 2. Geramos um "carimbo de tempo" único para cada clique
      const timestamp = new Date().getTime();

      // 3. Adicionamos o timestamp na URL (Isso força o navegador a ignorar o cache)
      const response = await axios.get(`${API.URL}/sensors/dashboard/resumo?t=${timestamp}`);
      const data = response.data;

      // 4. Atualizamos os estados com os dados reais do banco
      setTotalAlertas(data.totalAlertas);
      setListaSetores(data.listaSetores);
      setListaLeituras(data.listaLeituras);
      setResumoGeral(data.resumoGeral);
      setMetricasTurno(data.metricasTurno);
      
      // Finalizamos o carregamento
      setLoading(false);
      console.log(`✅ Planta Manaus Atualizada: ${new Date().toLocaleTimeString()}`);
      
    } catch (error) {
      console.error("❌ ERRO AO RENOVAR DADOS:", error);
      setLoading(false);
    }
  };

  // Carrega os dados automaticamente ao abrir a página
  useEffect(() => {
    buscarDadosDaPlanta();
  }, []);

  // Derivamos a lista de alertas filtrando os setores (para uso no Dashboard)
  const listaAlertas = listaSetores.flatMap(setor => 
    setor.sensores.filter(s => s.critico).map(s => ({ ...s, valorDestaque: s.valor }))
  );

  return {
    totalAlertas,
    listaAlertas,
    listaSetores,
    listaLeituras,
    metricasTurno,
    resumoGeral,
    loading,
    atualizarDados: buscarDadosDaPlanta
  };
};