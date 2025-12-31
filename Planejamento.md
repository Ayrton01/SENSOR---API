Documento de Planejamento e Decisão: SENSOR DE FABRICA API

Versão: 1.0
Data: 18 de setembro de 2025

1. Visão Geral

Em ecossistemas de manufatura moderna, a fragmentação de dados de sensores resulta em manutenções reativas e ineficiência operacional. A SENSOR DE FÁBRICA API foi projetada para atuar como o orquestrador central de telemetria, centralizando a ingestão de dados e transformando sinais brutos em inteligência operacional.

O backend fornecerá uma estrutura robusta para:

- Ingestão e Persistência: Centralizar o recebimento de dados de múltiplos sensores IoT (temperatura, vibração, etc.) de forma estruturada.

- Gerenciamento de Ativos: Expor uma interface RESTful para consulta de histórico e administração de sensores cadastrados.

- Monitoramento e Resposta: Detectar anomalias em tempo real e disparar notificações para sistemas legados externos.

2. Requisitos 

2. 1. Requisitos Funcionais

RF01: Permitir o provisionamento (cadastro) de novos sensores, definindo tipo e local.

RF02: Listagem integral de todos os ativos (sensores) monitorados.

RF03: Ingestão de telemetria, associando cada leitura ao seu respectivo sensor de origem.

RF04: Consulta de séries temporais (histórico de leituras) por ID de sensor.

RF05 (Proteção de Recursos): O sistema deve garantir que o acesso aos endpoints de registro (sensores e leituras) seja restrito, exigindo autenticação obrigatória para assegurar a integridade dos dados.

RF06 (Mecanismo de Autenticação): O sistema deve implementar um serviço de emissão e validação de tokens (JWT - JSON Web Tokens) para a identificação e autorização segura de dispositivos e usuários.

RF07: Executar lógica de detecção de anomalias com integração via Webhooks/API para sistemas externos.

RF08: Disponibilizar endpoints otimizados para consumo de Dashboards em tempo real.

RF09: Prover exportação de dados em formatos estruturados como JSON e CSV.

2. 2. Requisitos Não Funcionais (RNF)

RNF01: Garantir a integridade e confidencialidade dos dados trafegados.

RNF02: Adotar arquitetura em camadas (API, Core, Infra) para facilitar a manutenibilidade.

RNF03: Resiliência a falhas: erros em integrações externas não devem comprometer o fluxo principal de ingestão.

RNF04: Cobertura de testes unitários para as regras de negócio críticas.

RNF06: Arquitetura Stateless, permitindo escalabilidade horizontal do serviço.

3. Decisões de Arquitetura e Tecnologias

- Runtime: Node.js (Ambiente não-bloqueante para alta performance em I/O).

- Framework: Express.js (Agilidade no roteamento e middleware).

- Persistência: SQLite com Sequelize ORM (Portabilidade e abstração de queries).

- Segurança: JWT (JSON Web Tokens) para autenticação segura.

- Qualidade: Jest & Supertest (Testes unitários e de integração).

3. 1. Sistema Legado de Alertas (Mock)

Finalidade: Permitir o desenvolvimento e a homologação do RF07 (Detecção de Anomalias) de forma isolada e controlada.

Arquitetura da Simulação: Implementação de um serviço independente (Sistema_Legado.js) utilizando Node.js e Express.js para simular o comportamento de um ambiente de produção.

Parâmetros de Operação:

- Isolamento de Porta: O servidor simulado operará em uma porta distinta da API principal (ex: :3001).

- Interface de Comunicação: Exposição do endpoint único POST /api/alerts.

- Comportamento: O serviço atuará como um receptor de payloads, realizando o log dos dados recebidos no console para fins de auditoria visual e retornando o status 200 OK para confirmar a ingestão.

4. Modelo de Dados (Entidades e Relacionamentos)

O sistema é fundamentado em duas entidades principais com relacionamento de um para muitos (1:N).

Entidade: Sensor (Ativo de Fábrica)
Representa o hardware físico instalado no chão de fábrica.

id: UUID 

tipo: String (ex: "TEMPERATURE", "VIBRATION").

local: String (ex: "Motor Bloco A").

dataCriacao: Timestamp do cadastro inicial.

ultimaAtualizacao: Timestamp da última modificação cadastral.

Entidade: Reading (Leitura de Telemetria)
Representa cada dado capturado e enviado pelos sensores.

id: UUID 

sensorId: UUID (Chave Estrangeira, referência ao Sensor).

temperatura: Float (Nulo se não aplicável).

vibracao: Float (Nulo se não aplicável).

dataMedicao: Data e hora exata da captura no sensor.

dataRecebido: Timestamp de quando o dado foi processado pela API.

5. Principais Endpoints

Método    | Endpoint                  |  Descrição                                | Autenticação
POST      | /auth/token               |  Emissão de token de acesso               | N/A
POST      | /sensors                  |  Cadastro de novo dispositivo             | JWT
GET       | /sensors                  |  Listagem de todos os sensores            | JWT
POST      | /readings                 |  Ingestão de nova leitura                 | JWT
GET       | /sensors/{id}/readings    |  Histórico de leituras por sensor         | JWT