#!/bin/bash

./createChannel.sh
sleep 5;
./installInstantiateFixedAsset.sh
sleep 5;
./instantiateFixedAssetAll.sh
