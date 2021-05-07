#!/bin/bash

DEVICE=$1

function updateTracker() {
    DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "Updating Device $DEVICE at LGN $1 LAT $2 at $DATE"
    aws location batch-update-device-position --tracker-name appTracker --updates DeviceId=$DEVICE,Position=$1,$2,SampleTime=$DATE
    sleep 15
}

updateTracker -123.1254007 49.2612608
updateTracker -123.1258805 49.2611414
updateTracker -123.1260247 49.2609778
updateTracker -123.1259526 49.260764
