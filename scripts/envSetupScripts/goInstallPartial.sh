#!/bin/sh

curl -O https://storage.googleapis.com/golang/go1.12.9.linux-amd64.tar.gz
tar -xvf go1.12.9.linux-amd64.tar.gz
sudo chown -R root:root ./go
sudo mv go /usr/local

echo "Now you need to modify ~/.profile"
echo "export GOPATH=$HOME/go"
echo "export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin"
                                                
