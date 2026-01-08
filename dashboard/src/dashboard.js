import React, { useEffect } from 'react';

import { 
  
  // --- Interface e Navegação ---
  Factory, ChevronDown, RefreshCcw, Clock,
  
  // --- Alertas e Status ---
  AlertTriangle, Circle,
  
  // --- Sensores (Campo) ---
  MapPin, Gauge, Thermometer, Droplets,
  
  // --- Métricas e Sistema ---
  Cpu, Activity, Zap, TrendingUp, TrendingDown

} from 'lucide-react';

import { Alerta } from './funcoes/alerta'; // Ajuste: Caminho correto e Case Sensitive (A maiúsculo)

function Dashboard() {

  // Chamamos o seu Hook personalizado
  const { totalAlertas } = Alerta();

  // --- TESTE DE CONEXÃO ---
  useEffect(() => {
    // Chamando a rota principal da sua API
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(data => {
        console.log("🚀 CONEXÃO COM MANAUS ESTABELECIDA!");
        console.log("Mensagem da API:", data.message);
      })
      .catch(error => {
        console.error("❌ ERRO NA PONTE:", error);
      });
  }, []);

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
          <button className="btn-atualizar"><RefreshCcw size={16} /><span>Atualizar</span></button>
        </div>
      </header>

      {/* SEÇÃO DE ALERTAS CRÍTICOS */}
      <main className="alerts-section">
        <div className="alerts-title">
          <AlertTriangle size={22} />
          <span>Alertas Críticos ({totalAlertas})</span>
        </div>

        {totalAlertas === 0 ? (
          /* ESTADO POSITIVO: APARECE QUANDO NÃO HÁ ALERTAS */
          <div className="no-alerts-card">
            <div className="no-alerts-content">
              {/* Ícone de check para dar confiança ao operador */}
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
          /* ESTADO CRÍTICO: SEUS CARDS ORIGINAIS */
          <>
            {/* Card 01 - Motor Injetora */}
            <div className="alert-card">
              <div className="icon-circle"><AlertTriangle color="#ef4444" size={32} /></div>
              <div className="flex-1">
                <div className="alert-header-row">
                  <span className="badge-critical">CRÍTICO</span>
                  <span className="alert-action-text">Ação imediata necessária</span>
                </div>
                <h2 className="alert-sensor-title">Temp. Motor Injetora 01</h2>
                <div className="alert-meta-row">
                  <span className="alert-meta-item"><MapPin size={16}/> Setor de Injetoras</span>
                  <span className="alert-meta-item"><Gauge size={16}/> temperatura</span>
                </div>
                <div className="value-limit-container">
                  <div className="current-value">92.5<span className="unit-text">°C</span></div>
                  <span className="limit-text">Limite: 85 °C</span>
                </div>
              </div>
            </div>

            {/* Card 02 - Vibração Esteira */}
            <div className="alert-card">
              <div className="icon-circle"><AlertTriangle color="#ef4444" size={32} /></div>
              <div className="flex-1">
                <div className="alert-header-row">
                  <span className="badge-critical">CRÍTICO</span>
                  <span className="alert-action-text">Ação imediata necessária</span>
                </div>
                <h2 className="alert-sensor-title">Vibração Esteira A1</h2>
                <div className="alert-meta-row">
                  <span className="alert-meta-item"><MapPin size={16}/> Linha de Montagem A</span>
                  <span className="alert-meta-item"><Gauge size={16}/> vibração</span>
                </div>
                <div className="value-limit-container">
                  <div className="current-value">5.2<span className="unit-text">mm/s</span></div>
                  <span className="limit-text">Limite: 4.5 mm/s</span>
                </div>
              </div>
            </div>
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
            <div><p className="summary-label">Sensores Ativos</p><h3 className="summary-value">8</h3><p className="summary-subtext">de 8 instalados</p></div>
            <div className="summary-icon"><Cpu size={20}/></div>
          </div>

          <div className="summary-card">
            <div><p className="summary-label">Leituras Hoje</p><h3 className="summary-value">22</h3><p className="summary-subtext">últimas 24h</p></div>
            <div className="summary-icon"><Activity size={20}/></div>
          </div>

          <div className="summary-card green">
            <div><p className="summary-label">Eficiência</p><h3 className="summary-value">91%</h3><p className="summary-subtext">operação normal</p></div>
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
                <span>Manhã (06h-14h)</span>
              </div>
            </div>
            <div className="readings-badge">18 leituras</div>
          </div>

          <div className="metrics-row">
            <div className="metric-box-item">
              <div className="metric-label-group text-slate">
                <Activity size={16} /><span>Média</span>
              </div>
              <span className="metric-value-big font-bold">72.5</span>
            </div>

            <div className="metric-box-item">
              <div className="metric-label-group text-red-light">
                <TrendingUp size={16} /><span>Pico Máximo</span>
              </div>
              <span className="metric-value-big font-bold text-red-light">248.5</span>
            </div>

            <div className="metric-box-item">
              <div className="metric-label-group text-blue-light">
                <TrendingDown size={16} /><span>Mínimo</span>
              </div>
              <span className="metric-value-big font-bold text-blue-light">2.8</span>
            </div>

            <div className="metric-box-item">
              <div className="metric-label-group text-green">
                <Zap size={16} /><span>Eficiência</span>
              </div>
              <span className="metric-value-big font-bold text-green">72%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sectors-section">
        <h2 className="sectors-title">Visão por Setor</h2>
        
        <div className="sectors-grid">
          
          {/* Linha de Montagem A - ALERTA */}
          <div className="sector-card highlight-alert">
            <div className="sector-card-header">
              <div className="sector-name-group">
                <Circle size={10} fill="#ef4444" color="#ef4444" />
                <span>Linha de Montagem A</span>
              </div>
              <span className="sensor-count">1 sensores</span>
            </div>
            <div className="sector-sensors-list">
              <div className="sensor-item-row">
                <div className="sensor-info"><Gauge size={16}/> Vibração Esteira A1</div>
                <div className="sensor-value-status text-alert">5.2 <small>mm/s</small></div>
              </div>
            </div>
          </div>

          {/* Linha de Montagem B - NORMAL */}
          <div className="sector-card">
            <div className="sector-card-header">
              <div className="sector-name-group">
                <Circle size={10} fill="#10b981" color="#10b981" />
                <span>Linha de Montagem B</span>
              </div>
              <span className="sensor-count">1 sensores</span>
            </div>
            <div className="sector-sensors-list">
              <div className="sensor-item-row">
                <div className="sensor-info"><Thermometer size={16}/> Temp. Forno Cura</div>
                <div className="sensor-value-status text-normal">178.5 <small>°C</small></div>
              </div>
            </div>
          </div>

          {/* Setor de Injetoras - ALERTA */}
          <div className="sector-card highlight-alert">
            <div className="sector-card-header">
              <div className="sector-name-group">
                <Circle size={10} fill="#ef4444" color="#ef4444" />
                <span>Setor de Injetoras</span>
              </div>
              <span className="sensor-count">2 sensores</span>
            </div>
            <div className="sector-sensors-list">
              <div className="sensor-item-row">
                <div className="sensor-info"><Thermometer size={16}/> Temp. Motor Inje...</div>
                <div className="sensor-value-status text-alert">92.5 <small>°C</small></div>
              </div>
              <div className="sensor-item-row">
                <div className="sensor-info"><Gauge size={16}/> Pressão Linha Hid...</div>
                <div className="sensor-value-status text-normal">215.0 <small>bar</small></div>
              </div>
            </div>
          </div>

          {/* Estamparia - NORMAL */}
          <div className="sector-card">
            <div className="sector-card-header">
              <div className="sector-name-group">
                <Circle size={10} fill="#10b981" color="#10b981" />
                <span>Estamparia</span>
              </div>
              <span className="sensor-count">1 sensores</span>
            </div>
            <div className="sector-sensors-list">
              <div className="sensor-item-row">
                <div className="sensor-info"><Zap size={16}/> Corrente Prensa 02</div>
                <div className="sensor-value-status text-normal">38.5 <small>A</small></div>
              </div>
            </div>
          </div>

          {/* Almoxarifado - NORMAL */}
          <div className="sector-card">
            <div className="sector-card-header">
              <div className="sector-name-group">
                <Circle size={10} fill="#10b981" color="#10b981" />
                <span>Almoxarifado</span>
              </div>
              <span className="sensor-count">1 sensores</span>
            </div>
            <div className="sector-sensors-list">
              <div className="sensor-item-row">
                <div className="sensor-info"><Droplets size={16}/> Umidade Almoxa...</div>
                <div className="sensor-value-status text-normal">58.5 <small>%</small></div>
              </div>
            </div>
          </div>

          {/* Sala de Compressores - NORMAL */}
          <div className="sector-card">
            <div className="sector-card-header">
              <div className="sector-name-group">
                <Circle size={10} fill="#10b981" color="#10b981" />
                <span>Sala de Compressores</span>
              </div>
              <span className="sensor-count">2 sensores</span>
            </div>
            <div className="sector-sensors-list">
              <div className="sensor-item-row">
                <div className="sensor-info"><Gauge size={16}/> Pressão Compres...</div>
                <div className="sensor-value-status text-normal">8.2 <small>bar</small></div>
              </div>
              <div className="sensor-item-row">
                <div className="sensor-info"><Gauge size={16}/> Vibração Motor B...</div>
                <div className="sensor-value-status text-normal">2.8 <small>mm/s</small></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO: ANÁLISE DETALHADA */}
      <section className="analysis-section">
        <div className="analysis-header">
          <h2 className="analysis-title">Análise Detalhada</h2>
          <select className="analysis-select">
            <option>Vibração Esteira A1</option>
            <option>Temp. Motor Injetora 01</option>
            <option>Temp. Forno Cura</option>
          </select>
        </div>

        <div className="chart-card">
          <div className="chart-info-header">
            <div className="chart-labels">
              <h3>Evolução das Leituras</h3>
              <p>Vibração Esteira A1 - Últimas 24h</p>
            </div>
            <div className="chart-legend">
              <div className="legend-line"></div>
              <span>Limite: 4.5</span>
            </div>
          </div>

          {/* Representação Visual do Gráfico */}
          <div className="chart-area-mock">
            {/* Linhas de Grade e Limite (O que você já tem) */}
            <div className="chart-grid-wrapper">
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-limit-line"></div>
              <div className="chart-grid-line"></div>
            </div>

            {/* LINHA "FAKE" PARA O VISUAL */}
            <svg className="chart-svg">
              <path 
                d="M 0 180 Q 150 220 300 190 T 600 150 T 900 120" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="3"
              />
              {/* Ponto de Alerta Vermelho no final */}
              <circle cx="900" cy="120" r="5" fill="#ef4444" />
            </svg>
            
            <span className="time-label">11:15</span>
            <span className="time-label">22:15</span>
            <span className="time-label text-red">06:15</span>
          </div>
        </div>
      </section>

      <section className="readings-section">
        <div className="readings-card">
          <div className="readings-header">
            <h3>Últimas Leituras</h3>
            <p>Monitoramento em tempo real</p>
          </div>

          {/* Cabeçalho da Tabela */}
          <div className="table-grid-row table-head">
            <span>Sensor</span>
            <span>Setor</span>
            <span>Valor</span>
            <span>Status</span>
            <span>Horário</span>
          </div>

          {/* Linha: Temp. Motor Injetora 01 */}
          <div className="table-grid-row">
            <span className="sensor-name-cell">Temp. Motor Injetora 01</span>
            <div className="cell-with-icon"><MapPin size={14}/> Injetoras</div>
            <div className="text-red font-bold">92.5 <small className="unit-small">°C</small></div>
            <div><span className="status-pill critico">CRÍTICO</span></div>
            <div className="cell-with-icon"><Clock size={14}/> 06:30</div>
          </div>

          {/* Linha: Pressão Linha Hidráulica */}
          <div className="table-grid-row">
            <span className="sensor-name-cell">Pressão Linha Hidráulica</span>
            <div className="cell-with-icon"><MapPin size={14}/> Injetoras</div>
            <div className="text-orange font-bold">248.5 <small className="unit-small">bar</small></div>
            <div><span className="status-pill atencao">ATENÇÃO</span></div>
            <div className="cell-with-icon"><Clock size={14}/> 06:25</div>
          </div>

          {/* Linha: Corrente Prensa 02 */}
          <div className="table-grid-row">
            <span className="sensor-name-cell">Corrente Prensa 02</span>
            <div className="cell-with-icon"><MapPin size={14}/> Estamparia</div>
            <div className="text-green font-bold">38.5 <small className="unit-small">A</small></div>
            <div><span className="status-pill normal">NORMAL</span></div>
            <div className="cell-with-icon"><Clock size={14}/> 06:20</div>
          </div>

          {/* Linha: Vibração Esteira A1 */}
          <div className="table-grid-row">
            <span className="sensor-name-cell">Vibração Esteira A1</span>
            <div className="cell-with-icon"><MapPin size={14}/> Linha Montagem A</div>
            <div className="text-red font-bold">5.2 <small className="unit-small">mm/s</small></div>
            <div><span className="status-pill critico">CRÍTICO</span></div>
            <div className="cell-with-icon"><Clock size={14}/> 06:15</div>
          </div>

          {/* Linha: Pressão Compressor 01 */}
          <div className="table-grid-row">
            <span className="sensor-name-cell">Pressão Compressor 01</span>
            <div className="cell-with-icon"><MapPin size={14}/> Compressores</div>
            <div className="text-green font-bold">8.2 <small className="unit-small">bar</small></div>
            <div><span className="status-pill normal">NORMAL</span></div>
            <div className="cell-with-icon"><Clock size={14}/> 06:00</div>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default Dashboard;