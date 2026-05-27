# 🍞 PãoFácil — Backend API

<div align="center">
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" /></a>
  <a href="https://expressjs.com/" target="_blank"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://sequelize.org/" target="_blank"><img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize" /></a>
  <a href="https://neon.tech/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://socket.io/" target="_blank"><img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" /></a>
</div>

<br />

<div align="center">
  <h3>📱 Conheça o aplicativo mobile: <a href="https://github.com/Carloshag/paofacil-frontend" target="_blank">PãoFácil Frontend</a></h3>
</div>

<br />

O **PãoFácil Backend** é a central de inteligência e processamento do ecossistema PãoFácil. Ele fornece uma API REST segura e otimizada, além de conexões WebSocket de baixa latência para sincronização e notificações em tempo real de pedidos de padaria.

Desenvolvido sob o paradigma de robustez, escalabilidade e facilidade de deploy, a API utiliza **PostgreSQL (Neon)** como banco de dados principal e conta com fluxos complexos de regras de negócio.

---

## 📌 Sumário

1. [🌟 Principais Funcionalidades](#-principais-funcionalidades)
2. [🛠️ Tecnologias & Dependências](#️-tecnologias--dependências)
3. [⚙️ Configuração do Ambiente (.env)](#️-configuração-do-ambiente-env)
4. [🚀 Instalação e Execução](#-instalação-e-execução)
5. [🗄️ Banco de Dados & Seeding](#️-banco-de-dados--seeding)
6. [📂 Estrutura de Diretórios](#-estrutura-de-diretórios)
7. [✉️ Integrações Avançadas](#️-integrações-avançadas)
8. [☁️ Deploy no Render/Nuvem](#️-deploy-no-rendernuvem)

---

## 🌟 Principais Funcionalidades

- 🔐 **Autenticação & Segurança**: Fluxo robusto com JWT (JSON Web Tokens) e criptografia de senhas via `bcrypt`.
- 🍞 **Catálogo Dinâmico de Produtos**: Gerenciamento completo de estoque e produtos da padaria com upload de imagens (via `multer`).
- 🛒 **Motor de Pedidos**: Regras avançadas para adição ao carrinho, cálculo automático de fretes e distância física.
- 🔄 **Atualizações em Tempo Real**: WebSocket bidirecional para atualização de status dos pedidos em tempo real (Painel Admin $\leftrightarrow$ Cliente).
- 📍 **Geolocalização Inteligente**: Cálculo de rotas e endereços integrado à API do Google Maps.
- 🔔 **Notificações Push & E-mails**: Envio automático de e-mails para recuperação de senha (via `nodemailer`) e push notifications (via `expo-server-sdk`).

---

## 🛠️ Tecnologias & Dependências

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js (REST API com suporte a middlewares)
* **ORM:** Sequelize (Interface flexível para manipulação SQL)
* **Validação de Dados:** Zod (Esquemas estritos contra payloads inválidos)
* **Comunicação Realtime:** Socket.io (WebSocket nativo)
* **Banco de Dados:** PostgreSQL hospedado no Neon (Serviço de banco de dados serverless rápido e seguro)

---

## ⚙️ Configuração do Ambiente (.env)

Para rodar a API localmente ou em produção, configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do diretório `paofacil-backend` baseando-se no arquivo `.env.example`:

```env
# Configurações do Servidor
PORT=3000

# Banco de Dados (Neon PostgreSQL)
DATABASE_URL=postgresql://usuario:senha@host:porta/banco?sslmode=require

# Segurança
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Integração de E-mails (Exemplo com Resend)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_USER=resend
EMAIL_PASS=re_suachaveresendaqui
EMAIL_SENDER="Equipe PãoFácil" <onboarding@resend.dev>

# Integração de E-mails (Fallback Simples - Gmail)
# EMAIL_USER=seu_email@gmail.com
# EMAIL_PASS=sua_senha_de_aplicativo_aqui
# EMAIL_SENDER="Equipe PãoFácil" <seu_email@gmail.com>

# APIs Externas
GOOGLE_MAPS_API_KEY=sua_chave_do_google_maps_aqui
```

---

## 🚀 Instalação e Execução

Siga os passos abaixo no seu terminal para colocar a API no ar:

### 1. Clonar e Acessar o Diretório
```bash
cd paofacil-backend
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Rodar em Modo de Desenvolvimento (Hot-reload)
Este comando inicia o servidor usando o `nodemon`, reiniciando automaticamente a cada alteração no código.
```bash
npm run dev
```

### 4. Rodar em Ambiente de Produção
Inicia a execução otimizada e nativa pelo Node.js.
```bash
npm start
```

O servidor informará quando estiver ativo:
```text
[Database] Conexão com o PostgreSQL (Neon) estabelecida com sucesso!
[Server] Servidor rodando com sucesso na porta 3000
```

---

## 🗄️ Banco de Dados & Seeding

O PãoFácil conta com um script automático de migração e carga de dados inicial (Seed). Ele popula a base de dados com categorias e produtos de exemplo (pães franceses, bolos, cafés, etc.).

Para limpar/criar as tabelas no seu banco PostgreSQL e aplicar os dados iniciais de teste:
```bash
npm run seed
```

> [!IMPORTANT]
> Certifique-se de que a variável `DATABASE_URL` contendo a string de conexão do Neon está devidamente preenchida no arquivo `.env` para que o Sequelize consiga sincronizar as tabelas no seu banco de dados na nuvem.

---

## 📂 Estrutura de Diretórios

```text
paofacil-backend/
├── config/             # Configurações do Sequelize (Database) e conexões
├── controllers/        # Controladores com regras de negócio das rotas
├── middlewares/        # Middlewares de validação, segurança e autenticação JWT
├── models/             # Modelos das tabelas do banco de dados (User, Product, Order, etc.)
├── routes/             # Definição dos endpoints HTTP divididos por contexto
├── scripts/            # Scripts utilitários (ex: carga de dados initial - seed.js)
├── validations/        # Validações estruturadas com Zod
├── uploads/            # Armazenamento local de imagens de produtos
├── app.js              # Inicialização básica do Express e middlewares globais
├── server.js           # Ponto de partida do servidor HTTP
├── socket.js           # Configuração e listeners do WebSocket (Socket.io)
├── .env.example        # Arquivo de referência para configurações locais
└── package.json        # Dependências e scripts npm
```

---

## ✉️ Integrações Avançadas

### Realtime (Socket.io)
A conexão Socket.io é utilizada no backend para criar salas de monitoramento de pedidos.
- Quando o usuário faz um pedido, um evento de socket é emitido aos administradores.
- Quando o administrador altera o status de um pedido no painel (`Aceito`, `A caminho`, `Entregue`), o backend emite o evento para a sala do respectivo cliente, gerando atualizações visuais instantâneas sem refresh.

### Envio de E-mails
Configurado nativamente para recuperar senhas enviando um link temporário com token seguro. Se o host SMTP não estiver configurado, ele tentará usar as credenciais de SMTP configuradas.

---

## ☁️ Deploy no Render/Nuvem

Este repositório está configurado e pronto para deploy automático no **Render** utilizando o arquivo de infraestrutura `render.yaml`. Ao criar uma conta e vincular o repositório, o Render provisionará:
1. Um Web Service para hospedar esta API em Node.js.
2. Variáveis de ambiente configuradas no painel.

---

Feito com paixão 🍞 e focado na facilidade do dia a dia.
