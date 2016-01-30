#!/bin/bash
set -e

if [ "$BASH_VERSION" = '' ]; then
 echo "    Please run this script via this command: './<script path>/<script name>.sh'"
 exit 1;
fi

if [ "$INSTANCE_PREFIX" = '' ]; then
 echo "    INSTANCE_PREFIX is missing"
 exit 1;
fi

if [ "$BUILDTYPE" = '' ]; then
 echo "    BUILDTYPE is missing"
 exit 1;
fi

if [ "$ZONE" = '' ]; then
 echo "    ZONE is missing"
 exit 1;
fi

if [ "$SQL_PROXY" = '' ]; then
 echo "    SQL_PROXY is missing"
 exit 1;
fi

if [ "$CERT_DOMAIN" = '' ]; then
 echo "    CERT_DOMAIN is missing"
 exit 1;
fi

if [ "$GS_BUCKET" = '' ]; then
 echo "    GS_BUCKET is missing"
 exit 1;
fi

if [ "$SCOPES" = '' ]; then
 echo "    SCOPES is missing"
 exit 1;
fi

if [ "$SQL_PATH" = '' ]; then
  echo "    SQL_PATH is missing"
  exit 1;
fi

INSTANCE_NAME=$INSTANCE_PREFIX-$BUILDTYPE-$(TZ=UK/London date +'%Y-%m-%d-%H-%M')

echo '------------------------------------------------'
echo "Checking Existing GCE Instances"
echo '------------------------------------------------'
echo "";
# format='value(uri())' results in a return of a whole url which represents
# the instance + zone
INSTANCES_TO_DELETE=$(gcloud compute instances list -r "$INSTANCE_PREFIX-$BUILDTYPE-.*" --uri)

# Current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo '------------------------------------------------'
echo "Creating New GCE Instance"
echo '------------------------------------------------'
echo "";

gcloud compute instances create $INSTANCE_NAME \
--boot-disk-auto-delete \
--image ubuntu-15-10 \
--machine-type g1-small \
--metadata BUILDTYPE=$BUILDTYPE,ZONE=$ZONE,SQL_PROXY=$SQL_PROXY,CERT_DOMAIN=$CERT_DOMAIN,GS_BUCKET=$GS_BUCKET,SQL_PATH=$SQL_PATH \
--metadata-from-file startup-script=$DIR/compute-engine-startup-script.sh \
--tags http-server,https-server \
--zone $ZONE \
--scopes $SCOPES

echo '------------------------------------------------'
echo "Adding New GCE Instance to Target-Pool"
echo '------------------------------------------------'
echo "";

gcloud compute target-pools add-instances $BUILDTYPE-pool \
--instances $INSTANCE_NAME \
--zone $ZONE

if [ "$INSTANCES_TO_DELETE" != "" ]; then
  echo '------------------------------------------------'
  echo "Deleting Existing GCE Instances"
  echo '------------------------------------------------'
  echo "";
  gcloud compute instances delete $INSTANCES_TO_DELETE --quiet
fi
