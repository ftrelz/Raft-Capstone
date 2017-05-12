#!/bin/bash

sudo systemctl start ssh > /dev/null

# run this mininet instance
sudo mn -v debug --custom ./simple.py --topo mytopo --switch ovsk --controller=remote,ip=192.168.53.69,port=6653

