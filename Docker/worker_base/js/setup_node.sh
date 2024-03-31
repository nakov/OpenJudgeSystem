#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd ./v20 && nvm use default && npm install
cd ./js-run-spa-in-docker-and-execute-mocha-tests && npm install

cd ../../v12 && nvm use 12.22.12 && npm install
cd ./js-run-spa-in-docker-and-execute-mocha-tests && npm install
