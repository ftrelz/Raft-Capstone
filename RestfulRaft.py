import requests
import socket
import threading

class RestAPI():
    def __init__(self, serverCallback):
        # start up server to listen for API calls
        self.listenSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.serverCallback = serverCallback

    def start(self):
        self.mainServerLoop()

    def mainServerLoop():
        self.listenSocket.bind(("0.0.0.0", 8080))
        self.listenSocket.connect()
        while True:
            clientAddr = self.listenSocket.accept(5)
            threading.Thread(target=self.handleConnection, args=(clientAddr,)).start()

    def handleConnection(clientConn):
        clientSocket = clientConn[0]
        clientSocket = clientConn[1]

        data = clientSocket.recv(4096)
        requestVars = parseRequestURL(data)
        # for now (legacy symposium demo purposes) we only handle one key and
        # one value (direction=...)
        self.servercallback(requestVars["direction"])
        clientSocket.close()

    # takes in the url string and parses out keys and values based on normal
    # POST url formatting (i.e. key=value pairs after first ? in url and key
    # value pairs separated by &)
    # returns a python dictionary with url keys as keys and url values as values
    def parseRequestURL(url):
        pairs = url.split('?')[1].split('&')
        vars = {}
        for pair in pairs:
            key = pair.split('=')[0]
            value = pair.split('=')[1]
            vars[key] = value
        return vars
