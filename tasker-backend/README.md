# Tasker Backend

API REST em Fastify + Prisma + PostgreSQL para o app Tasker (gerenciador de tarefas tipo kanban).

## Stack

- Node.js + TypeScript
- Fastify 4
- Prisma 5 (PostgreSQL)
- JWT (`@fastify/jwt`)
- bcrypt
- Zod (validação)
- Docker Compose (Postgres)

## Pré-requisitos

- Node.js 18+
- npm
- Docker + Docker Compose

## Setup

### 1. Subir banco

```bash
docker compose up -d
```

Sobe Postgres em `localhost:5432` (user: `docker`, senha: `docker`, db: `tasker`).

### 2. Variáveis de ambiente

Criar arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/tasker?schema=public"
PORT=3333
SECRET_JWT="troque_por_string_aleatoria_longa"
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

Primeira vez em ambiente novo pode usar `npx prisma migrate dev` para aplicar e criar cliente de uma vez.

### 5. Rodar

```bash
npm run dev       # dev (tsx watch)
npm run build     # build para produção
npm start         # roda build
```

Servidor em `http://localhost:3333`.

## Rotas

### Auth / User (`userRoutes`)
- `POST /register` — cria usuário
- `POST /authenticate` — login, retorna JWT
- `PATCH /refresh-token` — renova token
- `GET /user/list` *(auth)* — lista TODOs do usuário
- `GET /category` *(auth)* — categorias do usuário

### Listas (`listTODORoutes`, todas com JWT)
- `POST /list`
- `PUT /list/:id`
- `PUT /updateorderlist`
- `DELETE /list/:id`

### Itens (`itemTODORoutes`, todas com JWT)
- `POST /item`
- `PUT /item/:id`
- `PUT /changelist`
- `DELETE /item/:id`

### Categorias (`categoryTODORoutes`, todas com JWT)
- `POST /category`
- `PUT /category/:id`
- `DELETE /category/:id`

## Estrutura

```
src/
  app.ts              # fastify app + registros
  server.ts           # bootstrap
  env/                # validação de env (Zod)
  http/
    controllers/      # handlers por recurso
    middlewares/      # verify-jwt
  repositories/       # acesso a dados (Prisma)
  use-cases/          # regras de negócio
  cryptography/       # hash bcrypt
  lib/                # prisma client
prisma/
  schema.prisma
  migrations/
```

## Modelos (Prisma)

- `User` — email único, username, passwordHash
- `ListTODO` — título, done, orderNumber, pertence a User
- `ItemTODO` — título, descrição, done, order, pertence a ListTODO e opcionalmente Category
- `Category` — nome, cor, pertence a User

## Problemas comuns

- **Porta 5432 ocupada**: parar postgres local com `sudo systemctl stop postgresql`.
- **`Invalid environment variables`**: checar `.env` (todas as 3 obrigatórias).
- **Erro de migration**: rodar `npx prisma migrate reset` em ambiente dev.
