#!/bin/sh
set -e

# Replace environment variables in these files.
envsubst '${NGINX_PORT}' < /etc/nginx/conf.d/gauntface.tmpl > /etc/nginx/conf.d/gauntface.conf;
envsubst '${NODE_PORT}' < /etc/nginx/gauntface-shared.tmpl > /etc/nginx/gauntface-shared.conf;

# Needed to make Nginx run on Alpine (11/12/2017)
mkdir -p /run/nginx

nginx -v
# Test the nginx config before starting daemon
nginx -t
nginx -g 'daemon on;';

if [ "${DEV_MODE}" = "true" ]; then
    echo ""
    echo "DEV_MODE: ON"
    echo ""
    forever -w --watchDirectory=/gauntface/site /gauntface/site/index.js
else
    echo ""
    echo "DEV_MODE: OFF"
    echo ""
    forever /gauntface/site/index.js -l /gauntface/logs/forever.log -o /gauntface/logs/site.log -e /gauntface/logs/site-err.log
fi
