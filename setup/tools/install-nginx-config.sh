if [ -z "$1" ]
  then
    echo "Please define the path to the config file you would like to use."
    exit
fi

path="$2"
if [ -z "$2" ]
  then
    path="gauntface.conf"
    echo "No name supplied for the config file, so using:"
    echo "    $path"
    echo ""
fi

outputPath="/etc/nginx/sites-enabled/$path"
symbolicLinkPath="/etc/nginx/sites-available/$path"

sudo cp $1 $outputPath
sudo ln -s $outputPath $symbolicLinkPath

# Start / Reload nginx
sudo service nginx stop
sudo service nginx start
