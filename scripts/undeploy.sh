#!/usr/bin/env bash
# =============================================================================
# Remove a aplicação do cluster (desinstala o release Helm).
#
# Uso:
#   bash scripts/undeploy.sh            # remove o release (mantém o cluster)
#   bash scripts/undeploy.sh --purge    # remove também PV/PVC (apaga dados do DB)
# =============================================================================
set -euo pipefail

RELEASE="${RELEASE:-tasker}"
PURGE=0
for a in "$@"; do case "$a" in --purge) PURGE=1 ;; esac; done

log() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

log "Desinstalando o release '$RELEASE'..."
helm uninstall "$RELEASE" || true

if [ "$PURGE" = "1" ]; then
  log "Removendo PV/PVC do banco (dados serão perdidos)..."
  kubectl delete pvc tasker-db-pvc --ignore-not-found
  kubectl delete pv  tasker-db-pv  --ignore-not-found
fi

log "Concluído."
