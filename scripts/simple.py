from mininet.topo import Topo

class MyTopo(Topo):
  def __init__(self):
    Topo.__init__(self)

    leftHost = self.addHost('h2', ip='10.0.0.2')
    leftSwitch = self.addSwitch('s2')

    self.addLink(leftHost, leftSwitch)

topos = {'mytopo': (lambda: MyTopo())}
