import server
import RequestVote_pb2
import random
import threading
import queue

OutQueue = queue.Queue()
InQueue = queue.Queue()

class Participant:
  self __init__(self):
    self.termNumber
    self.numNodes

class CandidateNode:
  self __init__(self):
    Participant.__init__(self)
    self.electionTimeout
    self.votes
    self.timer

  def requestVotes():
      for server in self.nodeaddrs:
         message = RequestVote_pb2.RequestVote()
         # How are we going to do this?
         # message.from = self.addr
         OutQueue.put_nowait(RequestVote_pb2)

  def selectTimeout():
      self.electionTimeout = random.uniform(0.150,0.300)

  def transToLeader():

  def transToFollower():

  def initTimer():
      self.timer = threading.Timer(self.electionTimeout, ).start()

class FollowerNode():
    self __init__(sef):
        Participant.__init__(self)
        self.electionTimeout

    def selectTimeout():
        self.electionTimeout = random.uniform(0.150,0.300)

    def appendEnrtyReply():


    def requestVoteReply():

    def transToCandidate():

    def initTimer():
        self.timer = threading.Timer(self.electionTimeout, ).start()