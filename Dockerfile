############################################################
# Dockerfile to build Nginx Installed Containers
# Based on Ubuntu
############################################################

# Set the base image to Ubuntu
FROM ubuntu:vivid

# File Author / Maintainer
MAINTAINER Matt Gaunt

#
# Add Repos and Install Steps
#
# Run apt-get update so we can find all packages we need
RUN apt-get update

# software-properties-common    Makes add-apt-repository work
# curl                          To retrieve node install script
# git                           To clone site code
# nano                          In case viewing text in container is needed
RUN apt-get -y install software-properties-common curl git nano

#
# Add repos
#
RUN add-apt-repository ppa:nginx/development
RUN echo "deb http://ppa.launchpad.net/nginx/development/ubuntu vivid main " >> /etc/apt/sources.list
RUN echo "deb-src http://ppa.launchpad.net/nginx/development/ubuntu vivid main " >> /etc/apt/sources.list
RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash -

# Run apt-get update so we can find all packages we need
RUN apt-get update

# nodejs                        For gulp support
# nginx
# php5
# php5-fpm
RUN apt-get -y install nodejs nginx php5 php5-fpm

# Gulp                          Build process
RUN npm install -g gulp



#
# Set up NGINX
#
# Remove the default Nginx configuration file
RUN rm -v /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default

# Copy a configuration file from the current directory
ADD ./setup/nginx/generic-nginx.conf /etc/nginx/nginx.conf

# Append "daemon off;" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

ADD ./setup/nginx/local-nginx.conf /etc/nginx/sites-enabled/gauntface.conf

# Create symbolic link between enabled and available
RUN ln -s /etc/nginx/sites-enabled/gauntface.conf /etc/nginx/sites-available/gauntface.conf

# Create file to place out output
RUN chgrp -R www-data /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
RUN chmod g+s /usr/share/nginx/html

# Add nginx user to www-data (Nginx us doesn't exist)
# RUN usermod -G www-data nginx

#
# Create safe user
#
# RUN useradd -g www-data gfscriptuser


#
# Get gauntface code
#
# This rm -rf is to make git clone happy.
# This will be changed to CWD /home/gauntface <- This should get code from git
RUN mkdir -p /home/gauntface/
RUN git clone https://github.com/gauntface/gf-site.git /home/gauntface/
COPY ./deploy/docker.sh /docker.sh
RUN /bin/bash -c "source /docker.sh"
RUN rm /docker.sh
# RUN chown gfscriptuser -R /home/gauntface/

# Build site
# This will change to ONBUILD 
RUN cd /home/gauntface/ && npm install
RUN cd /home/gauntface/ && gulp build

#
# Set up the Server / Docker
#
# Expose ports
EXPOSE 80

# Set the default command to execute
# when creating a new container
CMD service php5-fpm start && service nginx start
