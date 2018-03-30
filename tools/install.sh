#!/bin/bash

pre_install() {
    echo 'installing dependencies'
    sudo apt-get update
    sudo apt-get install -y mongodb
    sudo apt-get install -y node
    sudo apt-get install -y npm
}

start_database() {
    sudo service mongodb start
    echo 'wait for mongodb to start..'
    sleep 1m
}

copy_config() {
    echo 'var config = ' | cat - ./config.json > $1
}

distribute_config() {
    copy_config ../game/src/config.js
    copy_config ../game/ui/config.js
    cp config.json ../server
}

start_server() {
    cd ../server
    npm install
    node app.js > console.log&
}

onboard_mongodb() {
    cd ../tools
    npm install
    node onboard.js
}

#pre_install
start_database
distribute_config
start_server
onboard_mongodb
