#!/bin/sh
PATH=/usr/sbin:/sbin:/usr/bin:/bin
export PATH="$PATH:"/usr/local/bin/

if [ -e ${PWD}/containers/users/mongo/.env ]
then
    echo "${PWD}/containers/users/mongo/.env exists"
else
    cp ${PWD}/containers/users/mongo/.env.sample ${PWD}/containers/users/mongo/.env
    echo "${PWD}/containers/users/mongo/.env created"
fi

if [ -e ${PWD}/containers/rmq/.env ]
then
    echo "${PWD}/containers/rmq/.env exists"
else
    cp ${PWD}/containers/rmq/.env.sample ${PWD}/containers/rmq/.env
    echo "${PWD}/containers/rmq/.env created"
fi

if [ -e ${PWD}/containers/notifier/.env ]
then
    echo "${PWD}/containers/notifier/.env exists"
else
    cp ${PWD}/containers/notifier/.env.sample ${PWD}/containers/notifier/.env
    echo "${PWD}/containers/notifier/.env created"
fi

if [ -e ${PWD}/containers/blog/postgres/.env ]
then
    echo "${PWD}/containers/blog/postgres/.env exists"
else
    cp ${PWD}/containers/blog/postgres/.env.sample ${PWD}/containers/blog/postgres/.env
    echo "${PWD}/containers/blog/postgres/.env created"
fi

if [ -e ${PWD}/apps/gateway/src/app/jwt/.env ]
then
    echo "${PWD}/apps/gateway/src/app/jwt/.env exists"
else
    cp ${PWD}/apps/gateway/src/app/jwt/.env.sample ${PWD}/apps/gateway/src/app/jwt/.env
    echo "${PWD}/apps/gateway/src/app/jwt/.env created"
fi

docker compose -f ${PWD}/containers/blog/postgres/docker-compose.yaml up -d &&
docker compose -f ${PWD}/containers/users/mongo/docker-compose.yaml up -d &&
docker compose -f ${PWD}/containers/rmq/docker-compose.yaml up -d &&
docker compose -f ${PWD}/containers/notifier/docker-compose.yaml up -d
