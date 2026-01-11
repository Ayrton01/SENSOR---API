# SENSOR - API 

<p align="justify">
   Este projeto consiste no desenvolvimento de uma API voltada para o monitoramento e gerenciamento de dados provenientes de sensores. O foco é garantir uma estrutura organizada, escalável e segura para lidar com fluxos de informações em tempo real.
</p>

## 📋 Documentação Completa
Para uma compreensão profunda do projeto, consulte:
* **[Planejamento](./Planejamento.md)**
* **[Fases de Desenvolvimento](./Fases_Desenvolvimento.md)**

## ✨ Funcionalidades Planejadas
* [S] Cadastro e Gerenciamento de Sensores (com limites de segurança).
* [S] Coleta e armazenamento de telemetria genérica em tempo real.
* [S] Autenticação e proteção de rotas via JWT.
* [S] Motor de Detecção de Anomalias (Comparação dinâmica de limites).
* [S] Integração com Sistema Legado via Webhooks (Axios).
* [S] Dashboard Industrial Reativo para monitoramento (React.js).

## 🛠️ Tecnologias utilizadas
* **Linguagem/Runtime:** Node.js
* **Framework Web:** Express.js
* **Banco de Dados:** SQLite com Sequelize ORM
* **Segurança:** JSON Web Tokens (JWT)
* **Frontend e Integração:** React.js (via Vite) com Axios
* **Testes:** Jest & Supertest

## ✨ Diferenciais do Projeto
* **Ingestão Genérica:** Suporte a qualquer grandeza industrial via campo `valor`.
* **Segurança Industrial:** Bloqueio de interface (Overlay) e autenticação via JWT.
* **Arquitetura em Camadas:** Separação entre Interface, Core e Infraestrutura.
* **Monitoramento Ativo:** Dashboard reativo com atualização automática a cada 10 segundos.

## Como começar

### Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (Recomendado a partir da versão 18)
* [Git](https://git-scm.com/)

### Mapa do Ecossistema (Portas) 
<p align="justify">
   Para que o ecossistema de monitoramento funcione plenamente, o projeto opera com três serviços simultâneos. Certifique-se de que as seguintes portas estão disponíveis em seu ambiente:
</p>

| Módulo | Porta | Descrição |
| :--- | :---: | :--- |
| **API Principal** | `:3000` | Backend Node.js/Express (Coração do sistema). |
| **Dashboard** | `:5173` | Interface React/Vite (Monitoramento Real-time). |
| **Sistema Legado** | `:3001` | Mock receptor de alertas (Simulação externa). |

<p align="justify">
   Nota: O Dashboard (Frontend) consome dados da API Principal, que por sua vez executa o motor de regras e envia alertas ao Sistema Legado via Webhooks sempre que os limites de segurança operacionais são ultrapassados.
</P>

### Instalação
1. Clone o repositório:
   ```bash
   git clone [https://github.com/Ayrton01/SENSOR---API.git](https://github.com/Ayrton01/SENSOR---API.git)