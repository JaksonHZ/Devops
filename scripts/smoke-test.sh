#!/usr/bin/env bash
# =============================================================================
# Teste de fumaça (smoke test) da aplicação publicada via Ingress.
# Exercita: frontend -> proxy /api -> backend -> Prisma -> PostgreSQL.
#
# Uso:
#   bash scripts/smoke-test.sh
# Variáveis (opcionais): HOST (padrão http://k8s.local), EMAIL, PASS
# =============================================================================
set -uo pipefail

HOST="${HOST:-http://k8s.local}"
EMAIL="${EMAIL:-teste@k8s.local}"
PASS="${PASS:-123456}"

line() { printf "\n\033[1;34m== %s ==\033[0m\n" "$*"; }

line "1) Frontend via Ingress (espera HTTP 200)"
curl -s -o /dev/null -w "   GET / -> HTTP %{http_code}\n" "$HOST/"

line "2) Backend via proxy /api — rota protegida (espera HTTP 401)"
curl -s -o /dev/null -w "   GET /api/user/list -> HTTP %{http_code}\n" "$HOST/api/user/list"

line "3) Registro de usuário (espera 201; ou 409 se já existir)"
curl -s -o /dev/null -w "   POST /api/register -> HTTP %{http_code}\n" \
  -X POST "$HOST/api/register" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"username\":\"tasker\",\"password\":\"$PASS\"}"

line "4) Login (espera HTTP 200 + tokens JWT)"
HTTP=$(curl -s -o /tmp/tasker-login.json -w "%{http_code}" \
  -X POST "$HOST/api/authenticate" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")
echo "   POST /api/authenticate -> HTTP $HTTP"
echo "   Resposta:"
sed 's/^/     /' /tmp/tasker-login.json; echo

if grep -q access_token /tmp/tasker-login.json 2>/dev/null; then
  printf "\n\033[1;32m✓ OK: fluxo completo funcionando (frontend -> /api -> backend -> banco).\033[0m\n"
else
  printf "\n\033[1;33m! Login não retornou token — verifique os logs do backend.\033[0m\n"
fi
rm -f /tmp/tasker-login.json
