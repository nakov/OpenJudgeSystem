#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd ./v20 && nvm use 20 && npm install
cd ../v12 && nvm use 12 && npm install
