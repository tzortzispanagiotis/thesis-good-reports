#!/bin/bash

rm -f ./channel-artifacts
export FABRIC_CFG_PATH=$PWD

mkdir channel-artifacts

../bin/configtxgen -profile OrdererGenesis -channelID $SYS_CHANNEL -outputBlock ./channel-artifacts/genesis.block

../bin/configtxgen -profile ChannelConfig -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel

../bin/configtxgen -profile ChannelConfig -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

../bin/configtxgen -profile ChannelConfig -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

