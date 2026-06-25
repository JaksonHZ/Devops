#!/usr/bin/env bash
# =============================================================================
# Sobe a aplicação inteira de uma vez — para quem JÁ TEM as ferramentas
# instaladas (Docker, kubectl, Minikube e Helm).
#
#   1) inicia o Minikube (driver docker)
#   2) build das imagens + minikube image load
#   3) deploy via Helm (+ addon ingress)
#
# Uso:
#   bash scripts/up.sh
#
# Depois, adicione o host (precisa de sudo, uma única vez):
#   echo "$(minikube ip) k8s.local" | sudo tee -a /etc/hosts
# e acesse  http://k8s.local  (no WSL: bash scripts/port-forward.sh).
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
log() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

log "1/3 — Garantindo o Minikube em execução..."
minikube status >/dev/null 2>&1 || minikube start --driver=docker

log "2/3 — Build e carga das imagens no Minikube..."
bash "$ROOT/scripts/build-images.sh"

log "3/3 — Deploy (ingress + Helm)..."
bash "$ROOT/scripts/deploy.sh"
