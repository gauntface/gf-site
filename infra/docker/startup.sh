#!/bin/bash
set -e

if [ "${BASH_VERSION}" = '' ]; then
 echo "    Please run this script via this command: './<script path>/<script name>.sh'"
 exit 1;
fi

# Replace environment variables in these files.
envsubst '${NGINX_PORT}' < /etc/nginx/sites-available/gauntface.tmpl > /etc/nginx/sites-available/gauntface.conf;
envsubst '${NODE_PORT}' < /etc/nginx/gauntface-shared.conf > /etc/nginx/gauntface-shared.conf;

#environmentVariables=(
#  'BUILDTYPE'
#  'TWITTER_CONSUMER_KEY'
#  'TWITTER_CONSUMER_SECRET'
#  'TWITTER_ACCESS_TOKEN'
#  'TWITTER_ACCESS_SECRET'
#  'YOUTUBE_API_KEY'
#);
#
#touch /etc/nginx/environment-vars.conf;
#
#for envName in ${environmentVariables[@]}
#do
#  if [[ ! -z "${!envName}" ]]; then
#    echo -e "fastcgi_param ${envName} ${!envName};\n" >> /etc/nginx/environment-vars.conf;
#  fi
#done

# Create a symbolic link between sites-available and sites-enabled
ln -s -f /etc/nginx/sites-available/gauntface.conf /etc/nginx/sites-enabled/gauntface.conf;

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
if [ -z "$NODE_PORT" ]; then
echo -e "${CYAN}                No 'NODE_PORT' value Defined                "
else
echo -e "${CYAN}            [NODE]:  http://localhost:${NODE_PORT}           "
fi
if [ -z "$NGINX_PORT" ]; then
echo -e "${CYAN}                No 'NGINX_PORT' value Defined                "
else
echo -e "${CYAN}            [NGINX]: http://localhost:${NGINX_PORT}           "
fi
echo ""
echo -e "${NC}"
echo ""

if [ "${DEV_MODE}" = true ]; then
# Legacy watch with nodemoan to make it work with docker.
nginx -g 'daemon on;';
forever -w --watchDirectory=/gauntface/site /gauntface/site/index.js
else
forever start /gauntface/site/index.js -l /gauntface/logs/forever.log -o /gauntface/logs/site.log -e /gauntface/logs/site-err.log
nginx -g 'daemon off;';
fi
