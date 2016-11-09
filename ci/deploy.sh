#!/usr/bin/env bash

current_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
build_dir="$(cd "build" && pwd)"

privateKey="s/{PRIVATE_KEY}/${PRIVATE_KEY}/g"
privateKeyId="s/{PRIVATE_KEY_ID}/${PRIVATE_KEY_ID}/g"

function setPrivateKey() {
  sed -i "
    ${privateKey};
    ${privateKeyId}
  " ci/gl-naf.json
}

if [ "${CI_BUILD_REF_NAME}" == 'master' ]; then
  setPrivateKey
  gcloud auth activate-service-account \
    --key-file "${current_dir}/gl-naf.json"

  gcloud app deploy \
    --project="gl-naf" \
    --version="0-0-1" \
    --quiet \
    ${build_dir}/app.yaml
fi
