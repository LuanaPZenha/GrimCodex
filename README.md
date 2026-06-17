# Grim Codex — Diablo IV Achievements Guide

Frontend React + Tailwind CSS integrado a uma API REST com autenticação JWT.

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/)
- Backend da atividade anterior na pasta `./backend` (com `Dockerfile` próprio)

## Estrutura

```
src/
├── context/          # AuthContext (JWT) e ToastContext
├── services/         # Axios + serviços de API
├── routes/           # ProtectedRoute
├── pages/            # Login, Dashboard, Users, Items
└── components/       # UI reutilizável
```

## Subir a aplicação completa

1. Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Coloque o projeto backend na pasta `backend/` (mesmo nível do `docker-compose.yml`).

3. Execute:

```bash
docker compose up --build
```

4. Acesse:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080/api

## Portas e comunicação

| Serviço   | Porta | Descrição                          |
|-----------|-------|------------------------------------|
| frontend  | 3000  | Interface React (Vite dev server)  |
| backend   | 8080  | API REST com JWT                   |

O frontend usa `VITE_API_URL` (padrão: `http://localhost:8080/api`) para chamar a API. Como o Vite injeta essa variável no bundle consumido **pelo navegador**, a URL deve apontar para o host (`localhost`), não para o nome do container Docker.

## Endpoints esperados da API

| Método | Rota              | Descrição              |
|--------|-------------------|------------------------|
| POST   | `/auth/login`     | Login → retorna JWT    |
| GET    | `/auth/me`        | Perfil autenticado     |
| CRUD   | `/users`          | Gamers / Críticos (somente admin) |
| CRUD   | `/items`          | Conquistas / Desafios             |

O token JWT é enviado no header `Authorization: Bearer <token>`.

### Credenciais padrão (backend)

- **Admin:** `admin@example.com` / `Admin1234`
- A rota `/users` exige perfil **admin** no backend.
- A rota `/items` está disponível para qualquer usuário autenticado.

## Apenas frontend (sem backend no Compose)

```bash
docker build -t grimcodex-frontend .
docker run -p 3000:3000 -e VITE_API_URL=http://localhost:8080/api grimcodex-frontend
```

## Desenvolvimento local (opcional)

```bash
npm install
cp .env.example .env
npm run dev
```
