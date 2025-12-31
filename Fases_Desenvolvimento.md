Fases_API - Fabrica_Sensor

1. Fase 1: Fundação e Estrutura do Projeto
Objetivo: Preparar o ambiente de desenvolvimento e criar a arquitetura de pastas.

1. 1. Inicializar o Projeto:

Crie a pasta do projeto (SENSOR - API).

Inicie um projeto Node.js com npm init -y.

Inicie o controle de versão com git init. Crie o arquivo .gitignore (para ignorar a pasta node_modules, arquivos .env, etc.).

1. 2. Instalar Dependências Essenciais:

Express.js: Para criar o servidor e as rotas (npm install express).

Nodemon: Para reiniciar o servidor automaticamente durante o desenvolvimento (npm install -D nodemon).

Configure um script dev no seu package.json para rodar com o nodemon (ex: "dev": "nodemon src/server.js").

1. 3. Criar a Estrutura de Pastas:

Crie a estrutura de diretórios que planejamos anteriormente ( /src, /src/api, /src/core, /src/infra, etc.). Isso manterá seu código organizado desde o primeiro dia.

1. 4. Criar o Servidor Básico:

Crie um arquivo server.js (ou app.js) que inicializa o Express, define uma porta para o servidor rodar e cria uma rota de teste (ex: GET /) para garantir que tudo está funcionando.

2. Fase 2: Funcionalidade Principal (CRUD de Sensores)
Objetivo: Implementar a capacidade de cadastrar e listar os sensores.

2. 1. Configurar o Banco de Dados:

Escolha seu banco de dados (SQLite é ótimo para começar).

Instale o driver/ORM necessário (ex: npm install sequelize sqlite3).

Configure a conexão com o banco de dados na pasta /src/infra/database.

2. 2. Modelar a Entidade Sensor:

Crie o "model" do sensor, definindo seus atributos (ex: id, type, location, createdAt).

2. 3. Implementar Rotas e Controladores:

Em /src/api/routes, crie as rotas POST /sensors e GET /sensors.

Em /src/api/controllers, crie os controladores correspondentes que receberão as requisições e chamarão a lógica de negócio.

2. 4. Implementar Casos de Uso e Repositórios:

Em /src/core/use-cases, crie a lógica para "Criar Sensor" e "Listar Sensores".

Em /src/infra/database/repositories, implemente a lógica que efetivamente salva e busca os dados no banco de dados.

3. Fase 3: Recebimento de Dados (Leituras dos Sensores)
Objetivo: Criar o endpoint que será o coração do sistema, recebendo os dados de telemetria.

3. 1. Modelar a Entidade Reading (Leitura):

Crie o model para as leituras, definindo seus atributos (ex: id, sensorId, temperature, vibration, timestamp). Defina a relação de que uma Leitura "pertence a" um Sensor.

3. 2. Implementar a Rota e Controlador:

Crie a rota POST /readings.

Crie o controlador que valida os dados recebidos (se sensorId, temperature, etc., existem).

3. 3. Implementar o Caso de Uso "Registrar Leitura":

Crie a lógica de negócio que recebe os dados da leitura e os salva no banco de dados através do repositório.

4. Fase 4: Segurança (Autenticação e Autorização)
Objetivo: Proteger os endpoints para que apenas dispositivos ou usuários autorizados possam interagir com a API.

4. 1. Instalar Dependências de Segurança:

npm install jsonwebtoken bcryptjs.

4. 2. Criar o Endpoint de Autenticação:

Implemente a rota POST /auth/token. A lógica aqui será simples: receber uma apiKey e apiSecret fixas (guardadas em variáveis de ambiente), validá-las e, se estiverem corretas, gerar e retornar um token JWT.

4. 3. Criar o Middleware de Autorização:

Em /src/api/middlewares, crie uma função que extrai o token JWT do cabeçalho Authorization, verifica sua validade e, em caso de sucesso, permite que a requisição continue. Se o token for inválido, retorna um erro 401 Unauthorized.

4. 4. Proteger as Rotas:

Aplique o middleware de autorização nas rotas que precisam de proteção (ex: POST /readings, POST /sensors).

5. Fase 5: Lógica de Negócio e Integração Externa
Objetivo: Implementar a regra de negócio para detecção de anomalias e a comunicação com o sistema legado.

5. 1. Implementar a Lógica de Anomalia:

Dentro do caso de uso "Registrar Leitura", após salvar os dados, adicione uma verificação. (Ex: if (reading.temperature > 90) { ... }).

5. 2. Configurar o Cliente HTTP:

Instale uma biblioteca para fazer chamadas HTTP, como o Axios (npm install axios).

5. 3. Implementar a Integração:

Crie um serviço na pasta /src/infra/external que será responsável por fazer a chamada POST para a API legada simulada, enviando os detalhes do alerta. Chame este serviço de dentro da lógica de anomalia.

6. Fase 6: Qualidade e Testes
Objetivo: Garantir que o código funciona como esperado e é resiliente a mudanças.

6. 1. Configurar o Ambiente de Testes:

Instale o Jest (npm install -D jest supertest).

Configure um script test no package.json.

6. 2. Escrever Testes Unitários:

Crie testes para as regras de negócio puras (ex: a função que verifica se uma leitura é uma anomalia). Use "mocks" para isolar a lógica do banco de dados e de APIs externas.

6. 3. Escrever Testes de Integração:

Crie testes que simulam uma requisição HTTP real para seus endpoints e verificam se a resposta e o estado do banco de dados estão corretos. O supertest é perfeito para isso.

7. Fase 7: Finalização e Documentação
Objetivo: Deixar o projeto pronto para ser apresentado.

7. 1. Configurar Variáveis de Ambiente:

Mova todas as informações sensíveis (segredos de token, URL do banco, URL da API legada) para um arquivo .env e crie um .env.example para documentar quais variáveis são necessárias.

7. 2. Documentação:

Escreva um README.md completo, explicando o que é o projeto, como configurá-lo, como rodá-lo e como testá-lo. Se você optar por usar o Swagger (Opção 2 da nossa conversa anterior), esta é a hora de finalizar a documentação dos endpoints.