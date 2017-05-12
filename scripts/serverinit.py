#!/usr/bin/python
from mininet.net import Mininet
from mininet.node import OVSKernelSwitch
from mininet.node import RemoteController
from mininet.topo import SingleSwitchTopo
from mininet.cli import CLI

def runraft(net):
    for host in net.hosts:
        host.cmd('cd ../')
        host.cmd('python3 test.py')

if __name__ == '__main__':
    OVSKernelSwitch.setup()
    network = Mininet( SingleSwitchTopo(), switch=OVSKernelSwitch )
    network.addHost('h1')
    network.addSwitch('s1')
    network.start()
    print("network started")
    CLI( network )
    runraft(network)
    network.stop()
    print("network stopped")

