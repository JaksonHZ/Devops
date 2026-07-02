# Tasker — Implantação no Kubernetes (Minikube) com Helm

**Disciplina:** DevOps
**Aluno:** Jakson H. Z.
**Aplicação:** Tasker — gerenciador de tarefas (to-do) multiusuário

Este documento descreve **(a)** a aplicação e seus componentes/containers, **(b)** o
roteiro de testes e **(c)** os artefatos Kubernetes utilizados na implantação da
aplicação no Minikube, conforme os critérios de avaliação do trabalho.


# RODAR A APLICAÇÃO

```
bash scripts/up.sh
```

OBS: Se certifique que tenha todas as ferramentas instaladas, caso nao tenha

```
bash scripts/install-tools.sh
```
---

## Sumário

1. [A aplicação e seus componentes](#1-a-aplicação-e-seus-componentes)
2. [Imagens Docker](#2-imagens-docker)
3. [Artefatos Kubernetes](#3-artefatos-kubernetes)
4. [Helm Chart](#4-helm-chart)
5. [Ingress e acesso via k8s.local](#5-ingress-e-acesso-via-k8slocal)
6. [Roteiro de testes](#6-roteiro-de-testes)
7. [Comandos úteis](#7-comandos-úteis)

---

## 1. A aplicação e seus componentes

O **Tasker** é uma aplicação web de lista de tarefas (estilo Trello/To-Do) com
autenticação por JWT. É composta por **três contêineres**:

| Componente   | Tecnologia                     | Porta | Imagem                          | Exposto externamente |
|--------------|--------------------------------|:-----:|---------------------------------|:--------------------:|
| **frontend** | Next.js 14 (React)             | 3000  | `jaksonhz/tasker-frontend`      | **sim** (via Ingress) |
| **backend**  | Fastify + Prisma (Node.js 20)  | 3333  | `jaksonhz/tasker-backend`       | não (apenas interno)  |
| **db**       | PostgreSQL 16                  | 5432  | `postgres:16-alpine`            | não (apenas interno)  |

### Comunicação entre os componentes

O **único ponto de entrada público** é o frontend. O navegador nunca fala
diretamente com o backend: as chamadas de API saem do navegador como caminhos
relativos `/api/*` e são repassadas, **no servidor Next.js**, para o backend
interno (recurso `rewrites` do Next, configurado em `next.config.mjs`). O backend,
por sua vez, acessa o PostgreSQL pelo nome do serviço (`tasker-db`).

```
            Ingress (host: k8s.local)
                     │  http://k8s.local/
                     ▼
        ┌────────────────────────────┐
        │  frontend (Next.js :3000)   │
        │  proxy /api/* ──────────────┼──► backend (Fastify :3333)
        └────────────────────────────┘            │
                                                   ▼
                                       db (PostgreSQL :5432)
                                       + PersistentVolume (dados)
```

Vantagens dessa topologia no Kubernetes:

- **um único Ingress** (só o frontend é publicado);
- **sem CORS** (navegador e API ficam na mesma origem `k8s.local`);
- o backend e o banco permanecem isolados como serviços `ClusterIP`.

### Modelo de dados

O backend usa Prisma sobre PostgreSQL com as entidades **User**, **ListTODO**,
**ItemTODO** e **Category** (diagrama em `tasker-backend/DiagramTasker.png`). As
migrações são aplicadas automaticamente no start do backend
(`npx prisma migrate deploy`).

---

## 2. Imagens Docker

As imagens da aplicação são construídas a partir dos `Dockerfile` de cada serviço
(multi-stage build) e publicadas no **Docker Hub**:

- `docker.io/jaksonhz/tasker-frontend:latest`
- `docker.io/jaksonhz/tasker-backend:latest`
- `docker.io/postgres:16-alpine` (imagem oficial, não precisa de build)

O script `scripts/build-images.sh` automatiza o build e a exportação para o
Minikube (`minikube image load`) e, opcionalmente, o `docker push` para o Docker Hub.

> O backend é construído normalmente. O frontend recebe o build-arg
> `BACKEND_URL=http://tasker-backend:3333`, que embute no proxy `/api` o nome do
> serviço do backend dentro do cluster.

---

## 3. Artefatos Kubernetes

A implantação utiliza os seguintes objetos do Kubernetes:

| Artefato                  | Nome                       | Função |
|---------------------------|----------------------------|--------|
| **Deployment**            | `tasker-db`                | Sobe o contêiner do PostgreSQL |
| **Deployment**            | `tasker-backend`           | Sobe o contêiner da API (com `initContainer` que espera o banco) |
| **Deployment**            | `tasker-frontend`          | Sobe o contêiner do Next.js |
| **Service** (ClusterIP)   | `tasker-db`                | Expõe o banco internamente (5432) |
| **Service** (ClusterIP)   | `tasker-backend`           | Expõe a API internamente (3333) |
| **Service** (ClusterIP)   | `tasker-frontend`          | Expõe o frontend internamente (3000) — alvo do Ingress |
| **Secret**                | `tasker-db-secret`         | Credenciais do PostgreSQL (`POSTGRES_USER/PASSWORD/DB`) |
| **Secret**                | `tasker-backend-secret`    | `DATABASE_URL` e `SECRET_JWT` (dados sensíveis) |
| **ConfigMap**             | `tasker-backend-config`    | Configuração não sensível do backend (`PORT`) |
| **ConfigMap**             | `tasker-frontend-config`   | `BACKEND_URL` (destino do proxy `/api`) |
| **PersistentVolume**      | `tasker-db-pv`             | Volume `hostPath` (1Gi) para os dados do banco |
| **PersistentVolumeClaim** | `tasker-db-pvc`            | Reivindicação do volume, montada no Deployment do banco |
| **Ingress**               | `tasker-ingress`           | Publica a aplicação em `http://k8s.local` |

### Por que cada artefato

- **Deployment** — gerencia os Pods e garante o número desejado de réplicas
  (`replicas: 1`) e o `restart` automático em caso de falha. O backend possui um
  `initContainer` (`wait-for-db`) que aguarda a porta 5432 do banco antes de subir,
  evitando *crash-loop* enquanto o PostgreSQL inicializa.
- **Service (ClusterIP)** — dá um nome DNS estável a cada camada
  (`tasker-db`, `tasker-backend`, `tasker-frontend`), permitindo a comunicação
  interna mesmo quando os Pods são recriados.
- **Secret** — armazena dados sensíveis (senha do banco, `DATABASE_URL`, segredo do
  JWT), injetados nos contêineres via `envFrom: secretRef`.
- **ConfigMap** — guarda configuração não sensível, injetada via `envFrom: configMapRef`.
- **PersistentVolume / PersistentVolumeClaim** — garantem que os dados do
  PostgreSQL **sobrevivam** à recriação do Pod (`storageClassName: manual`,
  `hostPath` no nó do Minikube, `accessMode: ReadWriteOnce`). O Deployment do banco
  usa `strategy: Recreate` para não montar o mesmo volume em dois Pods ao mesmo tempo.
- **Ingress** — roteia o host `k8s.local` para o `Service` do frontend, sendo o
  único objeto que expõe a aplicação para fora do cluster.

Esses artefatos estão disponíveis de duas formas equivalentes:

- **Manifestos crus** em `k8s/` (aplicáveis com `kubectl apply -R -f k8s/`);
- **Helm Chart** em `tasker-chart/` (forma recomendada — ver seção 4).

---

## 4. Helm Chart

O chart `tasker-chart/` é um **chart guarda-chuva (umbrella)** que agrega três
subcharts, um por camada da aplicação:

```
tasker-chart/
├── Chart.yaml              # declara os subcharts (db, backend, frontend)
├── values.yaml             # valores GLOBAIS (nomes, portas, credenciais, host)
├── templates/
│   └── ingress.yaml        # Ingress (k8s.local → frontend)
└── charts/
    ├── db/                 # PostgreSQL: Deployment, Service, Secret, PV, PVC
    ├── backend/            # API: Deployment (+initContainer), Service, Secret, ConfigMap
    └── frontend/           # Next.js: Deployment, Service, ConfigMap
```

Os valores compartilhados ficam em `values.yaml` sob a chave `global` (acessível
por todos os subcharts). Trecho principal:

```yaml
global:
  ingress:
    host: k8s.local
    className: nginx
  db:
    name: tasker-db
    user: docker
    password: docker
    database: tasker
    port: 5432
  backend:
    name: tasker-backend
    port: 3333
    jwtSecret: supersecretjwt
  frontend:
    name: tasker-frontend
    port: 3000
```

Cada subcharts define ainda sua própria imagem e limites de recurso em
`charts/<nome>/values.yaml`. Instalação:

```bash
helm upgrade --install tasker ./tasker-chart
```

---

## 5. Ingress e acesso via k8s.local

O Ingress publica **um único host** apontando para o frontend:

```yaml
spec:
  ingressClassName: nginx
  rules:
    - host: k8s.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: tasker-frontend
                port:
                  number: 3000
```

No Minikube, o controlador NGINX é habilitado com `minikube addons enable ingress`.
Para o host `k8s.local` resolver para o cluster, adiciona-se ao `/etc/hosts`:

```
<minikube ip>   k8s.local
```

A partir daí, `http://k8s.local` serve o frontend; as chamadas `/api/*` são
proxyadas internamente ao backend.

---

## 6. Roteiro de testes

### 6.1 Pré-requisitos (instalação das ferramentas)

```bash
bash scripts/install-tools.sh     # Docker, kubectl, Minikube e Helm (usa sudo)
# feche e reabra o terminal (entrar no grupo docker) ou rode: newgrp docker
```

### 6.2 Build e exportação das imagens

```bash
minikube start --driver=docker        # garante que o Minikube esteja no ar
bash scripts/build-images.sh          # build + minikube image load
# (opcional) enviar ao Docker Hub:  docker login && bash scripts/build-images.sh --push
```

### 6.3 Implantação

```bash
bash scripts/deploy.sh                # minikube + addon ingress + helm upgrade --install
```

Em seguida, configure o host (mostrado ao final do deploy):

```bash
echo "$(minikube ip) k8s.local" | sudo tee -a /etc/hosts
```

### 6.4 Verificação da infraestrutura

| Passo | Comando | Resultado esperado |
|------|---------|--------------------|
| Pods no ar | `kubectl get pods` | `tasker-db`, `tasker-backend`, `tasker-frontend` em `Running` (`1/1`) |
| Services | `kubectl get svc` | três `ClusterIP`: `tasker-db`, `tasker-backend`, `tasker-frontend` |
| Ingress | `kubectl get ingress` | `tasker-ingress` com host `k8s.local` |
| Secret/ConfigMap | `kubectl get secret,configmap` | `tasker-db-secret`, `tasker-backend-secret`, `tasker-backend-config`, `tasker-frontend-config` |
| Volume | `kubectl get pv,pvc` | `tasker-db-pv`/`tasker-db-pvc` com status `Bound` |

### 6.5 Teste de conectividade (rede)

```bash
# Frontend servindo HTML pelo Ingress:
curl -I http://k8s.local                                    # HTTP/1.1 200 OK

# Backend via proxy /api — rota protegida (sem token retorna 401):
curl -s -o /dev/null -w "%{http_code}\n" \
     http://k8s.local/api/user/list                         # 401
```

Há ainda um **smoke test** automatizado que exercita frontend → proxy → backend →
banco (conectividade + registro + login com JWT):

```bash
bash scripts/smoke-test.sh
# Esperado: 200 (/) · 401 (/api/user/list) · 201|409 (registro) · 200 + access_token (login)
```

### 6.6 Teste funcional (interface)

1. Abra `http://k8s.local` no navegador.
2. Vá em **Registrar**, crie uma conta (e-mail, usuário, senha).
3. Faça **login**.
4. Crie uma **lista** e adicione um ou mais **itens/tarefas**.
5. Marque uma tarefa como concluída e recarregue a página.

**Resultado esperado:** a navegação funciona, o cadastro/login retornam tokens e os
dados criados permanecem após o reload (persistidos no PostgreSQL).

### 6.7 Teste de persistência (PV/PVC)

```bash
# Apaga o Pod do banco; o Deployment recria e o PVC remonta o mesmo volume:
kubectl delete pod -l app=tasker-db
kubectl rollout status deployment/tasker-db
```

**Resultado esperado:** após o Pod voltar, os dados criados no teste 6.6 continuam
disponíveis na aplicação (o volume persistente preservou o banco).

### 6.8 Inspeção do banco (opcional)

```bash
kubectl exec -it deploy/tasker-db -- psql -U docker -d tasker -c '\dt'
# deve listar as tabelas User, ListTODO, ItemTODO, Category
```

---

## 7. Comandos úteis

```bash
# Logs
kubectl logs deploy/tasker-backend
kubectl logs deploy/tasker-frontend

# Descrever um objeto
kubectl describe ingress tasker-ingress

# Renderizar o chart sem instalar (debug)
helm template tasker ./tasker-chart | less
helm lint ./tasker-chart

# Remover a aplicação
bash scripts/undeploy.sh            # ou: helm uninstall tasker
bash scripts/undeploy.sh --purge    # também apaga os dados (PV/PVC)

# Parar/zerar o cluster
minikube stop
minikube delete
```
