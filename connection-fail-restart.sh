#!/bin/bash 
ps auxw | grep node | grep -v grep > /dev/null

if [ $? != 0 ] 
then 
  touch /app/NodeJS-Full-Text-RSS/mount/restart.js > /dev/null 
fi