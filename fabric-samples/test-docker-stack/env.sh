#!/bin/bash

export FABRIC_VERSION=1.4.8;
export SYS_CHANNEL=byfn-sys-channel;

docker stack deploy --compose-file docker-compose-stack.yaml fabric;
