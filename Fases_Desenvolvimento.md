Fases_API - Fabrica_Sensor

1. Fase 1: Setup e Arquitetura de Referência
Objetivo: Estabelecer o ambiente de desenvolvimento e a estrutura de pastas seguindo o padrão de camadas (API, Core, Infra).

- Inicialização do Workspace: Estruturar o diretório raiz, inicializar o repositório Git e configurar o arquivo .gitignore para omitir dependências e dados sensíveis.

- Gerenciamento de Dependências: Instalar o Express.js para orquestração de rotas e o Nodemon como ferramenta de Hot Reload no ambiente de desenvolvimento.

- Definição da Árvore de Diretórios: Criar os diretórios /src/api (interfaces), /src/core (regras de negócio) e /src/infra (persistência e serviços externos) para garantir a separação de responsabilidades.

- Bootstrap do Servidor: Implementar a instância inicial do Express com uma rota de "Health Check" para validar a conectividade do serviço.

2. Fase 2: Persistência e Domínio (CRUD de Sensores)
Objetivo: Implementar a camada de persistência e os endpoints básicos de gerenciamento de ativos com foco em monitoramento industrial.

- Configuração da Camada de Dados: Estabelecer a conexão com o banco de dados SQLite através do Sequelize ORM.

- Mapeamento da Entidade Sensor: Definir o Model Sensor com os atributos: id, tipo, setor, local, limiteMinimo e limiteMaximo. Configurar timestamps como dataCriacao e ultimaAtualizacao.

- Implementação da Camada de Interface: Desenvolver controllers e rotas para POST /sensors e GET /sensors, permitindo o cadastro completo das diretrizes de segurança do ativo.

- Desenvolvimento da Lógica de Negócio: Criar os Use Cases e Repositories responsáveis por persistir e recuperar os sensores, garantindo que os limites de segurança estejam disponíveis para o motor de regras.

3. Fase 3: Ingestão de Telemetria (Leituras)
Objetivo: Desenvolver o core da aplicação para recebimento e consulta de dados genéricos dos sensores.

- Mapeamento da Entidade Leitura: Definir o Model Leitura com o campo valor (Float) e relacionamento de chave estrangeira (BelongsTo) associado ao Sensor. Implementar os campos dataMedicao (origem) e dataRecebido (sistema).

- Desenvolvimento do Pipeline de Ingestão: Implementar a rota POST /readings com validação de payload genérico. O sistema deve aceitar qualquer valor numérico, delegando a interpretação da grandeza ao tipo de sensor cadastrado na Fase 2.

- Endpoint de Histórico: Implementar o endpoint GET /sensors/{id}/readings otimizado para fornecer as séries temporais que alimentarão os gráficos de tendência no React.

4. Fase 4: Camada de Segurança e Controle de Acesso
Objetivo: Implementar blindagem nos endpoints através de autenticação e autorização stateless.

- Provisão de Credenciais: Criar o endpoint POST /auth/token para validação de chaves de API e emissão de tokens JWT.

- Desenvolvimento de Middleware: Implementar um interceptador de requisições para validação de integridade e expiração do token no cabeçalho Authorization.

Proteção de Recursos: Aplicar o middleware de segurança nos endpoints críticos de escrita e leitura.

5. Fase 5: Inteligência de Negócio e Integração
Implementar o motor de detecção de anomalias dinâmico e endpoints de agregação para o Dashboard.

- Motor de Regras (Anomalias): Desenvolver a lógica de comparação dinâmica no Use Case de registro. O sistema deve validar se o valor recebido está fora do intervalo definido pelos campos limiteMinimo e limiteMaximo do sensor específico, eliminando regras fixas no código.

- Endpoints de Agregação (BI): Implementar a rota GET /sensors/reports/summary para realizar cálculos estatísticos no banco de dados (médias, valores de pico e contagem de alertas por setor). Este endpoint é vital para a performance do Dashboard em React.

- Disparo de Alertas (Webhooks): Utilizar o Axios para notificar o Sistema Legado (:3001) em tempo real sempre que uma leitura ultrapassar os limites operacionais, enviando o payload da anomalia detectada.

6. Fase 6: Interface de Monitoramento (React.js)
Objetivo: Construir a interface visual reativa e integrá-la ao ecossistema de telemetria.

- Setup e Estruturação: Inicializar o projeto utilizando Vite + React, configurar variáveis de ambiente (.env) para o endereço da API e estruturar pastas de componentes e serviços (Axios).

- Prototipagem Estática (UI/UX): Traduzir o layout de referência em componentes React, criando a estrutura visual para Cards de Setores, Gráficos e Tabelas com dados fixos (mockados).

- Preparação da Ponte (Backend): Configurar o middleware CORS no servidor Node.js para autorizar a porta :5173 e finalizar o endpoint /sensors/reports/summary com os cálculos de médias e picos.

- Implementação da Camada de Segurança: Desenvolver o Overlay de Acesso para capturar a chave e realizar o login. Implementar o armazenamento do Token JWT (via Context API ou localStorage) para manter o usuário autenticado.

- Consumo e Sincronização: Substituir os dados fixos pelas chamadas reais à API, inserindo a lógica de Polling (10s) e tratando estados de "Carregando" ou "Erro de Conexão" para feedback ao usuário.

7. Fase 7: Garantia de Qualidade (QA) e Testes
Objetivo: Validar a resiliência do sistema através de testes automatizados.

- Testes Unitários: Validar isoladamente as regras de negócio e detecção de anomalias utilizando Mocks para as camadas de infraestrutura.

- Testes de Integração: Simular fluxos completos de requisição HTTP utilizando Supertest para garantir o funcionamento entre rotas, middlewares e banco de dados.

8. Fase 8: Otimização e Entrega
Objetivo: Finalizar a documentação técnica e realizar o tuning de performance do sistema.

- Externalização de Configurações: Migrar segredos e URLs para arquivos .env, provendo um .env.example para o deploy.

- Documentação Final: Consolidar o README.md com instruções de instalação, execução e testes.

- Performance e Reporting: Otimizar queries para o dashboard e implementar funcionalidades de exportação de dados em formatos estruturados (CSV/JSON).