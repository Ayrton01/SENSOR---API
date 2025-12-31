Documento de Planejamento e Decisão: SENSOR DE FABRICA API

Versão: 1.0
Data: 18 de setembro de 2025

1. Visão Geral

Em ambientes de manufatura modernos, a coleta de dados de sensores é muitas vezes descentralizada e reativa, dificultando a manutenção proativa e a otimização de processos. O projeto SENSOR DE FABRICA API surge para resolver este desafio, atuando como o sistema nervoso central para o chão de fábrica.

Trata-se de um backend robusto e seguro que irá centralizar o recebimento de dados de telemetria de múltiplos sensores IoT, como temperatura e vibração. O objetivo é transformar dados brutos em informações acionáveis. Para isso, o sistema irá:

º Ingerir e Armazenar: Oferecer um ponto de entrada confiável para os dados dos sensores e persistí-los de forma estruturada.

º Expor e Gerenciar: Fornecer uma API RESTful para que outras aplicações possam consultar o histórico de dados e gerenciar os sensores cadastrados.

º Alertar e Integrar: Identificar automaticamente anomalias (leituras fora do padrão) e notificar sistemas legados em tempo real, permitindo uma resposta rápida a possíveis falhas.

2. Requisitos 

2. 1. Requisitos Funcionais

RF01: O sistema deve permitir o cadastro de novos sensores, especificando seu tipo (ex: "Termômetro", "Vibrômetro") e localização.

RF02: O sistema deve permitir a listagem de todos os sensores cadastrados.

RF03: O sistema deve receber e armazenar leituras de dados enviadas pelos sensores. Cada leitura deve ser associada ao seu respectivo sensor.

RF04: O sistema deve expor um endpoint para consultar o histórico de leituras de um sensor específico.

RF05: O acesso para registrar novas leituras e sensores deve ser protegido e exigir autenticação.

RF06: O sistema deve fornecer um mecanismo de autenticação baseado em token para os dispositivos.

RF07: O sistema deve identificar leituras que excedam limites pré-definidos (anomalias) e notificar um sistema legado externo através de uma chamada de API.

2. 2. Requisitos Não Funcionais

RNF01: A API deve garantir a confidencialidade e integridade dos dados, aplicando práticas de segurança essenciais desde o início.

RNF02: Manter a estrutura de código em camadas (API, Core, Infra) para garantir que seja fácil de entender, modificar e dar manutenção no futuro.

RNF03: A API deve ser capaz de lidar com falhas em sistemas externos (como o sistema legado) sem travar. Ela deve registrar o erro e continuar sua operação principal.

RNF04: A lógica de negócio principal (casos de uso, como a detecção de anomalias) deve ser coberta por testes unitários para validar seu comportamento.

RNF05: Projeto deve ser entregue com uma documentação README.md que explique o que ele é, como instalá-lo e como executá-lo.

RNF06: A API deve ser projetada sem manter o estado da sessão do cliente no servidor (stateless), um princípio que permite maior flexibilidade e escalabilidade no futuro.

3. Decisões de Arquitetura e Tecnologias

Linguagem/Runtime - Node.js	
Ambiente de execução JavaScript não-bloqueante, ideal para operações de I/O intensivas como em uma API. Ecossistema (NPM) vasto.

Framework - Web	Express.js	
Minimalista, flexível e com uma comunidade enorme. Perfeito para construir APIs RESTful de forma rápida e eficiente.

Banco de Dados - SQLite (via Sequelize ORM)	
Relacional, simples de configurar (baseado em arquivo), sem a necessidade de um servidor separado. Ótimo para desenvolvimento e projetos de pequeno/médio porte. O ORM Sequelize abstrai as queries SQL.

Autenticação - JWT (JSON Web Tokens)	
Padrão de mercado para APIs stateless. Permite que o cliente (sensor/dispositivo) se autentique uma vez e envie o token a cada requisição, sem a necessidade de armazenar sessões no servidor.

Testes - Jest & Supertest	
Jest é um framework de testes completo e popular no ecossistema JS. Supertest facilita a realização de testes de integração em endpoints HTTP.

3. 1. Estratégia para Simulação de Sistemas Externos

Sistema Legado de Alertas:

Necessidade: Para desenvolver e testar o Requisito Funcional RF07 de forma isolada, o sistema legado externo será simulado ("mockado").

Implementação da Simulação: A simulação será realizada através de um script independente (Sistema_Legado.js). Este script utilizará Node.js e Express para criar um servidor web mínimo que representará o sistema legado.

Comportamento da Simulação:

º O servidor simulado rodará em uma porta de rede separada da API principal (ex: porta 3001).

º Ele exporá um único endpoint: POST /api/alerts.

Sua única função será receber os dados de alerta enviados pela API principal, exibi-los no console/terminal (console.log) para verificação visual e retornar uma resposta de sucesso (HTTP 200 OK).

4. Modelo de Dados (Entidades e Relacionamentos)

O sistema terá duas entidades principais: Sensor e Leitura.

Entidade: Sensor

id: UUID (Chave Primária)

tipo: String (ex: "TEMPERATURA", "VIBRAÇÃO")

local: String (ex: "Motor Bloco A", "Esteira 2")

dataCriacao: Timestamp

ultimaAtualizacao: Timestamp

Entidade: Leitura

id: UUID (Chave Primária)

temperatura: Float (pode ser nulo se não for um sensor de temperatura)

vibracao: Float (pode ser nulo se não for um sensor de vibração)

dataMedicao: Timestamp (data e hora da leitura)

sensorId:  UUID (Chave Estrangeira, referência ao Sensor.id)

dataRecebido: Timestamp

Relacionamento: Um Sensor pode ter muitas leituras (Um para muitos).

5. Desenho da API (Endpoints)

Autenticação
Endpoint: POST /auth/token

Descrição: Gera um token de acesso para um dispositivo.

Autenticação: N/A

Request Body:

JSON

h{
  "apiKey": "some-key-for-the-device",
  "apiSecret": "some-secret-for-the-device"
}
Response (200 OK):

JSON

{
  "token": "ey...",
  "expiresIn": "8h"
}
Sensores
Endpoint: POST /sensors

Descrição: Cadastra um novo sensor.

Autenticação: Obrigatória (JWT)

Request Body:

JSON

{
  "type": "TEMPERATURE",
  "location": "Prensa Hidráulica 1"
}
Response (201 Created):

JSON

{
  "id": "uuid-gerado-aqui",
  "type": "TEMPERATURE",
  "location": "Prensa Hidráulica 1",
  "createdAt": "2025-09-18T15:30:00Z"
}
Endpoint: GET /sensors

Descrição: Lista todos os sensores.

Autenticação: Obrigatória (JWT)

Response (200 OK):

JSON

[
  {
    "id": "uuid-1",
    "type": "TEMPERATURE",
    "location": "Prensa Hidráulica 1"
  },
  {
    "id": "uuid-2",
    "type": "VIBRATION",
    "location": "Motor da Esteira 3"
  }
]
Leituras
Endpoint: POST /readings

Descrição: Registra uma nova leitura de um sensor.

Autenticação: Obrigatória (JWT)

Request Body:

JSON

{
  "sensorId": "uuid-do-sensor",
  "timestamp": "2025-09-18T15:32:10Z",
  "temperature": 92.5
}
Response (201 Created):

JSON

{
  "message": "Reading registered successfully"
}
Endpoint: GET /sensors/{id}/readings

Descrição: Retorna o histórico de leituras de um sensor específico.

Autenticação: Obrigatória (JWT)

Response (200 OK):

JSON

[
  {
    "id": "uuid-leitura-1",
    "temperature": 92.5,
    "timestamp": "2025-09-18T15:32:10Z"
  },
  {
    "id": "uuid-leitura-2",
    "temperature": 91.8,
    "timestamp": "2025-09-18T15:31:10Z"
  }
]

