#!/bin/bash

echo "1" > /proc/sys/net/ipv4/ip_forward
iptables -F
iptables -t nat -F
iptables -t nat -A POSTROUTING -o eth2 -j MASQUERADE

exit
