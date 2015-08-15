service php5-fpm start

echo "Starting up background nginx for build"
nginx -g 'daemon on;'

echo "Building site"
cd /home/gauntface/ && gulp build

echo "Stopping background nginx for build"
nginx -s stop

echo "Starting foreground nginx"
nginx -g 'daemon off;'
