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
  #pulseLength /= 60                       # 60 Hz
  pulseLength /= 50
  print "%d us per period" % pulseLength
  pulseLength /= 4096                     # 12 bits of resolution
  print "%d us per bit" % pulseLength
  pulse *= 1000
  pulse /= pulseLength
  pwm.setPWM(channel, 0, pulse)

pwm.setPWMFreq(50)                        # Set frequency to 50 Hz

if __name__ == '__main__':

    pubsub = r.pubsub()
    pubsub.subscribe('weplay:move')

    # These PWM signals are tuned for DJI NAZA lite flight controller
    
    while True:
        for item in pubsub.listen():
            print item['data']

            # right
            if item['data'] == '0':
                pwm.setPWM(1, 0, 400)
                pwm.setPWM(2, 0, 300)
                pwm.setPWM(4, 0, 300)
            # left
            elif item['data'] == '1':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 200)
                pwm.setPWM(4, 0, 300)
            # up
            elif item['data'] == '2':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 400)
                pwm.setPWM(4, 0, 300)
            # down
            elif item['data'] == '3':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 400)
                pwm.setPWM(4, 0, 300)
            # yawleft
            elif item['data'] == '4':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 300)
                pwm.setPWM(4, 0, 200)
            # yawright
            elif item['data'] == '5':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 300)
                pwm.setPWM(4, 0, 400)
            # calibrate
            elif item['data'] == '6':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 300)
                pwm.setPWM(3, 0, 300)
                pwm.setPWM(4, 0, 300)
            # startup
            elif item['data'] == '7':
                pwm.setPWM(1, 0, 200)
                pwm.setPWM(2, 0, 200)
                pwm.setPWM(3, 0, 200)
                pwm.setPWM(4, 0, 200)

                time.sleep(1)

                pwm.setPWM(1, 0, 200)
                pwm.setPWM(2, 0, 200)
                pwm.setPWM(3, 0, 300)
                pwm.setPWM(4, 0, 200)
            # hover
            elif item['data'] == '8':
                pwm.setPWM(1, 0, 300)
                pwm.setPWM(2, 0, 300)
                pwm.setPWM(3, 0, 300)
                pwm.setPWM(4, 0, 300)
            # stop
            elif item['data'] == '9':
                time.sleep(1)
            # t0
            elif item['data'] == 'a':
                pwm.setPWM(3, 0, 0)
            # t1
            elif item['data'] == 'b':
                pwm.setPWM(3, 0, 300)
            # t2
            elif item['data'] == 'c':
                pwm.setPWM(3, 0, 300)
            # t3
            elif item['data'] == 'd':
                pwm.setPWM(3, 0, 300)
            # t4
            elif item['data'] == 'e':
                pwm.setPWM(3, 0, 300)
            # t5
            elif item['data'] == 'f':
                pwm.setPWM(3, 0, 300)
            # t6
            elif item['data'] == 'g':
                pwm.setPWM(3, 0, 300)
            # t7
            elif item['data'] == 'h':
                pwm.setPWM(3, 0, 300)
            # t8
            elif item['data'] == 'i':
                pwm.setPWM(3, 0, 300)
            # t9
            elif item['data'] == 'j':
                pwm.setPWM(3, 0, 400)
