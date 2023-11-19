#!/bin/bash
# http://localhost:4201/gmap

# It is a self contained image (/app folder inside of the image)

# Before run this script make shure that you built production "dist" directory by:
# npm run-script buildprod 
# from the 




tag="2.0.0"
img_name="andriykutsevol/rstmap_angular_nginx:${tag}"
container_name="rstmap_angular_nginx_${tag}"

from_release="andriykutsevol/rstmap_angular_rel:${tag}"

#===========================================================================
#===========================================================================


(docker stop $(docker ps -q --filter ancestor=${img_name} ) || true) > /dev/null 2>&1

(docker rm ${container_name} || true) > /dev/null 2>&1

(docker rmi ${img_name} || true) > /dev/null 2>&1


docker build --build-arg RELEASE=${from_release} --progress=plain -t ${img_name} . -f ./Dockerfile_nginx


echo "================================================="

# For release stage
# docker container create -p 4201:4200 -it --name ${names} ${names}

# For nginx stage
docker container create -p 8080:80 -it --name ${container_name} ${img_name}
echo "================================================="


docker start -i ${container_name} 
