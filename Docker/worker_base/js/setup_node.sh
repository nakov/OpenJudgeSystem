#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm into the shell.

# The order in which dependencies are installed matters:
# - The 'nvm use' command sets the Node.js version for the current shell session
#   by updating the $PATH environment variable.
# - If dependencies are installed first with v20 (20.12.0) and then with v12 (12.22.12),
#   the 'node' binary in /usr/bin/node will point to v12 after the final 'ln -sf' command.
# - Conversely, if dependencies are installed first with v12 and then with v20,
#   /usr/bin/node will point to v20.

# Why this matters:
# If a test requires Node.js v20 but /usr/bin/node points to v12, runtime errors will occur.
# To debug which directories are being searched for 'node', use:
#   echo $PATH
# The shell searches these directories from LEFT to RIGHT for the 'node' binary.

cd ./v12 && nvm use 12.22.12 && npm install
cd ./js-run-spa-in-docker-and-execute-mocha-tests && npm install

cd ../../v20 && nvm use default && npm install
cd ./js-run-spa-in-docker-and-execute-mocha-tests && npm install
