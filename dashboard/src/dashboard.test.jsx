// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Dashboard from './dashboard';
import { test, expect, vi, afterEach } from 'vitest';
import { AuthContext } from './token/AuthContext';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Garante que o DOM seja limpo após cada teste para evitar duplicidade de elementos
afterEach(() => {
  cleanup();
});

// Mock do hook Alerta para evitar chamadas de API reais e erros de rede
vi.mock('./funcoes/alerta', () => ({
  Alerta: () => ({
    totalAlertas: 0,
    listaAlertas: [],
    listaSetores: [],
    listaLeituras: [],
    metricasTurno: { periodo: 'Teste', totalLeituras: 0, media: 0, picoMaximo: 0, minimo: 0, eficienciaTurno: '100%' },
    resumoGeral: { sensoresAtivos: 0, sensoresTotal: 0, leiturasHoje: 0, eficienciaAtual: '100%' },
    loading: false,
    atualizarDados: vi.fn(),
  }),
}));

test('renders dashboard title', () => {
  // Simula os dados de um usuário autenticado
  const authMock = {
    authenticated: true,
    loading: false,
    logout: () => {}
  };

  render(
    <AuthContext.Provider value={authMock}>
      <Dashboard />
    </AuthContext.Provider>
  );

  const linkElement = screen.getByText(/Monitoramento Industrial/i);
  expect(linkElement).toBeInTheDocument();
});

test('exibe mensagem de "Não há alertas" quando a lista está vazia', () => {
  const authMock = {
    authenticated: true,
    loading: false,
    logout: () => {}
  };

  render(
    <AuthContext.Provider value={authMock}>
      <Dashboard />
    </AuthContext.Provider>
  );

  // Como o mock retorna totalAlertas: 0, o dashboard deve mostrar o card verde
  const successMessages = screen.getAllByText(/Não há alertas críticos/i);
  expect(successMessages[0]).toBeInTheDocument();
});

test('deve chamar a função de logout ao clicar no botão de sair', () => {
  // 1. Criamos um "espião" (mock function) para a função de logout
  const logoutSpy = vi.fn();

  const authMock = {
    authenticated: true,
    loading: false,
    logout: logoutSpy // Passamos o espião aqui
  };

  // 2. Renderizamos o Dashboard
  render(
    <AuthContext.Provider value={authMock}>
      <Dashboard />
    </AuthContext.Provider>
  );

  // 3. Encontramos o botão de Sair (ajuste o texto conforme o seu componente)
  const botaoSair = screen.getByRole('button', { name: /sair|logout/i });

  // 4. Simulamos o CLIQUE do usuário (Interação de UI)
  fireEvent.click(botaoSair);

  // 5. A PROVA REAL: A função de logout foi chamada?
  expect(logoutSpy).toHaveBeenCalledTimes(1);
});
