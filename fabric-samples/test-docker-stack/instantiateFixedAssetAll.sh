#!/bin/bash
if [ $# -eq 0 ]; then
	echo "provide input"
	exit 1
fi
CLI=$1
# from peer0.org1
docker exec $CLI peer chaincode query -n fixed-asset -C mychannel -c '{"Args":["getAsset", "15"]}'

# from peer0.org2
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp -e CORE_PEER_ADDRESS=peer0.org2.example.com:7051 -e CORE_PEER_LOCALMSPID="Org2MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt $CLI peer chaincode query -n fixed-asset -C mychannel -c '{"Args":["getAsset","CAR0"]}'
