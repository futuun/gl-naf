#!/usr/bin/env bash

# installing node
curl -sL https://deb.nodesource.com/setup_7.x | bash
apt-get install -y nodejs
apt-get install -y build-essential

# installing yarn
curl -o- -L https://yarnpkg.com/install.sh | bash
export PATH=$PATH:$HOME/.yarn/bin

yarn install
yarn run build
