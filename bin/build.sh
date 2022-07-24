#!/bin/bash -e
cd ~/apps/agile/si-research-fe

export PATH=/home/ubuntu/.nvm/versions/node/v12.22.12/bin:/usr/bin;


git reset --hard && git pull

/home/ubuntu/.nvm/versions/node/v12.22.12/bin/yarn

/home/ubuntu/.nvm/versions/node/v12.22.12/bin/ng build --configuration=test
