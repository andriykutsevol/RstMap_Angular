#!/bin/bash

# !!! Docker Desktop file sharing make shure that path to the volume's folder is shared.


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
base_tag="2.0.0"
from_release="andriykutsevol/rstmap_angular_rel:${base_tag}"

tag="2.0.0"
img_name="rstmap_angular_dev:${tag}"

container_name="rstmap_angular_dev"

vol_name="rstmap_angular_dev_vol"



read -p "! Do you want to replace the contend of the ./app folder to ${release} content? (y/n) " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then

    #===========================================


    (docker stop $(docker ps -q --filter ancestor=${img_name} ) || true) > /dev/null 2>&1

    (docker rm ${container_name} || true) > /dev/null 2>&1

    (docker rmi ${img_name} || true) > /dev/null 2>&1

    
    docker build --no-cache --build-arg RELEASE=${from_release} --progress=plain -t ${img_name} . -f ./Dockerfile_dev


    #==========================================

    cd ./app
    # Remove all including hidden files
    #ls -A1 | xargs rm -rf
    # It will also work if blanks in the filenames
    ls -A1 | xargs -I{} rm -rf {}
    cd ..
    sleep 1

    #===========================================


    if [ "volumeExists ${vol_name}" ]
    then
        echo "vol del"
        docker volume rm ${vol_name}
    fi

    sleep 2

    docker volume create \
    --driver local \
    --opt type=none \
    --opt device=$(pwd)/app \
    --opt o=bind \
    ${vol_name}

    sleep 2

    echo "================================================="
    echo "container create"

    docker container create -p 4201:4200 -it -v ${vol_name}:/app --name ${container_name} ${img_name}
    sleep 2

    echo "================================================="
    echo "container start"

    docker start -i ${container_name}

fi


