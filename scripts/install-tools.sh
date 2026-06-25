#!/usr/bin/env bash
# =============================================================================
# Instala as ferramentas de DevOps necessárias no Ubuntu (WSL2):
#   Docker Engine, kubectl, Minikube e Helm.
#
# Uso (como usuário NORMAL, não root):
#   bash scripts/install-tools.sh
#
# O script chama "sudo" apenas nas etapas que exigem privilégio (vai pedir a
# sua senha). É idempotente: pula o que já estiver instalado.
# =============================================================================
set -euo pipefail

ARCH=amd64
REAL_USER="${SUDO_USER:-$USER}"
NEED_RELOGIN=0

log() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

# ---------------------------- Docker -----------------------------------------
if command -v docker >/dev/null 2>&1; then
  log "Docker já instalado: $(docker --version)"
else
  log "Instalando Docker Engine (pacote docker.io do Ubuntu)..."
  sudo apt-get update
  sudo apt-get install -y docker.io
fi

if ! docker compose version >/dev/null 2>&1; then
  log "Instalando plugin docker compose v2 (opcional, para o compose.yml local)..."
  sudo apt-get install -y docker-compose-v2 2>/dev/null || \
    echo "(docker-compose-v2 indisponível neste repositório — pode seguir sem ele)"
fi

log "Garantindo que o serviço do Docker esteja em execução..."
if command -v systemctl >/dev/null 2>&1 && systemctl is-system-running >/dev/null 2>&1; then
  sudo systemctl enable --now docker || sudo service docker start || true
else
  sudo service docker start || true
fi

if ! id -nG "$REAL_USER" | tr ' ' '\n' | grep -qx docker; then
  log "Adicionando '$REAL_USER' ao grupo 'docker' (para usar docker sem sudo)..."
  sudo usermod -aG docker "$REAL_USER"
  NEED_RELOGIN=1
fi

# ---------------------------- kubectl ----------------------------------------
if command -v kubectl >/dev/null 2>&1; then
  log "kubectl já instalado."
else
  log "Instalando kubectl..."
  KVER="$(curl -L -s https://dl.k8s.io/release/stable.txt)"
  curl -fsSLo /tmp/kubectl "https://dl.k8s.io/release/${KVER}/bin/linux/${ARCH}/kubectl"
  sudo install -o root -g root -m 0755 /tmp/kubectl /usr/local/bin/kubectl
  rm -f /tmp/kubectl
fi

# ---------------------------- Minikube ---------------------------------------
if command -v minikube >/dev/null 2>&1; then
  log "Minikube já instalado."
else
  log "Instalando Minikube..."
  curl -fsSLo /tmp/minikube "https://storage.googleapis.com/minikube/releases/latest/minikube-linux-${ARCH}"
  sudo install /tmp/minikube /usr/local/bin/minikube
  rm -f /tmp/minikube
fi

# ---------------------------- Helm -------------------------------------------
if command -v helm >/dev/null 2>&1; then
  log "Helm já instalado: $(helm version --short)"
else
  log "Instalando Helm..."
  HELM_VER="$(curl -fsSL https://api.github.com/repos/helm/helm/releases/latest \
              | grep -oP '"tag_name":\s*"\K[^"]+' | head -1)"
  curl -fsSLo /tmp/helm.tgz "https://get.helm.sh/helm-${HELM_VER}-linux-${ARCH}.tar.gz"
  tar -xzf /tmp/helm.tgz -C /tmp
  sudo install /tmp/linux-${ARCH}/helm /usr/local/bin/helm
  rm -rf /tmp/helm.tgz "/tmp/linux-${ARCH}"
fi

# ---------------------------- Resumo -----------------------------------------
log "Versões instaladas:"
docker --version 2>/dev/null || true
kubectl version --client 2>/dev/null | head -1 || true
minikube version 2>/dev/null | head -1 || true
helm version --short 2>/dev/null || true

if [ "$NEED_RELOGIN" = "1" ]; then
  printf "\n\033[1;33mATENÇÃO:\033[0m você foi adicionado ao grupo 'docker'.\n"
  printf "Feche e reabra o terminal (ou rode 'newgrp docker') antes de seguir.\n"
fi
log "Instalação concluída."
