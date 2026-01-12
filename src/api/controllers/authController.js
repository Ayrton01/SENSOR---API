const jwt = require('jsonwebtoken');

/**
 * Controller de Autenticação - Planta Manaus
 * Responsável por validar a API Key e fornecer o Token JWT para acesso seguro.
 */

// Em um projeto real, isso ficaria no arquivo .env
const JWT_SECRET = '1346798250'; 

module.exports = {
  async gerarToken(requisicao, resposta) {
    try {
      const { apiKey } = requisicao.body;

      // 1. VALIDAÇÃO DA CHAVE MESTRA
      // Padronizado para 'message' e 'Chave Inválida!' para alinhar com o arquivo de teste
      if (apiKey !== 'sensor-api-secret-2026') {
        return resposta.status(401).json({ 
          message: 'Chave Inválida!' 
        });
      }

      // 2. GERAÇÃO DO TOKEN (Fase 4: Segurança Industrial)
      // O Token expira em 1 hora para evitar acessos prolongados sem revalidação
      const token = jwt.sign(
        { projeto: 'PlantaManaus_Sense' }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );

      // 3. RESPOSTA DE SUCESSO
      return resposta.json({ 
        auth: true, 
        token 
      });

    } catch (erro) {
      console.error('Erro na Autenticação:', erro);
      
      return resposta.status(500).json({ 
        message: 'Erro interno ao gerar o token de acesso.' 
      });
    }
  }
};