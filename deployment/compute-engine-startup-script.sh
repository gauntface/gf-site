#! /bin/bash
#
BUILDTYPE="$(curl  http://metadata/computeMetadata/v1/instance/attributes/BUILDTYPE -H "Metadata-Flavor: Google")"
ZONE="$(curl  http://metadata/computeMetadata/v1/instance/attributes/ZONE -H "Metadata-Flavor: Google")"
SQL_PROXY="$(curl  http://metadata/computeMetadata/v1/instance/attributes/SQL_PROXY -H "Metadata-Flavor: Google")"
CERT_DOMAIN="$(curl  http://metadata/computeMetadata/v1/instance/attributes/CERT_DOMAIN -H "Metadata-Flavor: Google")"
GS_BUCKET="$(curl  http://metadata/computeMetadata/v1/instance/attributes/GS_BUCKET -H "Metadata-Flavor: Google")"
SQL_PATH="$(curl  http://metadata/computeMetadata/v1/instance/attributes/SQL_PATH -H "Metadata-Flavor: Google")"

# This is run on the compute engine instance
echo '------------------------------------------------'
echo "BUILDTYPE: $BUILDTYPE"
echo "ZONE: $ZONE"
echo "SQL_PROXY: $SQL_PROXY"
echo "CERT_DOMAIN: $CERT_DOMAIN"
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
echo "Starting letsencrypt"
echo '------------------------------------------------'
echo "\n";
LE_CERT_PATH="/etc/letsencrypt/live/$CERT_DOMAIN/cert.pem"

sudo mkdir -p /letsencrypt
sudo git clone https://github.com/letsencrypt/letsencrypt /letsencrypt

# Get Existing Certs
sudo mkdir -p /gauntface/certs/$BUILDTYPE/
sudo mkdir -p /etc/letsencrypt/
sudo gsutil cp $GS_BUCKET/certs/$BUILDTYPE/config.ini /gauntface/certs/$BUILDTYPE/
sudo gsutil cp -r $GS_BUCKET/certs/$BUILDTYPE/letsencrypt/* /etc/letsencrypt/

if [ ! -f $LE_CERT_PATH ]; then
  echo "Need to get a new $BUILDTYPE certificate."
  # This should handle renewing old certs as well as updating old ones
  sudo /letsencrypt/letsencrypt-auto certonly --config /gauntface/certs/$BUILDTYPE/config.ini
else
  echo "Already have a $BUILDTYPE certificate"
  # If we have certs - check for updates
  get_days_exp() {
    local d1=$(date -d "`openssl x509 -in $1 -text -noout|grep "Not After"|cut -c 25-`" +%s)
    local d2=$(date -d "now" +%s)
    # Return result in global variable
    DAYS_EXP=$(echo \( $d1 - $d2 \) / 86400 |bc)
  }

  get_days_exp "$LE_CERT_PATH"

  if [ "$DAYS_EXP" -lt 7 ]; then
    echo "Your certificate needs updating"
    sudo /letsencrypt/letsencrypt-auto renew
  else
    echo "Certificate for $BUILDTYPE will expire in ${DAYS_EXP} days. "
  fi
fi

# Back up any changes
sudo gsutil cp -r /etc/letsencrypt/* $GS_BUCKET/certs/$BUILDTYPE/letsencrypt/

# Make sure that dhparam is pulled down
sudo gsutil cp $GS_BUCKET/certs/$BUILDTYPE/dhparam.cert /etc/letsencrypt/

# Little clean up
sudo rm -rf /gauntface/certs/

echo '------------------------------------------------'
echo "Getting Extras"
echo '------------------------------------------------'
echo "\n";

mkdir -p /gauntface/extras/
sudo gsutil cp -r $GS_BUCKET/src/* /gauntface/extras/

echo '------------------------------------------------'
echo "Create and Start Container"
echo '------------------------------------------------'
echo "\n";
DOCKER_ID=gauntface-container
DOCKER_CONTAINER=gauntface/gf-site

sudo docker pull $DOCKER_CONTAINER:$BUILDTYPE

sudo docker stop $DOCKER_ID
sudo docker rm $DOCKER_ID

sudo docker run -t -i -d \
--name $DOCKER_ID \
-e BUILDTYPE=$BUILDTYPE \
-p 80:80 \
-p 443:443 \
-v $SQL_PATH/:$SQL_PATH/ \
-v /etc/letsencrypt/:/etc/letsencrypt/ \
-v /gauntface/extras/:/gauntface/extras/ \
$DOCKER_CONTAINER:$BUILDTYPE
