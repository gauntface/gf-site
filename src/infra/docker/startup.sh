#!/bin/bash
set -e

if [ "$BASH_VERSION" = '' ]; then
 echo "    Please run this script via this command: './<script path>/<script name>.sh'"
 exit 1;
fi

if [ "$BUILDTYPE" = '' ]; then
 echo "    No BUILDTYPE set."
 exit 1;
fi

CYAN='\033[1;36m'
NC='\033[0m' # No Color

echo ""
echo ""
echo -e "${CYAN}    ___       ___       ___       ___       ___    "
echo -e "${CYAN}   /\  \     /\  \     /\__\     /\__\     /\  \   "
echo -e "${CYAN}  /::\  \   /::\  \   /:/ _/_   /:| _|_    \:\  \  "
echo -e "${CYAN} /:/\:\__\ /::\:\__\ /:/_/\__\ /::|/\__\   /::\__\ "
echo -e "${CYAN} \:\:\/__/ \/\::/  / \:\/:/  / \/|::/  /  /:/\/__/ "
echo -e "${CYAN}  \::/  /    /:/  /   \::/  /    |:/  /   \/__/    "
echo -e "${CYAN}   \/__/     \/__/     \/__/     \/__/             "
echo -e "${CYAN}         ___       ___       ___       ___         "
echo -e "${CYAN}        /\  \     /\  \     /\  \     /\  \        "
echo -e "${CYAN}       /::\  \   /::\  \   /::\  \   /::\  \       "
echo -e "${CYAN}      /::\:\__\ /::\:\__\ /:/\:\__\ /::\:\__\      "
echo -e "${CYAN}      \/\:\/__/ \/\::/  / \:\ \/__/ \:\:\/  /      "
echo -e "${CYAN}         \/__/    /:/  /   \:\__\    \:\/  /       "
echo -e "${CYAN}                  \/__/     \/__/     \/__/        "
echo ""
echo -e "${NC}"
echo ""

# Replace environment variables in these files.
envsubst < /etc/nginx/sites-available/gauntface.tmpl > /etc/nginx/sites-available/gauntface.conf;
envsubst < /etc/nginx/environment-vars.tmpl > /etc/nginx/environment-vars.conf;

# Create a symbolic link between sites-available and sites-enabled
ln -s /etc/nginx/sites-available/gauntface.conf /etc/nginx/sites-enabled/gauntface.conf;

# Create tmp directory for cache directories etc.
mkdir -p /gauntface/site/server/app/resources/tmp/cache/templates/
chmod -R 777 /gauntface/site/server/app/resources/tmp/cache/templates/

mkdir -p /gauntface/site/server/app/resources/tmp/logs/
chmod -R 777 /gauntface/site/server/app/resources/tmp/logs/

service php7.0-fpm start;

nginx -g 'daemon off;';
