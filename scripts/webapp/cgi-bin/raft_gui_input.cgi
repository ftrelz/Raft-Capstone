#!/usr/bin/python
import os
import sys
import requests
import cgi
import cgitb
import time
import json
cgitb.enable()

def main():
    nodes = []
    with open('/home/fred/webdev/learning/Raft-Capstone/cgi-bin/nodeaddrs.txt', 'r') as fp:
        for line in fp:
            nodes.append(line.split(',')[0])
    #print os.environ['QUERY_STRING']
    vars = parseRequestURL(os.environ['QUERY_STRING'])
    for addr in nodes:
        try:
            contactRaft(addr.strip(), vars['direction'])
        except requests.Timeout as e:
            pass
    # give raft instances time to post their logs
    time.sleep(0.5)
    for file in os.listdir('/home/fred/webdev/learning/Raft-Capstone/cgi-bin/'):
        if 'logfile' in file:
            with open(file, 'r') as fp:
                print json.JSONEncoder().encode(json.load(fp))

def contactRaft(ipAddr, direction):
    try:
        response = requests.get("http://{}:8080/?direction={}".format(ipAddr, direction), timeout=1)
    except Exception as e:
        pass

def logString(string):
    with open('raft_gui_cgi.log', 'a+') as fp:
        fp.write('{}: {}\n'.format(time.now(), string))

def parseRequestURL(url):
    #pairs = url.split('&')
    vars = {}
    #for pair in pairs:
    key = url.split('=')[0]
    value = url.split('=')[1]
    vars[key] = value
    return vars

print 'Content-Type: text/json'
print
main()
 
