#!/usr/bin/python
import os
import time
import requests
import json

lastModTime = 0

def main():
    while True:
        global lastModTime
        for file in os.listdir('..'):
            if 'logfile' in file:
                newTime = os.stat('../' + file).st_mtime
                if newTime != lastModTime:
                    postNewLog('../' + file)
                lastModTime = newTime
                break

        time.sleep(0.2)

def postNewLog(filePath):
    with open(filePath, 'r') as fileDesc:
        logFileName = filePath[3:]
        try:
            response = requests.post('http://192.168.53.1/cgi-bin/raft_log_post.cgi?logfile=' + logFileName, json=json.load(fileDesc))
            fileDesc.seek(0)
            print
            print json.load(fileDesc)
            print
            print response.text
            outfile = open('response.html', 'w')
            outfile.write(response.text)
        except Exception:
            pass

main()
