# NodeJS Drone Control

This project was a proof of concept to build and control a drone over the internet.

The software components within this project are built with NodeJS using existing modules.

Here's a picture of our drone, with the RaspberryPi 2 and 6 year old Logitech USB webcam
(like a Nokia, it survived a dozen crashes)

![Drone](/action.png)

# Overview

```
|-------------|           |-----------------------|
|   Drone     |           |  controller (cloud)   |
|             |           |                       |
| control     |  ----->   |  base                 |
| stream      |           |  web + presence       |
|             |           |  stream               |
|-------------|           |-----------------------|
```

## controller-base (from rauchg/weplay)

The controller handles the chat and input commands from the online user.

```
npm install
WEPLAY_PORT=3001 WEPLAY_REDIS=localhost:6379 WEPLAY_SERVER_UID=3001 WEPLAY_IP_THROTTLE=1000 node index
```

## controller-web (from rauchg/weplay-web)

The view handles the display web server which displays the content.

```
npm install
NODE_ENV=development WEPLAY_PORT=3000 WEPLAY_REDIS=localhost:6379 WEPLAY_IO_URL=http://localhost:3001 node index
```

## controller-stream (from phoboslab/jsmpeg)

This module runs in the background accepting video stream content from the raspberrypi.

The stream is then displayed over a nodejs webserver that is displayed through the controller-web component.

```
npm install ws
node stream-server.js secretpassword
```

## controller-presence (from rauchg/weplay-presence)

This module simply detects and displays the number of users connected to the drone.

```
npm install
WEPLAY_REDIS=localhost:6379 WEPLAY_INTERVAL=5000 node index
```

## drone-stream

The raspberrypi will stream the content of it's /dev/videoX over HTTP via ffmpeg.

`ffmpeg -s 1280x720 -f video4linux2 -i /dev/video0 -f mpeg1video -b 800k -r 30 http://example.com:8082/secretpassword/1280/720/`

## drone-control2

The raspberrypi will run this python script which will read data from the redis server to accept drone commands.

On each command from the controller the PWM frequencies are updated


# NOTE

POC only!!! This is very insecure, we are running FFMPEG streams and Redis over the internet :c

# Sources

- https://github.com/rauchg/weplay
- http://phoboslab.org/log/2013/09/html5-live-video-streaming-via-websockets
