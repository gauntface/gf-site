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

service php7.0-fpm start;

nginx -g 'daemon off;';
