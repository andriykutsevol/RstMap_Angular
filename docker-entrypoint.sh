#!/bin/bash
if [ $1 == "release" ]
then
    echo "docker-entrypoint.sh: release"

    #-----------------------------------------
    # We are installing all in dev version.
    # We also could install it from the Docker_rel.

    source /root/.bashrc

    echo '$NVM_DIR: ' $NVM_DIR      # Это нормально соурсается из .bashrc, но код ниже, не запускается.
                                      Поэтому запускаем его тут вручную

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    #-----------------------------------------

    # This will remove the 'dist' folder.
    npm run-script serveprod
    
    # This will rebuild the 'dist' folder.
    # npm run-script buildprod

fi


if [ $1 == "development" ]
then
    echo "docker-entrypoint.sh: development"

    /bin/bash
    # Then run "npm start" manually
fi



if [ $1 == "" ]
then
    echo "docker-entrypoint.sh error"
    echo "you have to specify docket-entrypoint.sh action."
    echo "exit"
fi