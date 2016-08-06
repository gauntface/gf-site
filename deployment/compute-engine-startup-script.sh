#! /bin/bash
#
BUILDTYPE="$(curl  http://metadata/computeMetadata/v1/instance/attributes/BUILDTYPE -H "Metadata-Flavor: Google")"
ZONE="$(curl  http://metadata/computeMetadata/v1/instance/attributes/ZONE -H "Metadata-Flavor: Google")"
SQL_PROXY="$(curl  http://metadata/computeMetadata/v1/instance/attributes/SQL_PROXY -H "Metadata-Flavor: Google")"
GS_BUCKET="$(curl  http://metadata/computeMetadata/v1/instance/attributes/GS_BUCKET -H "Metadata-Flavor: Google")"
SQL_PATH="$(curl  http://metadata/computeMetadata/v1/instance/attributes/SQL_PATH -H "Metadata-Flavor: Google")"

# This is run on the compute engine instance
echo '------------------------------------------------'
echo "BUILDTYPE: $BUILDTYPE"
echo "ZONE: $ZONE"
echo "SQL_PROXY: $SQL_PROXY"
echo "GS_BUCKET: $GS_BUCKET"
echo "SQL_PATH: $SQL_PATH"
echo '------------------------------------------------'
echo "\n";

echo '------------------------------------------------'
echo "Install Google Cloud SQL Proxy"
echo '------------------------------------------------'
echo "\n";
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
mv cloud_sql_proxy.linux.amd64 cloud_sql_proxy
chmod +x cloud_sql_proxy
sudo mkdir $SQL_PATH
sudo chmod 777 $SQL_PATH
sudo ./cloud_sql_proxy -dir=$SQL_PATH -instances=$SQL_PROXY &

echo '------------------------------------------------'
echo "Install Docker"
echo '------------------------------------------------'
echo "\n";
sudo apt-get -y install linux-image-extra-$(uname -r)
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo touch /etc/apt/sources.list.d/docker.list
echo "deb https://apt.dockerproject.org/repo ubuntu-wily main" >> /etc/apt/sources.list.d/docker.list

# Remove old pkgs
sudo apt-get purge lxc-docker

# Install docker
sudo apt-get update
sudo apt-get -y install docker-engine

sudo service docker start

echo '------------------------------------------------'
echo "Getting Certs Script"
echo '------------------------------------------------'
echo "\n";
sudo apt-get -y install bc

sudo mkdir -p /gauntface/certs/
sudo gsutil cp $GS_BUCKET/certs/lets-encrypt-update.sh /gauntface/certs/
chmod +x /gauntface/certs/lets-encrypt-update.sh
/gauntface/certs/lets-encrypt-update.sh

echo '------------------------------------------------'
echo "Getting Extras"
echo '------------------------------------------------'
echo "\n";

mkdir -p /gauntface/extras/
sudo gsutil cp -r $GS_BUCKET/src/* /gauntface/extras/

echo '------------------------------------------------'
echo "Add Cronjob"
echo '------------------------------------------------'
echo "\n";
#write out current crontab
crontab -l > mycron
#echo new cron into cron file
echo "0 2 * * * /gauntface/certs/lets-encrypt-update.sh" >> mycron
#install new cron file
crontab mycron
rm mycron

echo '------------------------------------------------'
echo "Download Docker Container"
echo '------------------------------------------------'
echo "\n";
DOCKER_ID=gauntface-container
DOCKER_CONTAINER=gauntface/gf-site

sudo docker pull $DOCKER_CONTAINER:$BUILDTYPE

echo '------------------------------------------------'
echo "Start Docker Container"
echo '------------------------------------------------'
echo "\n";
sudo docker stop $DOCKER_ID
sudo docker rm $DOCKER_ID

sudo docker run -t -i \
--name $DOCKER_ID \
-e BUILDTYPE=$BUILDTYPE \
-p 80:80 \
-p 443:443 \
-v $SQL_PATH/:$SQL_PATH/ \
-v /etc/letsencrypt/:/etc/letsencrypt/ \
-v /gauntface/extras/:/gauntface/extras/ \
$DOCKER_CONTAINER:$BUILDTYPE
