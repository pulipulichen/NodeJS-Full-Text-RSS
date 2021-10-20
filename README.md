# NodeJS-Full-Text-RSS
Convert RSS feeds to full text feeds.

npm run start --prefix /app/NodeJS-Full-Text-RSS

local dir
/app/NodeJS-Full-Text-RSS/mount

tmp dir
/app/NodeJS-Full-Text-RSS/cache

----

express.js startup

Internal watch failed: ENOSPC: System limit for number of file watchers reached,

https://stackoverflow.com/a/34664097/6645399
````
sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p
````
----


