# RaspberryPi (Raspbian Jessie-Lite)

```
sudo apt-get install python-smbus
sudo apt-get install i2c-tools

https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c

sudo i2cdetect -y 0
 If you have a second rev Raspberry Pi, the I2C is on port 1:
sudo i2cdetect -y 1
```

# Cloud Server (CentOS 7)

```
yum update -y

yum -y install httpd
systemctl start httpd.service
systemctl enable httpd.service

curl -sL https://rpm.nodesource.com/setup | bash -
yum -y install nodejs

yum -y install epel-release
yum -y install redis

## set redis to listen to bind to 0.0.0.0
nano /etc/redis/redis.conf

systemctl start redis
systemctl enable redis

cd /var/www/html/
yum -y install git
git clone https://github.com/andrewklau/nodejs-drone-control
```
