#!/bin/bash


../bin/cryptogen generate --config=./crypto-config.yaml

for KEY in $(find crypto-config -type f -name "*_sk"); do
    KEY_DIR=$(dirname ${KEY})
    mv ${KEY} ${KEY_DIR}/key.pem
done
