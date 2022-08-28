#!/bin/bash 
ps auxw | grep nodemon1 | grep -v grep > /dev/null

if [ $? != 0 ] 
then 
  touch /app/NodeJS-Full-Text-RSS/mount/restart.js > /dev/null 
fi