#!/bin/sh
PATH=/usr/sbin:/sbin:/usr/bin:/bin
export PATH="$PATH:"/usr/local/bin/

echo "Script executed from: ${npm}"
docker compose -f ${PWD}/containers/blog/postgres/docker-compose.yaml up --remove-orphans -d &&
docker compose -f  ${PWD}/containers/users/mongo/docker-compose.yaml up --remove-orphans -d &&
docker compose -f  ${PWD}/containers/rmq/docker-compose.yaml up --remove-orphans -d &&
docker compose -f  ${PWD}/containers/notifier/docker-compose.yaml up --remove-orphans -d
