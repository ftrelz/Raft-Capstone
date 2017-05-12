#!/usr/bin/python
import sys
import cgi
import cgitb
cgitb.enable()

sys.stdout.write("Content-Type: text/html\n\n")

print "Hello world!"
