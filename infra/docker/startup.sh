#!/bin/sh
set -e

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
