export const calcularStatus = (valor, limite) => {
    if (valor == null || limite == null) return 'DESCONHECIDO';
    if (valor >= limite) return 'CRÍTICO';
    if (valor >= limite * 0.8) return 'ATENÇÃO';
    return 'NORMAL';
};

// Adicione esta nova função para processar várias leituras de uma vez
export const processarResumoLeituras = (leituras) => {
    if (!leituras || leituras.length === 0) return { total: 0, criticos: 0 };

    const criticos = leituras.filter(l => l.status === 'CRÍTICO').length;
    
    return {
        total: leituras.length,
        criticos: criticos,
        estabilidade: criticos === 0 ? 'ESTÁVEL' : 'INSTÁVEL'
    };
};