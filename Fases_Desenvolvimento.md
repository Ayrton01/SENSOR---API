Fases_API - Fabrica_Sensor

1. Fase 1: Setup e Arquitetura de Referência
Objetivo: Estabelecer o ambiente de desenvolvimento e a estrutura de pastas seguindo o padrão de camadas (API, Core, Infra).

- Inicialização do Workspace: Estruturar o diretório raiz, inicializar o repositório Git e configurar o arquivo .gitignore para omitir dependências e dados sensíveis.

- Gerenciamento de Dependências: Instalar o Express.js para orquestração de rotas e o Nodemon como ferramenta de Hot Reload no ambiente de desenvolvimento.

- Definição da Árvore de Diretórios: Criar os diretórios /src/api (interfaces), /src/core (regras de negócio) e /src/infra (persistência e serviços externos) para garantir a separação de responsabilidades.

- Bootstrap do Servidor: Implementar a instância inicial do Express com uma rota de "Health Check" para validar a conectividade do serviço.

2. Fase 2: Persistência e Domínio (CRUD de Sensores)
Objetivo: Implementar a camada de persistência e os endpoints básicos de gerenciamento de dispositivos.

- Configuração da Camada de Dados: Estabelecer a conexão com o banco de dados SQLite através do Sequelize ORM.

- Mapeamento da Entidade Sensor: Definir o Model Sensor com os atributos id, tipo, local e createdAt.

- Implementação da Camada de Interface: Desenvolver os controllers e rotas para POST /sensors e GET /sensors.

- Desenvolvimento da Lógica de Negócio: Criar os Use Cases e Repositories responsáveis pela criação e recuperação de registros no banco de dados.

3. Fase 3: Ingestão de Telemetria (Leituras)
Objetivo: Desenvolver o core da aplicação para recebimento e consulta de dados dos sensores.

- Mapeamento da Entidade Reading: Definir o Model Reading com relacionamento de chave estrangeira (BelongsTo) associado ao Sensor.

- Desenvolvimento do Pipeline de Ingestão: Implementar a rota POST /readings com validação de payload para garantir a integridade dos dados recebidos.

- Endpoint de Histórico: Implementar explicitamente o endpoint GET /sensors/{id}/readings para alimentar visualizações de dashboards.

4. Fase 4: Camada de Segurança e Controle de Acesso
Objetivo: Implementar blindagem nos endpoints através de autenticação e autorização stateless.

- Provisão de Credenciais: Criar o endpoint POST /auth/token para validação de chaves de API e emissão de tokens JWT.

- Desenvolvimento de Middleware: Implementar um interceptador de requisições para validação de integridade e expiração do token no cabeçalho Authorization.

Proteção de Recursos: Aplicar o middleware de segurança nos endpoints críticos de escrita e leitura.

5. Fase 5: Inteligência de Negócio e Integração
Objetivo: Implementar o motor de detecção de anomalias e a comunicação com sistemas externos.

- Motor de Regras (Anomalias): Integrar lógica de validação no Use Case de registro de leitura para identificar disparidades térmicas ou vibracionais (ex: temperatura > 90°C).

- Disparo de Alertas: Utilizar o Axios para realizar chamadas HTTP ao sistema legado simulado, notificando falhas em tempo real.

6. Fase 6: Garantia de Qualidade (QA) e Testes
Objetivo: Validar a resiliência do sistema através de testes automatizados.

- Testes Unitários: Validar isoladamente as regras de negócio e detecção de anomalias utilizando Mocks para as camadas de infraestrutura.

- Testes de Integração: Simular fluxos completos de requisição HTTP utilizando Supertest para garantir o funcionamento entre rotas, middlewares e banco de dados.

7. Fase 7: Otimização e Entrega
Objetivo: Finalizar a documentação técnica e realizar o tuning de performance do sistema.

- Externalização de Configurações: Migrar segredos e URLs para arquivos .env, provendo um .env.example para o deploy.

- Documentação Final: Consolidar o README.md com instruções de instalação, execução e testes.

- Performance e Reporting: Otimizar queries para o dashboard e implementar funcionalidades de exportação de dados em formatos estruturados (CSV/JSON).