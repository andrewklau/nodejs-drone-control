#!/usr/bin/python

# adafruit
from Adafruit_PWM_Servo_Driver import PWM
import time

# redis
from settings import r
import sys

# Initialise the PWM device using the default address
pwm = PWM(0x40)

# Note if you'd like more debug output you can instead run:
#pwm = PWM(0x40, debug=True)

def setServoPulse(channel, pulse):
  pulseLength = 1000000                   # 1,000,000 us per second
  pulseLength /= 60                       # 60 Hz
  print "%d us per period" % pulseLength
  pulseLength /= 4096                     # 12 bits of resolution
  print "%d us per bit" % pulseLength
  pulse *= 1000
  pulse /= pulseLength
  pwm.setPWM(channel, 0, pulse)

pwm.setPWMFreq(60)                        # Set frequency to 60 Hz

if __name__ == '__main__':

    pubsub = r.pubsub()
    pubsub.subscribe('weplay:move')

    while True:
        for item in pubsub.listen():
            print item['data']

            # right
            if item['data'] == '0':
                pwm.setPWM(0, 0, 300)
            # left
            elif item['data'] == '1':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '2':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '3':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '4':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '5':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '6':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '7':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '8':
                pwm.setPWM(0, 0, 300)
            # up
            elif item['data'] == '9':
                pwm.setPWM(0, 0, 300)
