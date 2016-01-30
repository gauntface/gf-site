#!/bin/bash
set -e

if [ "$BASH_VERSION" = '' ]; then
 echo "    Please run this script via this command: './<script path>/<script name>.sh'"
 exit 1;
fi

echo "    ___       ___       ___       ___       ___    "
echo "   /\  \     /\  \     /\__\     /\__\     /\  \   "
echo "  /::\  \   /::\  \   /:/ _/_   /:| _|_    \:\  \  "
echo " /:/\:\__\ /::\:\__\ /:/_/\__\ /::|/\__\   /::\__\ "
echo " \:\:\/__/ \/\::/  / \:\/:/  / \/|::/  /  /:/\/__/ "
echo "  \::/  /    /:/  /   \::/  /    |:/  /   \/__/    "
echo "   \/__/     \/__/     \/__/     \/__/             "
echo "         ___       ___       ___       ___         "
echo "        /\  \     /\  \     /\  \     /\  \        "
echo "       /::\  \   /::\  \   /::\  \   /::\  \       "
echo "      /::\:\__\ /::\:\__\ /:/\:\__\ /::\:\__\      "
echo "      \/\:\/__/ \/\::/  / \:\ \/__/ \:\:\/  /      "
echo "         \/__/    /:/  /   \:\__\    \:\/  /       "
echo "                  \/__/     \/__/     \/__/        "

echo ""
echo ""

if [ "$BUILDTYPE" = '' ]; then
 echo "    No BUILDTYPE set."
 exit 1;
fi

envsubst < /etc/nginx/sites-available/gauntface.tmpl > /etc/nginx/sites-available/gauntface.conf;

envsubst < /etc/nginx/fastcgi-params.tmpl > /etc/nginx/fastcgi-params.conf;

ln -s /etc/nginx/sites-available/gauntface.conf /etc/nginx/sites-enabled/gauntface.conf;

# This may be able to remove this *IF* Docker volumes can be joined
if [ -d "/gauntface/extras" ]; then
  cp -r /gauntface/extras/. /gauntface/site/
else
  echo "No extras to copy."
fi

service php5-fpm start;

nginx -g 'daemon off;';
