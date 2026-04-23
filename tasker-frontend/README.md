# Tasker Frontend

Interface web do Tasker. Kanban de tarefas com drag-and-drop, autenticação JWT e categorias.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios
- react-hook-form + Zod
- react-beautiful-dnd
- lucide-react (ícones)

## Pré-requisitos

- Node.js 18+
- npm
- Backend rodando em `http://localhost:3333` (ver [tasker-backend](../tasker-backend/README.md))

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar dev

```bash
npm run dev
```

Abrir `http://localhost:3000`.

### 3. Outros scripts

```bash
npm run build     # build produção
npm start         # roda build
npm run lint      # eslint
```

## Config da API

URL do backend está fixa em [lib/axios.ts](lib/axios.ts):

```ts
baseURL: "http://localhost:3333"
```

Para apontar para outro host, editar esse arquivo (ou extrair para env var `NEXT_PUBLIC_API_URL`).

## Estrutura

```
app/            # rotas App Router (pages, layouts)
components/     # componentes UI
context/        # contexts React (auth, etc)
hooks/          # hooks customizados
lib/            # axios, utils
types/          # tipos TS compartilhados
public/         # assets estáticos
```

## Fluxo básico

1. Usuário registra/loga → recebe JWT do backend.
2. Token guardado (cookie/localStorage) e injetado pelo Axios.
3. App busca listas, itens e categorias.
4. Drag-and-drop reordena listas/itens → persiste via `PUT /updateorderlist` e `PUT /changelist`.

## Problemas comuns

- **CORS / rede**: garantir backend em `:3333` e docker do Postgres rodando.
- **401 Unauthorized**: token expirado → endpoint `PATCH /refresh-token` do backend.
- **Porta 3000 ocupada**: `npm run dev -- -p 3001`.
