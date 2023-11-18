#!/bin/bash

tag="0.0.2"
img_name="andriykutsevol/ubuntu_1804_node890:${tag}"
container_name="ubuntu_1804_node890_${tag}"


#===========================================================================
#===========================================================================


(docker stop $(docker ps -q --filter ancestor=${img_name} ) || true) > /dev/null 2>&1

(docker rm ${container_name} || true) > /dev/null 2>&1

(docker rmi ${img_name} || true) > /dev/null 2>&1

# --no-cache
docker build --progress=plain -t ${img_name} . -f ./dockerfile_ubuntu_1804_node890
# docker build --progress=plain -t ${names} . -f ./dockerfile_ubuntu_1804_node890

echo "================================================="
echo "================================================="


docker container create -it --name ${container_name} ${img_name}
echo "================================================="

docker start -i ${container_name}


#===========================================================================
#===========================================================================

# Отэтот префикс "andriykutsevol/" он обеспечивает в какой реп на хабе пушить. (это мой реп на хабе)
# $ docker image tag ubuntu_1804_node890_2:latest andriykutsevol/ubuntu_1804_node890:0.0.2

# docker push <DOCKER_HUB_USERNAME/IMAGE_NAME[:tag]>
# docker push andriykutsevol/ubuntu_1804_node890:0.0.2
    # Это создает/перезаписывает образ на хабе.