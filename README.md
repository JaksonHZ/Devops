# Tasker — Conteinerização e Implantação no Kubernetes

Aplicação de tarefas (**Next.js + Fastify + PostgreSQL**) empacotada em três
contêineres Docker. Este repositório cobre:

- **T1** — execução local com **Docker Compose**;
- **T2** — implantação em **Kubernetes (Minikube)** com **Helm Chart** e **Ingress**
  (acesso via `http://k8s.local`).

> 📄 Documentação completa do T2 (aplicação, artefatos K8s e roteiro de testes):
> [`docs/documentacao.pdf`](docs/documentacao.pdf) (fonte em
> [`docs/documentacao.md`](docs/documentacao.md)).

## Arquitetura

Apenas o **frontend** é exposto. O navegador fala só com o frontend; chamadas
`/api/*` são proxyadas **no servidor Next.js** para o backend interno, que acessa o
PostgreSQL pelo nome do serviço. Sem CORS, com um único ponto de entrada.

```
                 Ingress (k8s.local)  /  localhost:3000 (compose)
                            │
                            ▼
                  frontend (Next.js :3000)
                            │  rewrite /api/* → backend:3333
                            ▼
                  backend (Fastify :3333)
                            │
                            ▼
                  db (PostgreSQL :5432)  + volume persistente
```

| Componente | Imagem                       | Porta | Exposto |
|------------|------------------------------|:-----:|:-------:|
| frontend   | `jaksonhz/tasker-frontend`   | 3000  | sim     |
| backend    | `jaksonhz/tasker-backend`    | 3333  | não     |
| db         | `postgres:16-alpine`         | 5432  | não     |

---

# Parte 2 — Kubernetes (Minikube) + Helm  *(trabalho T2)*

## Pré-requisitos

Ubuntu/WSL2. Instale Docker, kubectl, Minikube e Helm (o script usa `sudo`):

```bash
bash scripts/install-tools.sh
# reabra o terminal (entrar no grupo docker) ou rode: newgrp docker
```

## Passo a passo

```bash
# 1) Build das imagens e exportação para o Minikube
minikube start --driver=docker
bash scripts/build-images.sh            # build + minikube image load
#   (opcional) publicar no Docker Hub:  docker login && bash scripts/build-images.sh --push

# 2) Deploy (Minikube + addon ingress + Helm)
bash scripts/deploy.sh

# 3) Apontar o host para o cluster (uma vez)
echo "$(minikube ip) k8s.local" | sudo tee -a /etc/hosts

# 4) Acessar
#    Navegador/curl:  http://k8s.local
curl -I http://k8s.local
```

Instalação manual do chart (equivalente ao passo 2, sem o script):

```bash
minikube addons enable ingress
helm upgrade --install tasker ./tasker-chart
```

Ou aplicando os manifestos crus (sem Helm):

```bash
kubectl apply -R -f k8s/
```

## Helm Chart

`tasker-chart/` é um chart **umbrella** com três subcharts:

```
tasker-chart/
├── Chart.yaml            # dependências: db, backend, frontend
├── values.yaml           # valores GLOBAIS (nomes, portas, credenciais, host)
├── templates/ingress.yaml
└── charts/
    ├── db/        # Deployment, Service, Secret, PV, PVC
    ├── backend/   # Deployment (+initContainer), Service, Secret, ConfigMap
    └── frontend/  # Deployment, Service, ConfigMap
```

Artefatos Kubernetes utilizados: **Deployment**, **Service** (ClusterIP),
**Secret**, **ConfigMap**, **PersistentVolume/PersistentVolumeClaim** e **Ingress**.

## Scripts

| Script                      | Função |
|-----------------------------|--------|
| `scripts/up.sh`             | **Sobe tudo** (Minikube + build/load + deploy) — p/ quem já tem as ferramentas |
| `scripts/install-tools.sh`  | Instala Docker, kubectl, Minikube e Helm |
| `scripts/build-images.sh`   | Build das imagens + `minikube image load` (+ `--push` p/ Docker Hub) |
| `scripts/deploy.sh`         | Minikube + addon ingress + `helm upgrade --install` |
| `scripts/undeploy.sh`       | `helm uninstall` (`--purge` apaga PV/PVC) |
| `scripts/smoke-test.sh`     | Testa a app publicada (frontend → /api → backend → banco) |
| `scripts/port-forward.sh`   | Acesso pelo navegador do Windows (WSL2) via port-forward |
| `docs/gerar-pdf.sh`         | Gera `docs/documentacao.pdf` a partir do HTML |

## Verificação rápida

```bash
kubectl get pods,svc,ingress,secret,configmap,pv,pvc
curl -I http://k8s.local            # 200 OK (frontend via Ingress)
curl -i http://k8s.local/api/user   # resposta do backend (via proxy /api)
```

Roteiro de testes completo (funcional + persistência) na seção 6 de
[`docs/documentacao.md`](docs/documentacao.md).

---

# Parte 1 — Docker Compose  *(trabalho T1)*

## Como rodar

```bash
cp .env.example .env        # ajuste se quiser
docker compose up --build   # ou: docker compose up -d --build
```

- Frontend: <http://localhost:3000>
- Backend: **não acessível do host** — apenas via proxy `/api/*`
  (ex.: <http://localhost:3000/api/user>).

As migrações do Prisma rodam automaticamente no start do backend
(`prisma migrate deploy`).

## Comandos úteis (compose)

```bash
docker compose ps              # status dos contêineres
docker compose logs -f         # logs de todos
docker compose down            # parar e remover
docker compose down -v         # também remove o volume (apaga dados do DB)
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

- `DATABASE_URL` usa o host `db` (nome do serviço no Compose).
- `BACKEND_URL=http://backend:3333` é embutido na imagem do frontend (build-arg) e
  consumido pelo rewrite do Next. No Kubernetes esse valor é
  `http://tasker-backend:3333`.

---

## Estrutura do repositório

```
.
├── compose.yml                # Docker Compose (T1)
├── .env / .env.example
├── tasker-backend/            # API Fastify + Prisma (Dockerfile)
├── tasker-frontend/           # Next.js (Dockerfile, proxy /api)
├── tasker-chart/              # Helm Chart umbrella (T2)
├── k8s/                       # Manifestos K8s crus (T2)
├── scripts/                   # install / build / deploy / undeploy
└── docs/                      # documentacao.md/.html/.pdf + gerar-pdf.sh
```

## Troubleshooting

- **`k8s.local` não abre**: confirme a linha no `/etc/hosts`
  (`<minikube ip> k8s.local`) e que o addon ingress está `enabled`
  (`minikube addons list`). No WSL, se o navegador do Windows não abrir, rode
  `minikube tunnel` em outro terminal.
- **Pod do backend reiniciando**: ele espera o banco (`initContainer wait-for-db`);
  verifique `kubectl logs deploy/tasker-db`.
- **Imagem não encontrada no Minikube**: rode `bash scripts/build-images.sh`
  (as imagens usam `pullPolicy: IfNotPresent`).
- **Compose — porta 3000 em uso**: altere `FRONTEND_PORT` no `.env`.
- **Reset total do cluster**: `minikube delete && bash scripts/deploy.sh`.
