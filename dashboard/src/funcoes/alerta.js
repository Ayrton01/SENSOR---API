// useAlerts.js
import { useState } from 'react';

export function Alerta() {

  // Por enquanto o valor é estático (2), 
  // mas na Fase 7 aqui entrará o fetch da sua API!
  const [totalAlertas, setTotalAlertas] = useState(1);

  // Criamos a função para o erro sumir
  function atualizarAlertas() {
    setTotalAlertas(1); // Usamos o 'set' para o aviso de "unused" sumir também
  }

  return { totalAlertas, atualizarAlertas };

}