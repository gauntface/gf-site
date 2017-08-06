#!/bin/bash

# Taken from: https://gist.github.com/ngpestelos/4fc2e31e19f86b9cf10b

# Delete all stopped containers
docker ps -q -f status=exited | xargs --no-run-if-empty docker rm
# Delete all dangling (unused) images
docker images -q -f dangling=true | xargs --no-run-if-empty docker rmi
