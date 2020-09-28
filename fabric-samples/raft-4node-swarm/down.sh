#!/bin/bash

if [ $# -eq 0 ]; then
   echo "provide input"
   exit 1
fi

VAR=$1
FILE="host$VAR.yaml"

docker-compose -f $FILE down

docker rm $(docker ps -aq)

docker rmi $(docker images dev* -q)

docker volume prune
