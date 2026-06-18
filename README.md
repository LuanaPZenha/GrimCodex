# Grim Codex — Guia Completo de Diablo IV

Aplicação web full stack para jogadores de **Diablo IV**: grimório de conquistas, guias de montarias e pets, fórum com chat ao vivo, perfis de jogadores e painel administrativo. Interface temática sombria inspirada no universo do jogo, com autenticação JWT e persistência híbrida (PostgreSQL + MongoDB).

| Repositório | URL |
|-------------|-----|
| **Frontend** | [github.com/LuanaPZenha/GrimCodex](https://github.com/LuanaPZenha/GrimCodex) |
| **Backend** | [github.com/LuanaPZenha/api-dual](https://github.com/LuanaPZenha/api-dual) |

---

## Índice

1. [Visão geral](#visão-geral)
2. [O que foi implementado](#o-que-foi-implementado)
3. [Stack tecnológica](#stack-tecnológica)
4. [Arquitetura](#arquitetura)
5. [Conteúdo dos guias](#conteúdo-dos-guias)
6. [Estrutura do frontend](#estrutura-do-frontend)
7. [Estrutura do backend](#estrutura-do-backend)
8. [Como rodar localmente](#como-rodar-localmente)
9. [Deploy no Render](#deploy-no-render)
10. [Variáveis de ambiente](#variáveis-de-ambiente)
11. [API — endpoints principais](#api--endpoints-principais)
12. [Seeds e dados iniciais](#seeds-e-dados-iniciais)
13. [Autenticação e permissões](#autenticação-e-permissões)
14. [Solução de problemas](#solução-de-problemas)
15. [Histórico de desenvolvimento](#histórico-de-desenvolvimento)

---

## Visão geral

O **Grim Codex** nasceu como um guia de conquistas de Diablo IV e evoluiu para uma plataforma completa de acompanhamento de progresso. Cada jogador pode:

- Consultar **45 conquistas** com guias passo a passo, notas e status de progresso
- Explorar **19 montarias** e **9 entradas de pets** (incluindo guia do sistema)
- Participar do **fórum** com categorias temáticas e **chat ao vivo** via WebSocket
- Criar **perfil público** com estatísticas (horas, conquistas, temporadas, chefes)
- Administradores gerenciam usuários pelo painel **Gamers & Críticos**

A identidade visual usa fontes **Cinzel Decorative** e **Cormorant Garamond**, paleta escura vermelho/âmbar, fundo interativo com brasas e cards ornamentados.

---

## O que foi implementado

### Interface e experiência

| Recurso | Descrição |
|---------|-----------|
| **Dashboard** | Cards de navegação com banner ornamentado para cada seção |
| **Fundo interativo** | `DiabloBackground` — brasas, névoa e parallax com o mouse |
| **Sidebar responsiva** | Menu lateral com ícones temáticos; drawer no mobile |
| **Tema Diablo IV** | Emojis por item, categorias coloridas, badges de raridade e status |
| **Modais de guia** | Detalhes completos: como obter, tempo médio, localização |
| **Toasts** | Feedback visual para ações (sucesso, erro) |
| **Ícones de plataforma** | PC, PS5, Xbox, Switch e Multiplataforma |
| **Links @username** | Perfil acessível pelo fórum, chat e sidebar |

### Grimórios (CRUD autenticado)

Três abas independentes, cada uma filtrando por `guideType` na API e no cliente:

| Aba | Rota | Tipo | Quantidade |
|-----|------|------|------------|
| Conquistas & Desafios | `/items` | `CONQUISTA` | 45 |
| Guia de Montarias | `/mounts` | `MONTARIA` | 19 |
| Guia de Pets | `/pets` | `MASCOTE` | 9 |

Cada grimório inclui:

- Filtros por **categoria**, **status** (Na fila / Em progresso / Concluído) e **raridade**
- Modo **Raras+** para itens colecionáveis (Premium, Rara, Épica, Lendária, Mítica)
- Agrupamento por região/tipo quando nenhuma categoria específica está selecionada
- CRUD completo (criar, editar, excluir) para usuários autenticados
- Contador de progresso de caça (`X/Y raros desbloqueados`)

### Sistema de raridades

| Raridade | Emoji | Caça | Uso |
|----------|-------|------|-----|
| Comum | ⚪ | — | Asheara, Sistema de Pets |
| Incomum | 🟢 | — | Itens básicos |
| **Premium** | 💎 | ✓ | Hratli, Alkor, Iris (Loja) |
| Rara | 🔵 | ✓ | Orinocta |
| Épica | 🟣 | ✓ | Natalya, Dorian |
| Lendária | 🟠 | ✓ | Gorgo |
| Mítica | 🔴 | ✓ | Conquistas endgame |

### Fórum e chat

- **Posts** com categorias: Dúvidas, Builds, Endgame, Geral, Conquistas
- **Respostas** encadeadas por post
- **Chat ao vivo** via Socket.IO (mensagens em tempo real)
- Links para perfil do autor em posts, respostas e chat

### Perfis de jogadores

- Listagem pública em `/players`
- Perfil individual em `/players/:username`
- Estatísticas editáveis pelo próprio jogador:
  - Horas jogadas
  - Conquistas concluídas
  - Classe mais usada
  - Temporadas concluídas
  - Chefes derrotados
- Exibição de plataforma, classe favorita e bio

### Autenticação e cadastro

- Login por **username** (não e-mail)
- Cadastro com nome, login, e-mail, senha, plataforma e classe favorita
- Painel de guia visual no registro (`RegisterGuidePanel`)
- JWT com expiração configurável
- Rotas protegidas (`ProtectedRoute`) e admin (`AdminRoute`)

### Administração

- CRUD de usuários em `/users` (somente role `admin`)
- Conta admin criada automaticamente no primeiro boot da API

### Infraestrutura e deploy

- **Docker Compose** local: Postgres + MongoDB + backend + frontend
- **Render**: frontend Static Site + backend Web Service (Docker)
- **MongoDB Atlas** para produção (Render não hospeda Mongo)
- Script `gerar-config.cjs` — valida `VITE_API_URL` no build e gera `config.json`
- CORS configurável para múltiplas origens
- Health check em `/health`

---

## Stack tecnológica

### Frontend (`p2-full`)

| Tecnologia | Uso |
|------------|-----|
| React 18 | UI componentizada |
| Vite 6 | Build e dev server |
| Tailwind CSS 3 | Estilização utilitária |
| React Router 6 | Navegação SPA |
| Axios | Cliente HTTP / JWT |
| Socket.IO Client | Chat ao vivo |

### Backend (`api-dual-persistence`)

| Tecnologia | Uso |
|------------|-----|
| Node.js 20 | Runtime |
| Express 4 | API REST |
| MongoDB + Mongoose | Itens, posts, chat (NoSQL) |
| PostgreSQL + Sequelize | Usuários (SQL) |
| JWT + bcrypt | Autenticação |
| Socket.IO | WebSocket do chat |
| Helmet + Rate Limit | Segurança OWASP |
| Swagger | Documentação `/api-docs` |
| Docker | Conteinerização |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Navegador (React SPA)                     │
│  AuthContext │ ToastContext │ Axios + Socket.IO               │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Express (porta 8080)                  │
│  /api/auth  /api/items  /api/posts  /api/chat  /api/profiles│
└──────────────┬─────────────────────────────┬────────────────┘
               │                             │
               ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │   PostgreSQL    │          │     MongoDB     │
     │  users, roles   │          │ items, posts,   │
     │  stats, perfis  │          │ chat, replies   │
     └─────────────────┘          └─────────────────┘
```

### Tipos de guia (`guideType`)

Todos os itens do grimório ficam na coleção `items` do MongoDB, diferenciados por:

| `guideType` | Descrição |
|-------------|-----------|
| `CONQUISTA` | Conquistas e desafios de Diablo IV |
| `MONTARIA` | Montarias e troféus de estábulo |
| `MASCOTE` | Pets cosméticos |

---

## Conteúdo dos guias

### Conquistas (45)

Organizadas por categoria:

- **Campanha** — Emancipation, Hatred Subdued, Hatred Banished
- **Exploração** — Estuar Sightseer, Nahantu Sightseer, Skovos Sojourner
- **Classes** — Hammer Down, Army of Bones, Master of the Elements, etc.
- **Endgame** — Dedicated Protector, Living Nightmares, Tormented Massacre, etc.
- **PvP** — Master Combatant
- **DLC VoH** — Wildland Warrior, Kurast Cleanser, Devout Champion, etc.
- **DLC LoH** — Skovos Slayer, Wholly Horadric, Echoing Elites, etc.

Cada conquista inclui: descrição, guia markdown, como fazer, tempo médio, localização, nota (1–5) e raridade automática.

### Montarias (19)

- Gillian's Steed (campanha)
- Stable Master & Renown (sistema)
- Troféus regionais (Fractured Peaks, Scosglen, Dry Steppes, Kehjistan, Hawezar, Nahantu, Skovos)
- Cosméticas premium (Midnight Steed, Born in Darkness, Temptation's Ride, etc.)
- DLC VoH / LoH (Nahantu Mule, Kurast Riding Steed, Skovos Riding Steed)

### Pets (9 entradas — 8 pets + guia do sistema)

| Pet | Tipo | Como obter | Raridade |
|-----|------|------------|----------|
| **Sistema de Pets** | — | Missão *Fé Perdida* em Kyovashad | Comum |
| **Asheara** | 🐕 Cão | Grátis na missão Fé Perdida | Comum |
| **Hratli** | 🐕 Cão | Loja do jogo | Premium |
| **Alkor** | 🐕 Cão | Loja do jogo | Premium |
| **Natalya** | 🐈 Tigresa | Passe de Batalha | Épica |
| **Orinocta** | 🦉 Coruja | Eventos especiais | Rara |
| **Iris** | 🐈 Gato | Loja do jogo | Premium |
| **Dorian** | 🦊 Raposa | Pacotes promocionais | Épica |
| **Gorgo** | 🐕 Mastim Infernal | Conteúdo sazonal | Lendária |

**Função dos pets:** companheiros cosméticos que **coletam ouro e materiais automaticamente** — não participam do combate.

---

## Estrutura do frontend

```
p2-full/
├── public/
│   ├── config.example.json      # Exemplo de config runtime
│   └── assets/                  # Imagens (banner, hero, ícones)
├── scripts/
│   ├── gerar-config.cjs         # Gera config.json no build (Render)
│   └── strip-coauthor.cjs       # Utilitário git
├── src/
│   ├── App.jsx                  # Rotas principais
│   ├── main.jsx                 # Bootstrap + loadAppConfig
│   ├── index.css                # Tailwind + fontes Diablo
│   ├── components/
│   │   ├── DiabloBackground.jsx # Fundo animado
│   │   ├── Sidebar.jsx          # Navegação lateral
│   │   ├── ItemCard.jsx         # Card de grimório
│   │   ├── ItemGuideModal.jsx   # Modal de guia (conquista/montaria/pet)
│   │   ├── ForumChat.jsx        # Chat Socket.IO
│   │   ├── PlatformIcon.jsx     # Ícones de plataforma
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx      # JWT + sessão
│   │   └── ToastContext.jsx     # Notificações
│   ├── pages/
│   │   ├── HomePage.jsx         # Dashboard com cards
│   │   ├── Items/               # Conquistas
│   │   ├── Mounts/              # Montarias
│   │   ├── Pets/                # Pets
│   │   ├── Forum/               # Fórum + detalhe do post
│   │   ├── Players/             # Listagem + perfil
│   │   ├── Users/               # Admin CRUD
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── services/
│   │   ├── api.js               # Axios + interceptors JWT
│   │   ├── config.js            # VITE_API_URL / config.json
│   │   ├── resources.js         # auth, items, posts, profiles...
│   │   └── socket.js            # Socket.IO client
│   └── utils/
│       ├── diabloTheme.js       # Emojis, raridades, categorias
│       └── normalize.js         # Normalização API ↔ frontend
├── docker-compose.yml           # Stack completa local
├── docker-compose.prod.yml
├── render.yaml                  # Blueprint Render (frontend)
├── Dockerfile
└── .env.example
```

### Rotas da aplicação

| Rota | Página | Acesso |
|------|--------|--------|
| `/login` | Login | Público |
| `/register`, `/cadastro` | Cadastro | Público |
| `/dashboard` | Início | Autenticado |
| `/items` | Conquistas | Autenticado |
| `/mounts` | Montarias | Autenticado |
| `/pets` | Pets | Autenticado |
| `/forum` | Fórum | Autenticado |
| `/forum/:id` | Detalhe do post | Autenticado |
| `/players` | Jogadores | Autenticado |
| `/players/:username` | Perfil | Autenticado |
| `/users` | Admin usuários | Admin |

---

## Estrutura do backend

```
api-dual-persistence/
├── src/
│   ├── app.js                   # Express + rotas
│   ├── server.js                # Boot + seeds
│   ├── config/                  # DB, CORS, Swagger
│   ├── controllers/             # auth, items, posts, chat, profiles
│   ├── models/
│   │   ├── User.js              # PostgreSQL
│   │   ├── Item.js              # MongoDB — grimório
│   │   ├── Post.js / Reply.js   # MongoDB — fórum
│   │   └── ChatMessage.js       # MongoDB — chat
│   ├── data/
│   │   ├── diabloAchievements.js
│   │   ├── diabloMounts.js
│   │   ├── diabloPets.js
│   │   ├── categories.js        # GUIDE_TYPES, categorias
│   │   └── rarity.js            # COMUM … MITICA + PREMIUM
│   ├── seed/
│   │   ├── achievementsSeed.js
│   │   ├── mountsSeed.js
│   │   └── petsSeed.js
│   ├── scripts/
│   │   └── runSeeds.js          # npm run seed / seed:pets
│   ├── socket/
│   │   └── chatSocket.js
│   └── migrations/
│       └── patchUsers.js        # username, stats, platform
├── docker-compose.yml
├── Dockerfile
└── render.yaml                  # Blueprint Render (API + Postgres)
```

---

## Como rodar localmente

### Pré-requisitos

- [Docker Desktop](https://docs.docker.com/get-docker/) com Docker Compose
- Repositório backend clonado em `../api-dual-persistence` (mesmo nível deste projeto)

### Passo a passo

```bash
# 1. Clone os repositórios lado a lado
#    p2-full/          ← este repo (frontend)
#    api-dual-persistence/  ← backend

# 2. Configure variáveis (opcional — o Compose já define defaults)
cp .env.example .env

# 3. Suba toda a stack
docker compose up --build
```

### URLs locais

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API** | http://localhost:8080/api |
| **Swagger** | http://localhost:8080/api-docs |
| **Health** | http://localhost:8080/health |

### Credenciais padrão

| Campo | Valor |
|-------|-------|
| Login | `admin` |
| E-mail | `admin@example.com` |
| Senha | `Admin1234` |

> No primeiro boot, a API cria o admin automaticamente e executa os seeds (conquistas, montarias, pets).

### Apenas frontend (dev sem Docker)

```bash
npm install
cp .env.example .env
npm run dev
```

Certifique-se de que a API está rodando em `http://localhost:8080/api`.

### Rebuild do backend após mudanças

```bash
docker compose build backend
docker compose up -d backend
docker logs grimcodex-backend --tail 20   # confira "Seed de pets: 9 inseridos"
```

---

## Deploy no Render

### Frontend (Static Site)

1. Conecte o repo **GrimCodex** no Render
2. Tipo: **Static Site**
3. Build: `npm install && npm run build`
4. Publish: `./dist`
5. **Rewrite:** `/*` → `/index.html` (SPA)
6. Variáveis de build:

| Variável | Exemplo |
|----------|---------|
| `VITE_API_URL` | `https://sua-api.onrender.com/api` |
| `VITE_SOCKET_URL` | `https://sua-api.onrender.com` |

> Não use `localhost` em produção. O script `gerar-config.cjs` bloqueia o build no Render se a URL estiver incorreta.

### Backend (Web Service Docker)

1. Conecte o repo **api-dual**
2. Tipo: **Web Service** → Docker
3. Crie **PostgreSQL** no Render (plano free)
4. Crie cluster **MongoDB Atlas** (M0 free):
   - Network Access → `0.0.0.0/0`
   - Copie a connection string `mongodb+srv://...`
5. Variáveis de ambiente:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Injetada pelo Postgres do Render |
| `MONGODB_URI` | Connection string do Atlas |
| `JWT_SECRET` | String longa e aleatória |
| `CORS_ORIGIN` | URL do frontend (ex.: `https://grimcodex.onrender.com`) |
| `ADMIN_EMAIL` | E-mail do admin inicial |
| `ADMIN_PASSWORD` | Senha do admin inicial |

6. Após deploy, **reinicie** o serviço para rodar os seeds
7. Verifique logs: `Seed de pets: 9 inseridos...`

---

## Variáveis de ambiente

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

### Backend (`.env`)

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=sua-chave-secreta-longa
JWT_EXPIRES_IN=1h

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppassword

MONGODB_URI=mongodb://mongo:27017/appdb
CORS_ORIGIN=http://localhost:3000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin1234
```

---

## API — endpoints principais

Todas as rotas abaixo (exceto auth login/register e health) exigem header:

```
Authorization: Bearer <token>
```

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login por username + senha |
| POST | `/api/auth/register` | Cadastro de jogador |
| GET | `/api/auth/profile` | Perfil do usuário logado |

### Grimório (`/api/items`)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/items?guideType=CONQUISTA` | Lista conquistas |
| GET | `/api/items?guideType=MONTARIA` | Lista montarias |
| GET | `/api/items?guideType=MASCOTE` | Lista pets |
| GET | `/api/items/:id` | Detalhe |
| POST | `/api/items` | Criar item |
| PUT | `/api/items/:id` | Atualizar |
| DELETE | `/api/items/:id` | Excluir |

Filtros opcionais: `category`, `rarity`, `rareOnly=true`.

### Fórum

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST | `/api/posts` | Listar / criar posts |
| GET/PUT/DELETE | `/api/posts/:id` | Detalhe / editar / excluir |
| POST | `/api/posts/:id/replies` | Responder |
| DELETE | `/api/posts/:id/replies/:replyId` | Excluir resposta |

### Chat

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/chat/messages?limit=50` | Histórico |
| WebSocket | `/` (Socket.IO) | Mensagens em tempo real |

### Perfis

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/profiles` | Listar jogadores |
| GET | `/api/profiles/me` | Meu perfil |
| GET | `/api/profiles/:username` | Perfil público |
| PUT | `/api/profiles/me/stats` | Atualizar estatísticas |

### Usuários (admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| CRUD | `/api/users` | Gerenciar contas |

---

## Seeds e dados iniciais

Os seeds rodam automaticamente no boot da API (`src/server.js`):

```
Seed de conquistas: 0 inseridas, 45 atualizadas (total 45).
Seed de montarias: 19 inseridas, 0 atualizadas (total 19).
Seed de pets: 9 inseridos, 0 atualizados (total 9).
```

### Executar seeds manualmente

```bash
cd api-dual-persistence
npm install
MONGODB_URI=mongodb://localhost:27017/appdb node src/scripts/runSeeds.js

# Apenas pets:
npm run seed:pets
```

### Via Docker

```bash
docker compose build backend
docker compose up -d backend
docker exec grimcodex-mongo mongosh appdb --eval "db.items.countDocuments({guideType:'MASCOTE'})"
# Esperado: 9
```

---

## Autenticação e permissões

| Role | Permissões |
|------|------------|
| `user` | Grimórios, fórum, chat, perfil próprio |
| `admin` | Tudo acima + CRUD de usuários em `/users` |

O token JWT é armazenado no `localStorage` e injetado automaticamente pelo Axios. Rotas protegidas redirecionam para `/login` se não autenticado.

---

## Solução de problemas

### "Network Error" no login

- Verifique `VITE_API_URL` — deve apontar para a API pública, não `localhost`, em produção
- Confirme que o backend está no ar: `GET /health`
- Verifique `CORS_ORIGIN` no backend inclui a URL do frontend

### Aba de Pets vazia

1. Rebuild do backend: `docker compose build backend && docker compose up -d backend`
2. Confira logs: deve aparecer `Seed de pets: 9 inseridos`
3. Verifique MongoDB: `db.items.countDocuments({guideType:'MASCOTE'})` → `9`
4. Atualize a página com `Ctrl+F5`

### Aba de Pets mostrava conquistas

Corrigido com filtro `guideType=MASCOTE` na API **e** filtro no cliente. Rebuild necessário se o container estiver desatualizado.

### Build falha no Render (frontend)

```
ERRO DE BUILD: defina VITE_API_URL no Render
```

Adicione `VITE_API_URL` e `VITE_SOCKET_URL` nas variáveis de **Build** do Static Site.

### Docker build do backend falha (`npm ci`)

O Dockerfile usa `npm install` (sem `package-lock.json`). Rebuild com `docker compose build --no-cache backend`.

---

## Histórico de desenvolvimento

Resumo das principais entregas do projeto:

| Etapa | Descrição |
|-------|-----------|
| **Base** | Frontend React + Tailwind integrado à API JWT; CRUD de conquistas |
| **Tema Diablo IV** | Fontes, cores, fundo interativo, cards ornamentados |
| **Deploy Render** | Config dinâmica (`config.json`), validação de URL, CORS, Atlas |
| **Montarias** | Nova aba `/mounts` com 19 entradas e seeds |
| **Fórum + Chat** | Posts, respostas, Socket.IO ao vivo |
| **Perfis** | Stats de jogador, listagem pública, links @username |
| **Cadastro** | Login por username, plataforma, classe, guia visual |
| **Pets** | Substituição da aba World Bosses por Guia de Pets |
| **Dados oficiais pets** | Asheara, Hratli, Gorgo, Fé Perdida, raridade Premium |
| **Correções** | Filtro guideType, seed de pets no boot, fix Docker/npm |

### Commits recentes (referência)

**Frontend (GrimCodex)**
- Substitui guia de World Bosses por guia de Pets
- Atualiza guia de pets com dados oficiais do Diablo IV
- Corrige aba de pets exibindo conquistas por falta de filtro

**Backend (api-dual)**
- Adiciona API Grim Codex com guias, fórum, chat e perfis
- Corrige seed de pets e filtro guideType na listagem
- Garante execução do seed de pets na inicialização

---

## Licença

MIT — projeto acadêmico / portfólio.

**Autora:** Luana Zenha — [eng.luanazenha@gmail.com](mailto:eng.luanazenha@gmail.com)

---

<p align="center">
  <em>🔥 Que o Sangue de Lilith guie seus passos em Sanctuary 🔥</em>
</p>
