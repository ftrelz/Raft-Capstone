#!/bin/bash

sudo ovs-vsctl add-port s2 s2-gre1 -- set interface s2-gre1 type=gre options:remote_ip=192.168.53.69

sudo ovs-vsctl add-port s2 s2-gre3 -- set interface s2-gre3 type=gre options:remote_ip=192.168.53.71

sudo ovs-vsctl add-port s2 s2-gre4 -- set interface s2-gre4 type=gre options:remote_ip=192.168.53.72

sudo ovs-vsctl add-port s2 s2-gre5 -- set interface s2-gre5 type=gre options:remote_ip=192.168.53.73
