#!/usr/bin/env bash
# =============================================================================
# Sobe o cluster Minikube, habilita o Ingress e instala a aplicação via Helm.
#
# Uso:
#   bash scripts/deploy.sh
#
# Variáveis (opcionais):
#   RELEASE  nome do release Helm   (padrão: tasker)
#   HOST     host do Ingress        (padrão: k8s.local)
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE="${RELEASE:-tasker}"
HOST="${HOST:-k8s.local}"
CHART="$ROOT/tasker-chart"

log() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

# 1) Cluster Minikube
if ! minikube status >/dev/null 2>&1; then
  log "Iniciando o Minikube (driver docker)..."
  minikube start --driver=docker
else
  log "Minikube já está em execução."
fi

# 2) Addon de Ingress (controlador NGINX)
log "Habilitando o addon de ingress..."
minikube addons enable ingress

# 2.1) Espera o controlador E o webhook de admissão ficarem prontos, senão o
#      "validate.nginx.ingress" recusa a criação do Ingress (connection refused).
log "Aguardando o controlador de Ingress (nginx) ficar pronto..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=180s || true

log "Aguardando o endpoint do webhook de admissão responder..."
for _ in $(seq 1 30); do
  ip=$(kubectl get endpoints ingress-nginx-controller-admission \
        -n ingress-nginx -o jsonpath='{.subsets[0].addresses[0].ip}' 2>/dev/null || true)
  [ -n "${ip:-}" ] && break
  sleep 2
done

# 3) Instala/atualiza o chart — com retry, pois o webhook pode demorar a aceitar conexões
log "Instalando/atualizando o release Helm '$RELEASE'..."
for attempt in 1 2 3 4 5; do
  if helm upgrade --install "$RELEASE" "$CHART"; then
    break
  fi
  if [ "$attempt" -lt 5 ]; then
    log "Tentativa $attempt falhou (provável corrida do webhook de ingress). Aguardando 10s e tentando de novo..."
    sleep 10
  else
    log "Falha ao instalar o release após 5 tentativas."; exit 1
  fi
done

# 4) Aguarda os Deployments
log "Aguardando os Deployments ficarem prontos..."
kubectl rollout status deployment/tasker-db       --timeout=180s || true
kubectl rollout status deployment/tasker-backend  --timeout=180s || true
kubectl rollout status deployment/tasker-frontend --timeout=180s || true

log "Estado atual:"
kubectl get pods,svc,ingress

# 5) Instruções de acesso
IP="$(minikube ip 2>/dev/null || echo '<minikube-ip>')"
cat <<EOF

================== ACESSO À APLICAÇÃO ==================
1) Adicione (uma única vez) a linha abaixo ao /etc/hosts:

       $IP   $HOST

   Atalho:  echo "$IP $HOST" | sudo tee -a /etc/hosts

2) Acesse:  http://$HOST

Observações (WSL2 + driver docker):
- Dentro do WSL:  curl http://$HOST   (deve responder o HTML do frontend)
- Se o navegador do Windows não abrir, rode em outro terminal:
       minikube tunnel
  e use  http://$HOST  (mapeado para 127.0.0.1 via tunnel).
=======================================================
EOF
