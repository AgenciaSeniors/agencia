# Deploy script para subir el sitio a Hostinger via FTP
# Ejecutar desde PowerShell: .\deploy.ps1

$FTP_HOST = "agenciaseniors.com"
$FTP_USER = "u282939343"
$FTP_PASS = "Edua0523*"
$REMOTE_DIR = "/public_html"
$LOCAL_DIR = $PSScriptRoot

# Archivos y carpetas a excluir
$EXCLUDES = @(".git", "deploy.sh", "deploy.ps1", ".gitignore", "README.md", "CLAUDE.md", ".claude")

Write-Host "=== Subiendo sitio a Hostinger ===" -ForegroundColor Cyan
Write-Host "Host: $FTP_HOST"
Write-Host "Destino: $REMOTE_DIR"
Write-Host ""

function Upload-FtpFile {
    param (
        [string]$LocalFile,
        [string]$RemotePath
    )

    $uri = "ftp://${FTP_HOST}${RemotePath}"

    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($uri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        $ftpRequest.EnableSsl = $false
        $ftpRequest.KeepAlive = $false

        $fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        $ftpRequest.ContentLength = $fileContent.Length

        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()

        $response = $ftpRequest.GetResponse()
        $response.Close()

        return $true
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
        return $false
    }
}

function Create-FtpDirectory {
    param (
        [string]$RemotePath
    )

    $uri = "ftp://${FTP_HOST}${RemotePath}"

    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($uri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
        $ftpRequest.UsePassive = $true
        $ftpRequest.EnableSsl = $false
        $ftpRequest.KeepAlive = $false

        $response = $ftpRequest.GetResponse()
        $response.Close()
    }
    catch {
        # El directorio probablemente ya existe, ignorar el error
    }
}

# Obtener todos los archivos recursivamente
$files = Get-ChildItem -Path $LOCAL_DIR -Recurse -File

$total = 0
$uploaded = 0
$failed = 0

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($LOCAL_DIR.Length).Replace("\", "/")

    # Verificar exclusiones
    $skip = $false
    foreach ($exclude in $EXCLUDES) {
        if ($relativePath -like "*/$exclude/*" -or $relativePath -like "*/$exclude" -or $relativePath -eq "/$exclude" -or $relativePath -like "/$exclude/*") {
            $skip = $true
            break
        }
    }
    if ($skip) { continue }

    $total++
    $remotePath = "${REMOTE_DIR}${relativePath}"

    # Crear directorios remotos si es necesario
    $remoteDir = $remotePath.Substring(0, $remotePath.LastIndexOf("/"))
    $dirs = $remoteDir.Split("/")
    $currentDir = ""
    foreach ($dir in $dirs) {
        if ($dir -eq "") { continue }
        $currentDir += "/$dir"
        Create-FtpDirectory -RemotePath $currentDir
    }

    # Subir archivo
    Write-Host "[$total] Subiendo: $relativePath" -ForegroundColor Yellow -NoNewline
    $result = Upload-FtpFile -LocalFile $file.FullName -RemotePath $remotePath

    if ($result) {
        Write-Host " OK" -ForegroundColor Green
        $uploaded++
    }
    else {
        Write-Host " FALLO" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "=== Resultado ===" -ForegroundColor Cyan
Write-Host "Archivos subidos: $uploaded / $total" -ForegroundColor Green

if ($failed -gt 0) {
    Write-Host "Archivos fallidos: $failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "=== Deploy completado con errores ===" -ForegroundColor Red
}
else {
    Write-Host ""
    Write-Host "=== Deploy completado exitosamente ===" -ForegroundColor Green
    Write-Host "Visita: https://agenciaseniors.com" -ForegroundColor Cyan
}
