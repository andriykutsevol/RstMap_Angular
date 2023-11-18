#!/bin/bash


names="ubuntu_1804_node890_2"



#===========================================================================
#===========================================================================


(docker stop $(docker ps -q --filter ancestor=${names} ) || true) > /dev/null 2>&1

(docker rm ${names} || true) > /dev/null 2>&1

(docker rmi ${names} || true) > /dev/null 2>&1


docker build --progress=plain --no-cache -t ${names} . -f ./dockerfile_ubuntu_1804_node890
# docker build --progress=plain -t ${names} . -f ./dockerfile_ubuntu_1804_node890

echo "================================================="
echo "================================================="


docker container create -it --name ${names} ${names}
echo "================================================="

docker start -i ${names}


#===========================================================================
#===========================================================================
