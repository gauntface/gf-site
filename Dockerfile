############################################################
# Dockerfile to build Nginx Installed Containers
# Based on Ubuntu
# Build with: docker build -t gf-site-img .
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
# php5-curl                     Used by twitter oauth
# php5-mysql                    DB
# php-apc                       APC Cache
# php5-imagick                  Needed for image resizing
# pngcrush                      PNGCrush is used to optimise png images
RUN apt-get -y install software-properties-common curl git nano php5-curl php5-mysql php-apc php5-imagick pngcrush


#
# Add repos
#
RUN add-apt-repository ppa:nginx/development
RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash -


# Run apt-get update so we can find all packages we need
RUN apt-get update


# nodejs                        For gulp support
# nginx                         Nginx is nginx
# php5                          Need the php
# php5-fpm                      Need fpm-php
# build-essential               Needed for phantomjs - used by uncss
RUN apt-get -y install nodejs nginx php5 php5-fpm build-essential

# Prevent PHP version being shared via headersg
RUN sed -i -e "s/expose_php = On/expose_php = Off/g" /etc/php5/fpm/php.ini

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

RUN mkdir -p /home/gauntface
COPY . /home/gauntface
WORKDIR /home/gauntface

# Install depencies of Material Palette
RUN cd ./src/scripts/third_party/material-palette && npm install

#
# Set up the Server / Docker
#
# Expose ports
EXPOSE 80

# Set the default command to execute
# when creating a new container
ONBUILD CMD service php5-fpm start && nginx -g 'daemon off;'
