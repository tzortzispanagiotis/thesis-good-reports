#!/bin/bash

if [ $# -eq 0 ]; then
	echo "provide input"
	exit 1
fi
CLI=$1

echo "Installing chaincode..."

echo "to peer0.org1..."
docker exec $CLI peer chaincode install -n fixed-asset -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/fixed-asset/node/

echo "to peer0.org2"
docker exec -e CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp -e CORE_PEER_ADDRESS=peer0.org2.example.com:7051 -e CORE_PEER_LOCALMSPID="Org2MSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt $CLI peer chaincode install -n fixed-asset -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/fixed-asset/node/

#echo "Instantiating chaincode on channel..."
docker exec $CLI peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n fixed-asset -v 1.0 -c '{"Args":[]}' -P "AND ('Org1MSP.peer','Org2MSP.peer')"
