#!/usr/bin/python

# redis
from settings import r
import sys


if __name__ == '__main__':

    pubsub = r.pubsub()
    pubsub.subscribe('weplay:move')

    while True:
        for item in pubsub.listen():
            print item['data']

            # right
            if item['data'] == '0':
                print "right key pressed"
            # left
            elif item['data'] == '1':
                print "left key pressed"
