#!/usr/bin/env bash


docker run -d \
    -p 27018:27017 \
    --name mongodb-fake-data \
    -v /Users/yacine/Code/data/mongo-data:/data/db \
    -e MONGODB_INITDB_ROOT_USERNAME=yacine \
    -e MONGODB_INITDB_ROOT_PASSWORD=yacine \
    mongo:latest
