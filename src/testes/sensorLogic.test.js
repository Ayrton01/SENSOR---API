// testes/sensorLogic.test.js
import { describe, it, expect } from 'vitest';
import { calcularStatus, processarResumoLeituras } from '../utils/sensorLogica';

describe('Validação de Alertas - Planta Manaus', () => {
    it('Deve retornar CRÍTICO se o valor atingir o limite', () => {
        expect(calcularStatus(100, 100)).toBe('CRÍTICO');
    });

    it('Deve retornar ATENÇÃO se estiver em 80% do limite', () => {
        expect(calcularStatus(80, 100)).toBe('ATENÇÃO');
    });

    it('Deve retornar NORMAL se estiver abaixo de 80%', () => {
        expect(calcularStatus(70, 100)).toBe('NORMAL');
    });
});

describe('Processamento de Resumo de Leituras', () => {
    it('Deve calcular corretamente o resumo de uma lista de sensores', () => {
        const dadosMocados = [
            { id: 1, status: 'NORMAL' },
            { id: 2, status: 'CRÍTICO' },
            { id: 3, status: 'NORMAL' }
        ];

        const resumo = processarResumoLeituras(dadosMocados);

        expect(resumo.total).toBe(3);
        expect(resumo.criticos).toBe(1);
        expect(resumo.estabilidade).toBe('INSTÁVEL');
    });

    it('Deve retornar estabilidade se não houver críticos', () => {
        const dadosOk = [{ id: 1, status: 'NORMAL' }];
        const resumo = processarResumoLeituras(dadosOk);
        expect(resumo.estabilidade).toBe('ESTÁVEL');
    });
});