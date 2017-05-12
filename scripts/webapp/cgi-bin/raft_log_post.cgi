#!/usr/bin/python
import sys
import os
import json
import cgi
import cgitb
cgitb.enable()

def main():    
    try:
        logFileNumber = int(os.environ['QUERY_STRING'][15])
    except Exception as e:
        raise e

    with open('/home/fred/webdev/learning/Raft-Capstone/cgi-bin/logfile' + str(logFileNumber) + '.json', 'w+') as fp:
        fileContent = sys.stdin.read(int(os.environ['CONTENT_LENGTH']))
        fp.write(fileContent)
        print fileContent

print 'Content-Type: text/html'
print
main()


