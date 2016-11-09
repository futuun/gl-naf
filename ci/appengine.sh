#!/usr/bin/env bash

# Installing google cloud SDK
apt-get update -q
apt-get install -q -y --no-install-recommends unzip
wget -q https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.zip
unzip -q google-cloud-sdk.zip
bash google-cloud-sdk/install.sh \
  --usage-reporting=true \
  --path-update=true \
  --bash-completion=false \
  --rc-path=/.bashrc \
  --disable-installation-options
source /.bashrc

#Installing additional gcloud tools
gcloud --quiet components install app-engine-python
