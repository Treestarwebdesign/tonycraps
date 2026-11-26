#!/usr/bin/env bash
# Deploy van de statische site naar Cloudways via SSH + rsync.
#
# Gebruik:
#   npm run deploy              # bouwen + uploaden (vraagt bevestiging)
#   npm run deploy -- --dry-run # toont enkel wat er zou veranderen
#   npm run deploy -- --yes     # zonder bevestigingsvraag (bv. in CI)
#
# Instellingen (in .deploy.env of als omgevingsvariabelen):
#   DEPLOY_HOST   IP van de Cloudways-server
#   DEPLOY_USER   SSH-gebruiker (master of application credentials)
#   DEPLOY_APP    map van de applicatie onder ~/applications/ (Cloudways: Application Settings -> "Application Path"/map-id)
#   DEPLOY_PATH   (optioneel) volledig doelpad; standaard applications/$DEPLOY_APP/public_html
#   DEPLOY_SSH_KEY (optioneel) pad naar de private key, bv. ~/.ssh/id_ed25519
set -euo pipefail
cd "$(dirname "$0")"

[ -f .deploy.env ] && set -a && . ./.deploy.env && set +a

DRY_RUN=""
ASSUME_YES=""
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN="--dry-run" ;;
    --yes|-y) ASSUME_YES=1 ;;
    *) echo "Onbekende optie: $arg" >&2; exit 1 ;;
  esac
done

: "${DEPLOY_HOST:?DEPLOY_HOST ontbreekt (zie .deploy.env.example)}"
: "${DEPLOY_USER:?DEPLOY_USER ontbreekt (zie .deploy.env.example)}"
if [ -z "${DEPLOY_PATH:-}" ]; then
  : "${DEPLOY_APP:?DEPLOY_APP of DEPLOY_PATH ontbreekt (zie .deploy.env.example)}"
  DEPLOY_PATH="applications/${DEPLOY_APP}/public_html"
fi

SSH_CMD="ssh -o StrictHostKeyChecking=accept-new"
[ -n "${DEPLOY_SSH_KEY:-}" ] && SSH_CMD="$SSH_CMD -i ${DEPLOY_SSH_KEY}"
TARGET="${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH%/}/"

echo "▸ Build"
npm run build

[ -f out/index.html ] && [ -f out/.htaccess ] || { echo "out/ is onvolledig, deploy afgebroken." >&2; exit 1; }

echo "▸ Controle doelmap ${DEPLOY_PATH}"
$SSH_CMD "${DEPLOY_USER}@${DEPLOY_HOST}" "test -d '${DEPLOY_PATH}'" \
  || { echo "Doelmap ${DEPLOY_PATH} bestaat niet op de server." >&2; exit 1; }

if [ -z "$DRY_RUN" ] && [ -z "$ASSUME_YES" ]; then
  echo
  echo "Dit overschrijft ${TARGET}"
  echo "en VERWIJDERT bestanden die niet in out/ staan (bv. een oude WordPress-installatie)."
  read -r -p "Doorgaan? [j/N] " ok
  [[ "$ok" =~ ^[jJyY]$ ]] || { echo "Afgebroken."; exit 1; }
fi

echo "▸ Upload naar ${TARGET} ${DRY_RUN}"
# -a: rechten/tijden, -z: compressie, --delete: oude bestanden weg, .htaccess gaat mee (geen exclude)
rsync -avz --delete --human-readable $DRY_RUN \
  --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  -e "$SSH_CMD" \
  out/ "$TARGET"

echo "✓ Klaar${DRY_RUN:+ (dry-run, er is niets gewijzigd)}"
