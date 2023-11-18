#!/bin/bash
# http://localhost:4201/gmap

# It is a self contained image (/app folder inside of the image)

# Before run this script make shure that you built production "dist" directory by:
# npm run-script buildprod 
# from the 



from_release="ubuntu_1804_node890_2"

cur_ver="r2.2"
names="rstmap_angular_${cur_ver}"

#===========================================================================
#===========================================================================


(docker stop $(docker ps -q --filter ancestor=${names} ) || true) > /dev/null 2>&1

(docker rm ${names} || true) > /dev/null 2>&1

(docker rmi ${names} || true) > /dev/null 2>&1


docker build --build-arg RELEASE=${from_release} --progress=plain -t ${names} . -f ./Dockerfile_rel


echo "================================================="

# For release stage
# docker container create -p 4201:4200 -it --name ${names} ${names}

# For nginx stage
docker container create -p 8080:80 -it --name ${names} ${names}
echo "================================================="


docker start -i ${names}