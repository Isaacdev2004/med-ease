# Verify Med-ease local infrastructure health (run from docker/ after compose up)

$ErrorActionPreference = "Stop"

Write-Host "==> Docker Compose service status"
docker compose ps

$apiPort = if ($env:API_PORT) { $env:API_PORT } else { "3000" }
$workerPort = if ($env:WORKER_PORT) { $env:WORKER_PORT } else { "3001" }
$osPort = if ($env:OPENSEARCH_PORT) { $env:OPENSEARCH_PORT } else { "9200" }
$mailpitPort = if ($env:MAILPIT_UI_PORT) { $env:MAILPIT_UI_PORT } else { "8025" }

Write-Host ""
Write-Host "==> API liveness (GET /api/healthz)"
curl.exe -fsS "http://localhost:$apiPort/api/healthz"

Write-Host ""
Write-Host ""
Write-Host "==> API readiness (GET /api/healthz/ready)"
curl.exe -fsS "http://localhost:$apiPort/api/healthz/ready"

Write-Host ""
Write-Host ""
Write-Host "==> Worker health (GET /healthz)"
curl.exe -fsS "http://localhost:$workerPort/healthz"

Write-Host ""
Write-Host ""
Write-Host "==> OpenSearch cluster health"
curl.exe -fsS "http://localhost:$osPort/_cluster/health"

Write-Host ""
Write-Host ""
Write-Host "==> Mailpit livez"
curl.exe -fsS "http://localhost:$mailpitPort/livez"

Write-Host ""
Write-Host "All probes completed."
