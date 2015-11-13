echo "    Stopping old docker processes."
docker stop $(docker ps -a -q -f "name=gf-test")

echo "    Removing old docker processes."
docker rm $(docker ps -a -q -f "name=gf-test")

echo "    Deleting all containers."
docker rm $(docker ps -a -q)

echo "    Deleting all images."
docker rmi $(docker images -q)

# echo "Removing old docker images"
# docker rmi gauntface/gf-site
# docker rmi gauntface/gf-deploy

echo "    Building public site."
docker build --no-cache -t gauntface/gf-site .

echo "    Building deployment version of site."
docker build --no-cache -t gauntface/gf-deploy ./deploy

echo "    Building test version of site."
docker build --no-cache -f "deploy/Dockerfile-test" -t gauntface/gf-test ./deploy

echo "    Running private site."
docker run --name gf-test --net="host" -t -p 8000:8000 gauntface/gf-test
docker exec -it $(docker ps -a -q -f "name=gf-test") bash
