const jwt = require('jsonwebtoken');

// Em um projeto real, isso ficaria em um arquivo .env (variável de ambiente)
const JWT_SECRET = '1346798250'; 

module.exports = {
  async gerarToken(requisicao, resposta) {
    try {
      const { apiKey } = requisicao.body;

      // Simulando uma validação simples para a fábrica
      if (apiKey !== 'sensor-api-secret-2026') {
        return resposta.status(401).json({ erro: 'Chave de API inválida!' });
      }

      // O Token expira em 1 hora para segurança (Fase 4: Expiração)
      const token = jwt.sign({ projeto: 'FactorySense' }, JWT_SECRET, { expiresIn: '1h' });

      return resposta.json({ auth: true, token });
    } catch (erro) {
      return resposta.status(500).json({ erro: 'Erro ao gerar o token.' });
    }
  }
};