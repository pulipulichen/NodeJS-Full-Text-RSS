# NodeJS-Full-Text-RSS
Convert RSS feeds to full text feeds.

npm run start --prefix /app/NodeJS-Full-Text-RSS

local dir
/app/NodeJS-Full-Text-RSS/mount

tmp dir
304-full-text-rss-cache
/app/NodeJS-Full-Text-RSS/cache

----

express.js startup

Internal watch failed: ENOSPC: System limit for number of file watchers reached,

https://stackoverflow.com/a/34664097/6645399
````
sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p
````
----


Private Document

https://docs.google.com/document/d/1MZxjE5HVp7SiPItnApA_1p7wpPy3DsoZ4Bx5rlIF1eg/edit