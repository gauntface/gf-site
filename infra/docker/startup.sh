#!/bin/sh
set -e

# Replace environment variables in these files.
envsubst '${NGINX_PORT}' < /etc/nginx/conf.d/gauntface.conf > /etc/nginx/conf.d/gauntface.conf;
envsubst '${NODE_PORT}' < /etc/nginx/gauntface-shared.conf > /etc/nginx/gauntface-shared.conf;

# Needed to make Nginx run on Alphine (11/12/2017)
mkdir -p /run/nginx

if [ "${DEV_MODE}" = "true" ]; then
    echo ""
    echo "DEV_MODE: ON"
    echo ""
    # Legacy watch with nodemoan to make it work with docker.
    nginx -v
    nginx -g 'daemon on;';
    forever -w --watchDirectory=/gauntface/site /gauntface/site/index.js
else
    echo ""
    echo "DEV_MODE: OFF"
    echo ""
    forever start /gauntface/site/index.js -l /gauntface/logs/forever.log -o /gauntface/logs/site.log -e /gauntface/logs/site-err.log
    nginx -g 'daemon off;';
fi
