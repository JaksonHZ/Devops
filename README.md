# Tasker — Aplicação conteinerizada

Aplicação de tarefas (Next.js + Fastify + PostgreSQL) empacotada em três contêineres Docker orquestrados via Docker Compose.

## Arquitetura

Três contêineres na rede default do Compose:

| Serviço    | Imagem / Build            | Porta host | Acesso externo |
|------------|---------------------------|------------|----------------|
| `db`       | `postgres:16-alpine`      | —          | não            |
| `backend`  | build `./tasker-backend`  | —          | não            |
| `frontend` | build `./tasker-frontend` | 3000       | sim            |

Apenas o `frontend` expõe porta ao host. Backend e banco ficam isolados na rede interna do Compose.

Comunicação **sempre pelo nome do serviço** (DNS interno do Docker):

- `backend` → `db` via `postgresql://...@db:5432/tasker`
- `frontend` (Node server) → `backend` via `http://backend:3333`, usado no rewrite do Next (`next.config.mjs`)

O browser fala só com `localhost:3000`. Requisições a `/api/*` batem no servidor Next, que proxia internamente para `backend:3333`. Nenhuma porta do backend é publicada no host.

```
browser ──► localhost:3000 ──► frontend (Next)
                                  │  rewrite /api/* → http://backend:3333/*
                                  ▼
                               backend ──► db:5432
```

## Pré-requisitos

- Docker Engine 24+
- Docker Compose v2 (`docker compose`)

## Como rodar

1. Clone e entre no diretório:

   ```bash
   git clone <url-do-repo>
   cd Devops
   git checkout T1-IMPLEMENTADO
   ```
2. Suba a stack (build + start):

   ```bash
   docker compose up --build
   ```

   Para rodar em background:

   ```bash
   docker compose up -d --build
   ```

3. Acesse:

   - Frontend: <http://localhost:3000>
   - Backend: **não acessível do host** — apenas via proxy do frontend em `/api/*` (ex.: <http://localhost:3000/api/user>).

As migrações do Prisma rodam automaticamente no start do backend (`prisma migrate deploy`).

## Verificando o isolamento

```bash
curl http://localhost:3000/api/user   # responde (proxy via frontend)
curl http://localhost:3333            # falha: porta não publicada
```

De dentro da rede do Compose:

```bash
docker compose exec frontend wget -qO- http://backend:3333/user
docker compose exec backend  sh -c 'nc -zv db 5432'
```

## Comandos úteis

```bash
docker compose ps              # status dos contêineres
docker compose logs -f         # acompanhar logs de todos
docker compose logs -f backend # logs de um serviço
docker compose stop            # parar sem remover
docker compose down            # parar e remover contêineres
docker compose down -v         # também remove volumes (apaga dados do DB)
docker compose up -d --build   # rebuild após alterações
```

Entrar em um contêiner:

```bash
docker compose exec backend sh
docker compose exec db psql -U docker -d tasker
```

## Variáveis de ambiente (.env)

```env
POSTGRES_USER=docker
POSTGRES_PASSWORD=docker
POSTGRES_DB=tasker

DATABASE_URL=postgresql://docker:docker@db:5432/tasker?schema=public
SECRET_JWT=supersecretjwt
BACKEND_PORT=3333

FRONTEND_PORT=3000
```

- `DATABASE_URL` usa o host `db` (nome do serviço).
- `BACKEND_URL=http://backend:3333` é injetado no container do frontend pelo `compose.yml` — consumido pelo rewrite do Next em tempo de request no servidor Node (não vai pro browser).

## Estrutura

```
.
├── compose.yml
├── .env
├── .env.example
├── tasker-backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/, prisma/, ...
└── tasker-frontend/
    ├── Dockerfile
    ├── .dockerignore
    └── app/, components/, ...
```

## Troubleshooting

- **Porta 3000 em uso**: altere `FRONTEND_PORT` no `.env`.
- **Banco não aceita conexão**: verifique healthcheck com `docker compose ps`; backend só inicia após `db (healthy)`.
- **Alteração no schema Prisma**: gere migração localmente com `npx prisma migrate dev` e faça rebuild (`docker compose up -d --build backend`).
- **Reset total**: `docker compose down -v && docker compose up --build`.
