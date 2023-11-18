#!/bin/bash


function volumeExists {
  if [ "$(docker volume ls -f name=$1 | awk '{print $NF}' | grep -E '^'$1'$')" ] 
  then
    echo "ok"
    return 0
  else
    echo "no"
    return 1
  fi
}



# It uses /app from the release image (/app copied from the image to /app folder on the host)


# !!! When we run this script, all contents of ./app will be prewritten from the release. !!!
base_tag
from_release="rstmap_angular_r2.0"


names="rstmap_angular_dev"

read -p "! Do you want to replace the contend of the ./app folder to ${release} content? (y/n) " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then

    #===========================================


    (docker stop $(docker ps -q --filter ancestor=${names} ) || true) > /dev/null 2>&1

    (docker rm ${names} || true) > /dev/null 2>&1

    (docker rmi ${names} || true) > /dev/null 2>&1

    
    docker build --no-cache --build-arg RELEASE=${from_release} --progress=plain -t ${names} . -f ./Dockerfile_dev


    #==========================================

    #rm -f -R ./app/*
    #rm -f -R ./app/.* > /dev/null 2>&1
    cd ./app
    # Remove all including hidden files
    #ls -A1 | xargs rm -rf
    # It will also work if blanks in the filenames
    ls -A1 | xargs -I{} rm -rf {}
    cd ..
    sleep 1

    #===========================================


    if [ "volumeExists 'rstmap_angular_dev'" ]
    then
        echo "vol del"
        docker volume rm rstmap_angular_dev
    fi

    sleep 2

    docker volume create \
    --driver local \
    --opt type=none \
    --opt device=$(pwd)/app \
    --opt o=bind \
    rstmap_angular_dev

    sleep 2

    echo "================================================="
    echo "container create"

    docker container create -p 4201:4200 -it -v rstmap_angular_dev:/app --name ${names} ${names}
    sleep 2

    echo "================================================="
    echo "container start"

    docker start -i ${names}

fi


