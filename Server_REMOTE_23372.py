import threading
import socket
import RaftMessages_pb2 as protoc
import sys
import subprocess
import re
import State
import random
import math

class Server:
    def __init__(self):
        self.NodeAddrs = []
        self.Socket = None

        # figure out who we need to listen for
        nodeaddrsfile = open('nodeaddrs.txt', 'r')

        for line in nodeaddrsfile:
            hostaddr = line.split(',')[0]
            socketnum = int(line.split(',')[1].strip('\n'))

            # if we just read our own address from the file
            if hostaddr == self.getownip():
                self.addr = (hostaddr, socketnum)
            else:
                self.NodeAddrs.append((hostaddr, socketnum))

        nodeaddrsfile.close()

        self.StateSemaphore = threading.Semaphore()
        self.StateInfo = State.FollowerState(0)

        # init election timer and transition to CandidateState if it runs out
        self.electionTimeout = random.uniform(8, 10)
        self.timer = threading.Timer(self.electionTimeout, self.transition, ('Candidate',))
        self.timer.start()
        self.heartbeatTimeout = 5
        self.listen()

    def listen(self):
        self.Socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.Socket.bind(self.addr)
        while True:
            data = self.Socket.recv(1024)
            threading.Thread(target=self.messageHandler, args=(data,)).start()

    def selectElectionTimeoutValue(self):
        self.electionTimeout = random.uniform(8, 10)

    def resetTimer(self):
        self.timer.cancel()
        self.selectElectionTimeoutValue()
        self.timer = threading.Timer(self.electionTimeout, self.transition, ['Candidate',])
        self.timer.start()

    def getownip(self):
        result = subprocess.check_output(['ifconfig'], universal_newlines=True)
        ips = re.findall('10\.0\.0\.[0-9]{1,3}', result)
        return ips[0]

    def requestVotes(self):
        for server in self.NodeAddrs:
            messageType,message = self.StateInfo.requestVotes()
            message.toAddr = server[0]
            message.toPort = server[1]
            self.sendMessage(messageType, message)

    def heartbeat(self):
        for server in self.NodeAddrs:
            messageType,message = self.StateInfo.sendHeartbeat()
            message.toAddr = server[0]
            message.toPort = server[1]
            self.sendMessage(messageType, message)
        self.timer = threading.Timer(self.heartbeatTimeout, self.heartbeat)
        self.timer.start()

    def transition(self, state):
        successfulTransition = False
        if self.StateSemaphore.acquire(blocking=False):
            print('Transitioning to ' + state)
            self.timer.cancel()
            if state == 'Follower':
                self.StateInfo = State.FollowerState(self.StateInfo.term)
                # init new election timer
                self.resetTimer()
            elif state == 'Candidate':
                self.StateInfo = State.CandidateState(self.StateInfo.term + 1)
                self.resetTimer()
                self.requestVotes()
            elif state == 'Leader':
                self.StateInfo = State.LeaderState(self.StateInfo.term)
                self.heartbeat()
            self.StateSemaphore.release()
            successfulTransition = True
        return successfulTransition

    def isFollower(self):
        return isinstance(self.StateInfo, State.FollowerState)

    def isCandidate(self):
        return isinstance(self.StateInfo, State.CandidateState)

    def isLeader(self):
        return isinstance(self.StateInfo, State.LeaderState)

    def sendMessage(self, messageType, message):
        print('Sending {} message'.format(messageType))
        message.fromAddr = self.addr[0]
        message.fromPort = self.addr[1]
        outgoingMessage = protoc.WrapperMessage()
        outgoingMessage.type = messageType

        if messageType == protoc.REQUESTVOTE:
            outgoingMessage.rvm.CopyFrom(message)
        elif messageType == protoc.VOTERESULT:
            outgoingMessage.vrm.CopyFrom(message)
        elif messageType == protoc.APPENDENTRIES:
            outgoingMessage.aem.CopyFrom(message)
        elif messageType == protoc.APPENDREPLY:
            outgoingMessage.arm.CopyFrom(message)

        self.Socket.sendto(outgoingMessage.SerializeToString(), (message.toAddr, message.toPort))

    def messageHandler(self, messageData):
        # first thing we do is parse the message data
        outerMessage = protoc.WrapperMessage()
        outerMessage.ParseFromString(messageData)

        if outerMessage.type == protoc.REQUESTVOTE:
            innerMessage = protoc.RequestVote()
            innerMessage = outerMessage.rvm
            messageType = protoc.REQUESTVOTE
        elif outerMessage.type == protoc.VOTERESULT:
            innerMessage = protoc.VoteResult()
            innerMessage = outerMessage.vrm
            messageType = protoc.VOTERESULT
        elif outerMessage.type == protoc.APPENDENTRIES:
            innerMessage = protoc.AppendEntries()
            innerMessage = outerMessage.aem
            messageType = protoc.APPENDENTRIES
        elif outerMessage.type == protoc.APPENDREPLY:
            innerMessage = protoc.AppendReply()
            innerMessage = outerMessage.arm
            messageType = protoc.APPENDREPLY

        # for all servers in all states the first thing we need to check is
        # that our term number is not out of date
        if innerMessage.term > self.StateInfo.term:
            print('Got a higher term number\n\n')
            self.StateInfo.term = innerMessage.term
            self.transition('Follower')
        #TODO: Check if commitindex > last applied after we implement logs

        # if the term number is valid, the normal rules for the current state
        # apply
        replyMessageType, replyMessage = self.StateInfo.handleMessage(messageType, innerMessage)

        if self.isFollower():
            # only responsibility is to respond to messages from Candidates and
            # leaders
            if replyMessageType == protoc.APPENDREPLY and replyMessage.success:
                self.resetTimer()
            self.sendMessage(replyMessageType, replyMessage)
        elif self.isCandidate():
            # if we have something to send then just need to send it
            if replyMessageType is not None:
                self.sendMessage(replyMessageType, replyMessage)
            else:
                # otherwise we got a vote result or a heartbeat
                if self.StateInfo.heardFromLeader:
                    # if heartbeat someone else won
                    self.transition('Follower')
                elif self.StateInfo.votes > (len(self.NodeAddrs) + 1) // 2:
                    # if vote, check to see if we won
                    self.transition('Leader')
        elif self.isLeader():
            # until we implement logs we don't need to do anything here
            pass