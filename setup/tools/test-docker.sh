echo "    Stopping old docker processes."
sudo docker stop $(docker ps -a -q -f "name=gf-test")

echo "    Removing old docker processes."
sudo docker rm $(docker ps -a -q -f "name=gf-test")

# echo "Removing old docker images"
# docker rmi gauntface/gf-site
# docker rmi gauntface/gf-deploy

echo "    Building public site."
sudo docker build -t gauntface/gf-site .

echo "    Building deployment version of site."
sudo docker build -t gauntface/gf-deploy ./deploy

echo "    Building test version of site."
sudo docker build -f "deploy/Dockerfile-test" -t gauntface/gf-test ./deploy

echo "    Running private site."
sudo docker run --name gf-test --net="host" -t -p 8000:80 gauntface/gf-test
sudo docker exec -it $(docker ps -a -q -f "name=gf-test") bash
