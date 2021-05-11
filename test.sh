#!/bin/bash
if [[ ! -n "$1" ]]; then
   echo "Please inform the deviceId"
   exit 1
fi

DEVICE=$1

function updateTracker() {
    DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "Updating Device $DEVICE at LGN $1 LAT $2 at $DATE"
    aws location batch-update-device-position --tracker-name appTracker --updates DeviceId=$DEVICE,Position=$1,$2,SampleTime=$DATE --no-cli-pager
    sleep 15
}

# Vancouver
# updateTracker -123.1268574 49.2632545
# updateTracker -123.1254942 49.2627456
# updateTracker -123.1228227 49.261643
# updateTracker -123.1219242 49.262114
# updateTracker -123.1216613 49.2622426

# Central Park
updateTracker -73.9687025 40.7812239
updateTracker -73.9655804 40.7784516
updateTracker -73.9732386 40.7804954
updateTracker -73.9723238 40.7820603