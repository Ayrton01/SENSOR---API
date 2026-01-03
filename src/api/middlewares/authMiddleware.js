const jwt = require('jsonwebtoken');

// DEVE ser a mesma chave que você definiu no authController
const JWT_SECRET = '1346798250'; 

module.exports = (requisicao, resposta, proximo) => {
  // 1. Pega o token que vem no cabeçalho da requisição
  const authHeader = requisicao.headers.authorization;

  if (!authHeader) {
    return resposta.status(401).json({ erro: 'Token não fornecido! Acesso negado.' });
  }

  // O padrão do cabeçalho é: "Bearer <TOKEN>"
  const partes = authHeader.split(' ');
  if (partes.length !== 2) {
    return resposta.status(401).json({ erro: 'Erro no formato do token!' });
  }

  const [ esquema, token ] = partes;

  // 2. Verifica se o "lacre" do token é válido usando a nossa chave secreta
  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    
    // Salva os dados do token na requisição para uso futuro se precisar
    requisicao.projetoId = decodificado.projeto;

    // 3. Se estiver tudo OK, o "segurança" deixa passar para o controlador
    return proximo();
  } catch (erro) {
    return resposta.status(401).json({ erro: 'Token inválido ou expirado!' });
  }
};