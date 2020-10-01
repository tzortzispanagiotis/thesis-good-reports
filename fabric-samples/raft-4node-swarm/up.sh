#!/bin/bash


if [ $# -eq 0 ]; then
   echo "provide input"
   exit 1
fi

VAR=$1
FILE="host$VAR.yaml"
echo "$FILE"
docker-compose -f $FILE up -d

~                                                                                                                                                                                                                ~                                                                                                                                                                                                                ~           
