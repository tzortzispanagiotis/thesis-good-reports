#!/bin/bash

if [ $# -eq 0 ]; then
	echo "provide input"
	exit 1
fi
CLI=$1

docker exec $CLI peer chaincode list -C mychannel --instantiated;