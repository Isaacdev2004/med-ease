#!/usr/bin/env sh
set -eu

echo "==> Docker Compose service status"
docker compose ps

echo ""
echo "==> API liveness (GET /api/healthz)"
curl -fsS "http://localhost:${API_PORT:-3000}/api/healthz" | head -c 500
echo ""

echo ""
echo "==> API readiness (GET /api/healthz/ready)"
curl -fsS "http://localhost:${API_PORT:-3000}/api/healthz/ready" | head -c 2000
echo ""

echo ""
echo "==> Worker health (GET /healthz)"
curl -fsS "http://localhost:${WORKER_PORT:-3001}/healthz" | head -c 500
echo ""

echo ""
echo "==> OpenSearch cluster health"
curl -fsS "http://localhost:${OPENSEARCH_PORT:-9200}/_cluster/health" | head -c 500
echo ""

echo ""
echo "==> Mailpit livez"
curl -fsS "http://localhost:${MAILPIT_UI_PORT:-8025}/livez"
echo ""

echo ""
echo "All probes completed."
