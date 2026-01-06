Documento de Planejamento e Decisão: SENSOR DE FABRICA API

Versão: 1.5
Data: 04 de Janeiro de 2026

1. Visão Geral

Em ecossistemas de manufatura moderna, a fragmentação de dados de sensores resulta em manutenções reativas e ineficiência operacional. A SENSOR DE FÁBRICA API foi projetada para atuar como o orquestrador central de telemetria, centralizando a ingestão de dados e transformando sinais brutos em inteligência operacional.

O projeto integra um backend a uma interface de monitoramento industrial (Dashboard), permitindo que gestores visualizem a saúde dos ativos em tempo real.

O ecossistema fornecerá uma estrutura robusta para:

- Ingestão e Persistência: Centralizar o recebimento de dados de múltiplos sensores IoT de forma estruturada e genérica.

- Gerenciamento de Ativos: Expor uma interface RESTful para administração de sensores, setores e limites de segurança.

- Monitoramento e Resposta: Detectar anomalias em tempo real e disparar notificações para sistemas legados externos.

- Visualização de Dados: Disponibilizar um Dashboard industrial para análise detalhada de métricas e alertas críticos.

2. Requisitos 

2. 1. Requisitos Funcionais

RF01: Permitir o cadastro de sensores definindo tipo, local, setor e limites de segurança.

RF02: Listagem integral de todos os ativos (sensores) monitorados.

RF03: Ingestão de telemetria utilizando um campo genérico de valor (Float), permitindo que a API suporte diversos tipos de grandezas industriais.

RF04: Consulta de séries temporais (histórico de leituras) por ID de sensor.

RF05 (Proteção de Recursos): O sistema deve garantir que o acesso aos endpoints de registro (sensores e leituras) seja restrito, exigindo autenticação obrigatória para assegurar a integridade dos dados.

RF06 (Mecanismo de Autenticação): O sistema deve implementar um serviço de emissão e validação de tokens (JWT - JSON Web Tokens) para a identificação e autorização segura de dispositivos e usuários.

RF07: RF07: Executar lógica de detecção de anomalias (comparando o valor recebido com os limites cadastrados no Sensor) e integrar via Webhooks com o Sistema Legado.

RF08: Disponibilizar endpoints otimizados para consumo de Dashboards em tempo real.

RF09: Prover exportação de dados em formatos estruturados como JSON e CSV.

RF10: Prover um Dashboard Industrial para visualização de métricas consolidadas (médias e picos) e sinalização visual de alertas críticos.

2. 2. Requisitos Não Funcionais (RNF)

RNF01: A segurança será garantida via Token JWT. O Dashboard implementará um bloqueio de interface (Overlay) que exigirá a validação da chave de acesso antes de realizar qualquer requisição aos dados de telemetria.

RNF02: Adotar arquitetura em camadas (API, Core, Infra) para facilitar a manutenibilidade.

RNF03: Resiliência a falhas: erros em integrações externas não devem comprometer o fluxo principal de ingestão.

RNF04: Cobertura de testes unitários para as regras de negócio críticas.

RNF05: Arquitetura Stateless, permitindo escalabilidade horizontal do serviço.

RNF06: O Dashboard deve atualizar os dados em intervalos de curto prazo (ex: a cada 10 segundos) para garantir o monitoramento em tempo real.

RNF07: A interface deve ser responsiva e adaptada para visualização em telas de monitoramento no chão de fábrica (PIM).

3. Decisões de Arquitetura e Tecnologias

- Runtime: Node.js (Ambiente não-bloqueante para alta performance em I/O).

- Framework: Express.js (Agilidade no roteamento e middleware).

- Interface Frontend: React.js (Biblioteca moderna para interfaces reativas e componentes reutilizáveis).

- CORS: Middleware para permitir a comunicação segura entre o Frontend (React) e o Backend (Node.js).

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

Observação de Infraestrutura: Para garantir o funcionamento simultâneo de todos os módulos e evitar conflitos de rede no ambiente de desenvolvimento, o ecossistema utiliza um mapeamento de portas dedicado, operando a API Principal (Backend) na porta :3000, o Sistema Legado (Mock) na porta :3001 e o Frontend em React na porta :5173 (padrão Vite).

4. Modelo de Dados (Entidades e Relacionamentos)

O sistema é fundamentado em duas entidades principais com relacionamento de um para muitos (1:N).

Entidade: Sensor (Ativo de Fábrica)
Representa o hardware físico instalado no chão de fábrica.

id: UUID 

tipo: String.

setor: String. 

local: String. 

limiteMinimo / limiteMaximo: Float.

dataCriacao / ultimaAtualizacao: Timestamps.

Entidade: Leitura (Telemetria) 
Representa cada dado capturado, utilizando um modelo genérico para flexibilidade de grandezas.

id: UUID 

sensorId: UUID (Chave Estrangeira, referência ao Sensor).

valor: Float (Valor numérico da medição, independente da unidade de medida).

dataMedicao: Data e hora exata da captura no sensor.

dataRecebido: Timestamp de quando o dado foi processado pela API.

5. Principais Endpoints

Método    | Endpoint                  |  Descrição                                | Autenticação
POST      | /auth/token               |  Emissão de token de acesso               | N/A
POST      | /sensors                  |  Cadastro de novo dispositivo             | JWT
GET       | /sensors                  |  Listagem de todos os sensores            | JWT
POST      | /readings                 |  Ingestão de nova leitura                 | JWT
GET       | /sensors/{id}/readings    |  Histórico de leituras por sensor         | JWT
GET	      | /sensors/reports/summary  |	 Relatório para Dashboard.	              | JWT