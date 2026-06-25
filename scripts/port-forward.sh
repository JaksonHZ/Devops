#!/usr/bin/env bash
# =============================================================================
# Encaminha o Ingress para http://localhost:8080, permitindo acessar a aplicação
# pelo navegador do Windows (WSL2 reflete o localhost do WSL no Windows).
#
# Uso:
#   bash scripts/port-forward.sh          # via Ingress  -> http://k8s.local:8080
#   MODE=frontend bash scripts/port-forward.sh   # direto no frontend -> http://localhost:3000
#
# Mantenha este terminal aberto enquanto navega. Ctrl+C encerra.
# Para http://k8s.local:8080, adicione antes ao hosts do WINDOWS:  127.0.0.1 k8s.local
# =============================================================================
set -euo pipefail

MODE="${MODE:-ingress}"

if [ "$MODE" = "frontend" ]; then
  echo "Acesse no navegador do Windows:  http://localhost:3000"
  echo "(Ctrl+C para encerrar)"
  kubectl port-forward service/tasker-frontend 3000:3000
else
  echo "Acesse no navegador do Windows:  http://k8s.local:8080"
  echo "(adicione antes '127.0.0.1 k8s.local' ao hosts do Windows; Ctrl+C para encerrar)"
  kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
fi
