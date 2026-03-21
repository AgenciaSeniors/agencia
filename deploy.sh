#!/bin/bash
# Deploy script para subir el sitio a Hostinger via FTP
# Ejecutar desde la carpeta del proyecto: bash deploy.sh

FTP_HOST="agenciaseniors.com"
FTP_USER="u282939343"
FTP_PASS="Edua0523*"
REMOTE_DIR="/public_html"

echo "=== Subiendo sitio a Hostinger ==="
echo "Host: $FTP_HOST"
echo "Destino: $REMOTE_DIR"
echo ""

# Verificar que lftp está instalado
if ! command -v lftp &> /dev/null; then
    echo "Instalando lftp..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install lftp
    else
        sudo apt-get install -y lftp
    fi
fi

# Subir todos los archivos del sitio
lftp -u "$FTP_USER","$FTP_PASS" "ftp://$FTP_HOST" << EOF
set ftp:ssl-allow yes
set ssl:verify-certificate no
set net:timeout 30
set net:max-retries 3
set mirror:use-pget-n 5

# Sincronizar carpeta local con remota
mirror --reverse --delete --verbose \
  --exclude deploy.sh \
  --exclude .git/ \
  --exclude .gitignore \
  --exclude README.md \
  ./ $REMOTE_DIR/

bye
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "=== Deploy completado exitosamente ==="
    echo "Visita: https://agenciaseniors.com"
else
    echo ""
    echo "=== Error en el deploy ==="
    echo "Verifica las credenciales FTP y que el puerto 21 no esté bloqueado."
fi
