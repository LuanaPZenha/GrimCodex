# 🚀 API Dual Persistence

Uma API RESTful desenvolvida com **Node.js** e **Express**, utilizando **persistência híbrida** com **MongoDB** e **PostgreSQL**, autenticação via **JWT**, práticas de segurança baseadas no **OWASP Top 10**, documentação Swagger, testes de integração e conteinerização com Docker.

---

## 📋 Visão Geral

Este projeto demonstra uma arquitetura com múltiplos bancos de dados, onde cada tipo de recurso é armazenado na tecnologia mais adequada ao seu contexto.

### 🎯 Objetivos

* Utilizar bancos relacionais e não relacionais simultaneamente.
* Implementar autenticação e autorização seguras.
* Aplicar boas práticas de segurança web.
* Disponibilizar documentação interativa da API.
* Automatizar o ambiente com Docker.
* Garantir qualidade através de testes de integração.

---

## 🏗️ Arquitetura da Aplicação

| Recurso            | Banco de Dados | Acesso           |
| ------------------ | -------------- | ---------------- |
| 🚗 Carros          | MongoDB        | JWT obrigatório  |
| 🏍️ Motos          | MongoDB        | JWT obrigatório  |
| 👕 Marcas de Roupa | MongoDB        | JWT obrigatório  |
| 👤 Usuários        | PostgreSQL     | JWT + Role Admin |
| 🔐 Autenticação    | PostgreSQL     | Público          |

### Persistência

#### PostgreSQL (SQL)

Responsável por armazenar:

* Usuários
* Credenciais
* Roles e permissões

#### MongoDB (NoSQL)

Responsável por armazenar:

* Carros
* Motos
* Marcas de roupa

Essa separação permite explorar as vantagens de cada modelo de banco de dados.

---

## 🔒 Segurança (OWASP Top 10)

A API implementa diversas camadas de proteção:

### Helmet

Adiciona cabeçalhos HTTP seguros.

```javascript
app.use(helmet());
```

### Rate Limiting

Proteção contra:

* Brute Force
* Flood Requests
* Ataques DoS simples

### Validação de Entrada

Utilização do Express Validator em todos os endpoints para:

* Sanitização de dados
* Validação de formatos
* Prevenção de entradas maliciosas

### Hash de Senhas

Utilização do bcrypt com fator de custo 12.

```javascript
bcrypt.hash(password, 12);
```

### JWT

Autenticação stateless com:

* Expiração configurável
* Assinatura segura
* Middleware de autenticação

### Controle de Acesso

Sistema baseado em roles:

| Role  | Permissões             |
| ----- | ---------------------- |
| user  | Recursos próprios      |
| admin | Gerenciamento completo |

### CORS

Configuração personalizada para controle de origens permitidas.

### Limite de Payload

Corpo JSON limitado a:

```txt
10 KB
```

Reduzindo superfícies de ataque e abuso.

---

## 📂 Estrutura do Projeto

```bash
src/
├── config/
├── controllers/
├── middlewares/
├── models/
│   ├── postgres/
│   └── mongo/
├── routes/
├── services/
├── validators/
├── docs/
└── tests/

docker/
├── postgres/
└── mongo/

swagger/
```

---

## ⚙️ Tecnologias Utilizadas

### Backend

* Node.js
* Express.js

### Banco de Dados

* PostgreSQL
* MongoDB

### Segurança

* JWT
* Bcrypt
* Helmet
* Express Rate Limit
* Express Validator

### Documentação

* Swagger UI
* OpenAPI

### Testes

* Jest
* Supertest

### DevOps

* Docker
* Docker Compose

---

## 🚀 Executando com Docker

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git

cd seu-repositorio
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Subir os containers

```bash
docker compose up --build -d
```

### 4. Verificar saúde da aplicação

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## 🌐 Acessos

### API

```txt
http://localhost:3000
```

### Swagger

```txt
http://localhost:3000/api-docs
```

### Painel de Testes

```txt
http://localhost:3000
```

---

## 👤 Usuário Administrador Padrão

```txt
Email: admin@example.com
Senha: Admin1234
```

⚠️ Recomenda-se alterar a senha imediatamente após o primeiro acesso.

---

## 🔑 Fluxo de Autenticação

### Registrar usuário

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

Resposta:

```json
{
  "token": "jwt-token"
}
```

### Perfil do usuário

```http
GET /api/auth/profile
```

Header:

```http
Authorization: Bearer <token>
```

---

## 📚 Endpoints

### 🔐 Autenticação

| Método | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

---

### 👤 Usuários (Admin)

| Método | Endpoint       |
| ------ | -------------- |
| GET    | /api/users     |
| GET    | /api/users/:id |
| POST   | /api/users     |
| PUT    | /api/users/:id |
| DELETE | /api/users/:id |

---

### 🚗 Carros

| Método | Endpoint      |
| ------ | ------------- |
| GET    | /api/cars     |
| GET    | /api/cars/:id |
| POST   | /api/cars     |
| PUT    | /api/cars/:id |
| DELETE | /api/cars/:id |

---

### 🏍️ Motos

| Método | Endpoint       |
| ------ | -------------- |
| GET    | /api/motos     |
| GET    | /api/motos/:id |
| POST   | /api/motos     |
| PUT    | /api/motos/:id |
| DELETE | /api/motos/:id |

---

### 👕 Marcas de Roupa

| Método | Endpoint              |
| ------ | --------------------- |
| GET    | /api/marcas-roupa     |
| GET    | /api/marcas-roupa/:id |
| POST   | /api/marcas-roupa     |
| PUT    | /api/marcas-roupa/:id |
| DELETE | /api/marcas-roupa/:id |

---

## 🧪 Testes de Integração

Executar todos os testes:

```bash
docker compose --profile test up --build --abort-on-container-exit test
```

Ou localmente:

```bash
npm test
```

Cobertura:

* Autenticação
* Autorização
* CRUD completo
* Validações
* Fluxos protegidos
* Tratamento de erros

---

## 📈 Monitoramento

Endpoint de Health Check:

```http
GET /health
```

Utilizado por:

* Docker
* Kubernetes
* Load Balancers
* Ferramentas de observabilidade

---

## 🔧 Variáveis de Ambiente

Exemplo:

```env
PORT=3000

JWT_SECRET=your-secret-key

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=appdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

MONGO_URI=mongodb://mongo:27017/appdb
```

---

## 👨‍💻 Autor

Luana Zenha
