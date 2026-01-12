import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API } from './services';

import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ReferenceLine 
} from 'recharts';

import { 
  
  // --- Interface e Navegação ---
  Factory, ChevronDown, RefreshCcw, Clock, LogOut,
  
  // --- Alertas e Status ---
  AlertTriangle, Circle,
  
  // --- Sensores (Campo) ---
  MapPin, Gauge,
  
  // --- Métricas e Sistema ---
  Cpu, Activity, Zap, TrendingUp, TrendingDown

} from 'lucide-react';

import { Alerta } from './funcoes/alerta'; // Ajuste: Caminho correto e Case Sensitive (A maiúsculo)
import { AuthContext } from './token/AuthContext';
import LoginOverlay from './loginOverlay';

function Dashboard() {

  // 1. Pegamos os dados de autenticação e a função de logout
  const { authenticated, loading: authLoading, logout } = useContext(AuthContext);

  // Chamamos o seu Hook personalizado
  const { totalAlertas, listaAlertas, listaSetores, listaLeituras, metricasTurno,
    resumoGeral, loading, atualizarDados } = Alerta();

  // --- HOOKS DE ESTADO (Sempre no topo) ---
  
  // 1. O ID do sensor que o usuário escolheu no menu
  const [selectedSensorId, setSelectedSensorId] = useState("");

  // 2. Dados do gráfico
  const [dadosGrafico, setDadosGrafico] = useState(null);

  // 3. Loading do gráfico
  const [loadingGrafico, setLoadingGrafico] = useState(false);

  // --- EFEITOS (useEffect) ---

  // 1. Polling (Sincronização Automática)
  useEffect(() => {
    if (!authenticated) return; 

    const intervalo = setInterval(() => {
      console.log("Sincronizando Planta Manaus...");
      atualizarDados(); 
    }, 10000); 

    return () => clearInterval(intervalo); 
  }, [authenticated, atualizarDados]);

  // 2. Carregamento do Gráfico
  useEffect(() => {
    if (!selectedSensorId) {
      setDadosGrafico(null);
      return;
    }

    setLoadingGrafico(true);
    
    axios.get(`${API.URL}/sensors/${selectedSensorId}/history`)
      .then(response => {
        setDadosGrafico(response.data);
        setLoadingGrafico(false);
      })
      .catch(error => {
        console.error("Erro ao carregar histórico:", error);
        setLoadingGrafico(false);
      });
  }, [selectedSensorId]);

  // --- VERIFICAÇÕES DE SEGURANÇA (Sempre por último, antes do return) ---
  if (authLoading) return <div className="loading">Verificando credenciais...</div>;
  if (!authenticated) return <LoginOverlay />;

  if (loading && !resumoGeral) {
    return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Carregando dados...</div>;
  }

  return (
    <div className="App">
      {/* HEADER PRINCIPAL */}
      <header className="header-container">
        <div className="logo-section">
          <div className="icon-box"><Factory size={28} color="white" /></div>
          <div className="title-text">
            <h1>Monitoramento Industrial</h1>
            <p>Planta Manaus - Tempo Real</p>
          </div>
        </div>
        <div className="controls-section">
          <div className="select-turno"><span>Turno Tarde</span><ChevronDown size={16} /></div>
          <button className="btn-atualizar" onClick={atualizarDados} disabled={loading}>
            <RefreshCcw size={16} />
            <span>{loading ? '...' : 'Atualizar'}</span>
          </button>
          <button className="btn-logout" onClick={logout}>
            <LogOut size={16} />
            <span>Sair do Painel</span>
          </button>
        </div>
      </header>

      {/* SEÇÃO DE ALERTAS CRÍTICOS */}
      <main className="alerts-section">
        <div className="alerts-title">
          <AlertTriangle size={22} />
          {/* O número agora vem direto do total calculado na função */}
          <span>Alertas Críticos ({totalAlertas})</span>
        </div>

        {totalAlertas === 0 ? (
          /* ESTADO POSITIVO: APARECE QUANDO NÃO HÁ ALERTAS */
          <div className="no-alerts-card">
            <div className="no-alerts-content">
              <div className="success-icon-circle">
                <Circle size={40} color="#10b981" fill="rgba(16, 185, 129, 0.2)" />
                <TrendingDown size={20} color="#10b981" className="pos-absolute" />
              </div>
              <p>
                Não há alertas críticos 
                <AlertTriangle size={18} className="icon-inline-text" />
              </p>
              <span>Todos os sistemas da Planta Manaus operando na faixa normal</span>
            </div>
          </div>
        ) : (
          /* ESTADO CRÍTICO: Geração Automática com .map() */
          <>
            {listaAlertas.map((sensor) => (
              <div className="alert-card" key={sensor.id}>
                <div className="icon-circle">
                  <AlertTriangle color="#ef4444" size={32} />
                </div>
                <div className="flex-1">
                  <div className="alert-header-row">
                    <span className="badge-critical">CRÍTICO</span>
                    <span className="alert-action-text">Ação imediata necessária</span>
                  </div>
                  
                  {/* Título dinâmico */}
                  <h2 className="alert-sensor-title">{sensor.nome}</h2>
                  
                  <div className="alert-meta-row">
                    <span className="alert-meta-item">
                      <MapPin size={16}/> {sensor.setor}
                    </span>
                    <span className="alert-meta-item">
                      <Gauge size={16}/> {sensor.tipo || 'temperatura'}
                    </span>
                  </div>
                  
                  {/* No Dashboard.js, dentro do map da listaAlertas */}
                  <div className="current-value">
                    {/* Antes era sensor.valor, agora é o valorDestaque que criamos */}
                    {sensor.valorDestaque}
                    <span className="unit-text">{sensor.unidade}</span>
                  </div>
                  <span className="limit-text"> Limite: {sensor.limite} </span>
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      {/* SEÇÃO DE RESUMO (CARDS DE BAIXO) */}
      <section className="summary-section">
        <div className="summary-grid">
            
          {/* O card agora muda de 'red' para 'green' automaticamente */}
          <div className={`summary-card ${totalAlertas === 0 ? 'green' : 'red'}`}>
            <div>
                <p className="summary-label">Alertas Críticos</p>
                <h3 className="summary-value">{totalAlertas}</h3>
                  
              {/* O texto de baixo também muda conforme a situação */}
              <p className="summary-subtext">
                {totalAlertas === 0 ? 'Tudo normal' : 'Ação necessária'}
              </p>
            </div>
                
            {/* Ícone muda de Alerta para Check se estiver tudo OK */}
            <div className="summary-icon">
              {totalAlertas === 0 ? <Zap size={20}/> : <AlertTriangle size={20}/>}
            </div>
          </div>

          <div className="summary-card">
            <div>
              <p className="summary-label">Sensores Ativos</p>
              <h3 className="summary-value">{resumoGeral.sensoresAtivos}</h3>
              <p className="summary-subtext">de {resumoGeral.sensoresTotal} instalados</p>
            </div>
            <div className="summary-icon"><Cpu size={20}/></div>
          </div>

          {/* Card 03: Leituras Hoje (Dinâmico) */}
          <div className="summary-card">
            <div>
              <p className="summary-label">Leituras Hoje</p>
              <h3 className="summary-value">{resumoGeral.leiturasHoje}</h3>
              <p className="summary-subtext">últimas 24h</p>
            </div>
            <div className="summary-icon"><Activity size={20}/></div>
          </div>

          {/* Card 04: Eficiência MOMENTÂNEA (Dinâmico) */}
          <div className="summary-card green">
            <div>
              <p className="summary-label">Eficiência Atual</p>
              <h3 className="summary-value">{resumoGeral.eficienciaAtual}</h3>
              <p className="summary-subtext">operação em tempo real</p>
            </div>
            <div className="summary-icon"><TrendingUp size={20}/></div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE MÉTRICAS DO TURNO */}
      <section className="metrics-section">
        <div className="metrics-container">
          <div className="metrics-header">
            <div className="metrics-title-group">
              <h3>Métricas do Turno</h3>
              <div className="metrics-subtitle">
                <Clock size={16} />
                {/* Período dinâmico */}
                <span>{metricasTurno.periodo}</span>
              </div>
            </div>
            {/* Contagem de leituras dinâmica */}
            <div className="readings-badge">{metricasTurno.totalLeituras} leituras</div>
          </div>

          <div className="metrics-row">
            <div className="metric-box-item">
              <div className="metric-label-group text-slate">
                <Activity size={16} /><span>Média</span>
              </div>
              <span className="metric-value-big font-bold">{metricasTurno.media}</span>
            </div>

            <div className="metric-box-item">
              <div className="metric-label-group text-red-light">
                <TrendingUp size={16} /><span>Pico Máximo</span>
              </div>
              <span className="metric-value-big font-bold text-red-light">{metricasTurno.picoMaximo}</span>
            </div>

            <div className="metric-box-item">
              <div className="metric-label-group text-blue-light">
                <TrendingDown size={16} /><span>Mínimo</span>
              </div>
              <span className="metric-value-big font-bold text-blue-light">{metricasTurno.minimo}</span>
            </div>

            <div className="metric-box-item">
              <div className="metric-label-group text-green">
                <Zap size={16} /><span>Eficiência</span>
              </div>
              <span className="metric-value-big font-bold text-green">{metricasTurno.eficienciaTurno}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: VISÃO POR SETOR AUTOMÁTICA */}
      <section className="sectors-section">
        <h2 className="sectors-title">Visão por Setor</h2>
        
        <div className="sectors-grid">
          {listaSetores.map((setor) => (
            /* O card muda de classe sozinho se o status for 'alerta' */
            <div key={setor.id} className={`sector-card ${setor.status === 'alerta' ? 'highlight-alert' : ''}`}>
              
              <div className="sector-card-header">
                <div className="sector-name-group">
                  {/* O círculo muda de cor automaticamente */}
                  <Circle 
                    size={10} 
                    fill={setor.status === 'alerta' ? "#ef4444" : "#10b981"} 
                    color={setor.status === 'alerta' ? "#ef4444" : "#10b981"} 
                  />
                  <span>{setor.nome}</span>
                </div>
                <span className="sensor-count">{setor.sensores.length} sensores</span>
              </div>

              <div className="sector-sensors-list">
                {/* Segundo MAP: Para listar os sensores de cada setor */}
                {setor.sensores.map((s) => (
                  <div key={s.id} className="sensor-item-row">
                    <div className="sensor-info">
                      <Gauge size={16}/> {s.nome}
                    </div>
                    {/* A cor do valor muda se o sensor for crítico */}
                    <div className={`sensor-value-status ${s.critico ? 'text-alert' : 'text-normal'}`}>
                      {s.valor} <small>{s.unidade}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO: ANÁLISE DETALHADA (AGORA AUTOMÁTICA) */}
      <section className="analysis-section">
        <div className="analysis-header">
          <h2 className="analysis-title">Análise Detalhada</h2>
          <select 
            className="analysis-select"
            value={selectedSensorId}
            onChange={(e) => setSelectedSensorId(e.target.value)}
          >
            <option value="">Selecione um Sensor</option>
            {listaSetores.map((setor) => (
              <optgroup key={setor.id} label={setor.nome}>
                {setor.sensores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="chart-card">
          <div className="chart-info-header">
            <div className="chart-labels">
              <h3>Evolução das Leituras</h3>
              <p>{dadosGrafico ? dadosGrafico.nome : "Aguardando seleção..."}</p>
            </div>
            <div className="chart-legend">
              <div className="legend-line" style={{ backgroundColor: '#f6ad55', border: 'none' }}></div>
              <span>Limite: {dadosGrafico ? `${dadosGrafico.limiteMaximo} ${dadosGrafico.unidade}` : "--"}</span>
            </div>
          </div>

          {/* ÁREA DO GRÁFICO REAL (RECHARTS) */}
          <div className="chart-container-real" style={{ width: '100%', height: 300, marginTop: '20px' }}>
            {dadosGrafico ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosGrafico.historico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid pontilhado igual ao Print 1 */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3748" />
                  
                  <XAxis 
                    dataKey="horario" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    dy={10}
                  />
                  
                  <YAxis 
                    hide={false} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}}
                    domain={[0, 'auto']} 
                  />

                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />

                  {/* Linha de Limite Laranja (ReferenceLine) */}
                  <ReferenceLine 
                    y={dadosGrafico.limiteMaximo} 
                    stroke="#f6ad55" 
                    strokeDasharray="5 5" 
                    label={{ position: 'right', value: 'LIMITE', fill: '#f6ad55', fontSize: 10 }} 
                  />

                  {/* A Linha Azul com os Pontos */}
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValor)" 
                    dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#0f172a' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-placeholder">
                <Activity size={48} color="#1e293b" />
                <p>Selecione um sensor para visualizar a telemetria</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* SEÇÃO: ÚLTIMAS LEITURAS AUTOMÁTICA */}
      <section className="readings-section">
        <div className="readings-card">
          <div className="readings-header">
            <h3>Últimas Leituras</h3>
            <p>Monitoramento em tempo real</p>
          </div>

          {/* Cabeçalho da Tabela (Fixo) */}
          <div className="table-grid-row table-head">
            <span>Sensor</span>
            <span>Setor</span>
            <span>Valor</span>
            <span>Status</span>
            <span>Horário</span>
          </div>

          {/* MAP: Criando cada linha da tabela dinamicamente */}
          {listaLeituras.map((leitura) => (
            <div key={leitura.id} className="table-grid-row">
              <span className="sensor-name-cell">{leitura.sensor}</span>
              
              <div className="cell-with-icon">
                <MapPin size={14}/> {leitura.setor}
              </div>
              
              {/* O valor muda de cor conforme o status */}
              <div className={`font-bold ${
                leitura.status === 'CRÍTICO' ? 'text-red' : 
                leitura.status === 'ATENÇÃO' ? 'text-orange' : 'text-green'
              }`}>
                {leitura.valor} <small className="unit-small">{leitura.unidade}</small>
              </div>
              
              <div>
              
              {/* A pílula de status também é dinâmica */}
                <span className={`status-pill ${
                  leitura.status === 'CRÍTICO' ? 'critico' : 
                  leitura.status === 'ATENÇÃO' ? 'atencao' : 'normal'
                }`}>
                  {leitura.status}
                </span>
              </div>
              
              <div className="cell-with-icon">
                <Clock size={14}/> {leitura.horario}
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

export default Dashboard;