param(
    [int]$example = 1,
    [string]$runId = ""
)

$ErrorActionPreference = "Stop"

$examples = @{
    1 = "examples/openapi_ping.json"
    2 = "examples/openapi_get_query.json"
    3 = "examples/openapi_post_body.json"
}

if (-not $runId) {
    if (-not $examples.ContainsKey($example)) {
        Write-Error "Unknown example index. Use 1..3"
        exit 1
    }
    $body = Get-Content $examples[$example] -Raw
    $json = @{ openapi = (ConvertFrom-Json $body) } | ConvertTo-Json -Depth 5
    $resp = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/v1/generate/" -Headers @{ "Content-Type" = "application/json" } -Body $json
    $runId = $resp.run_id
    Write-Host "Started run $runId"
}

for ($i = 0; $i -lt 60; $i++) {
    $status = Invoke-RestMethod -Uri "http://127.0.0.1:8000/v1/runs/$runId"
    if ($status.status -eq "finished") {
        Write-Host "Run finished. Artifact: $($status.artifact)"
        Write-Host "Running pytest..."
        & python -m pytest $status.artifact -q
        exit $LASTEXITCODE
    }
    elseif ($status.status -eq "failed") {
        Write-Host "Run failed: $($status.error)"
        exit 1
    }
    Start-Sleep -Seconds 1
}

Write-Host "Timeout waiting for run $runId"
exit 1

