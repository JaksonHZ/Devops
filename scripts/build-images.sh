#!/usr/bin/env bash
# =============================================================================
# Faz o build das imagens Docker do Tasker e as carrega no Minikube
# (minikube image load). Opcionalmente envia para o Docker Hub.
#
# Uso:
#   bash scripts/build-images.sh            # build + load no Minikube
#   bash scripts/build-images.sh --push     # também faz push p/ o Docker Hub
#   bash scripts/build-images.sh --no-load  # só build (sem carregar no Minikube)
#
# Variáveis (opcionais):
#   DOCKER_USER  usuário do Docker Hub        (padrão: jaksonhz)
#   TAG          tag das imagens              (padrão: latest)
#   BACKEND_URL  URL interna do backend p/ o proxy do frontend
#                                             (padrão: http://tasker-backend:3333)
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCKER_USER="${DOCKER_USER:-jaksonhz}"
TAG="${TAG:-latest}"
BACKEND_URL="${BACKEND_URL:-http://tasker-backend:3333}"
BACKEND_IMAGE="$DOCKER_USER/tasker-backend:$TAG"
FRONTEND_IMAGE="$DOCKER_USER/tasker-frontend:$TAG"

PUSH=0
LOAD=1
for a in "$@"; do
  case "$a" in
    --push)    PUSH=1 ;;
    --no-load) LOAD=0 ;;
    *) echo "flag desconhecida: $a"; exit 1 ;;
  esac
done

log() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

log "Build do backend  -> $BACKEND_IMAGE"
docker build -t "$BACKEND_IMAGE" "$ROOT/tasker-backend"

log "Build do frontend -> $FRONTEND_IMAGE  (BACKEND_URL=$BACKEND_URL)"
docker build --build-arg BACKEND_URL="$BACKEND_URL" -t "$FRONTEND_IMAGE" "$ROOT/tasker-frontend"

if [ "$LOAD" = "1" ]; then
  log "Carregando as imagens no Minikube..."
  minikube image load "$BACKEND_IMAGE"
  minikube image load "$FRONTEND_IMAGE"
fi

if [ "$PUSH" = "1" ]; then
  log "Enviando as imagens ao Docker Hub (exige 'docker login' antes)..."
  docker push "$BACKEND_IMAGE"
  docker push "$FRONTEND_IMAGE"
fi

log "Pronto. Imagens: $BACKEND_IMAGE | $FRONTEND_IMAGE"
