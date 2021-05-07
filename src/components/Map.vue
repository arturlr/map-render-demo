<template>
  <div>
    <div id="markmap" style="width: 100%;height: 40vw"></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { Auth } from "aws-amplify";
import awsconfig from '../aws-exports'
import { Signer } from "@aws-amplify/core";

export default {
  name: "Map",
  props: ['row'],
  data() {
    return {
      credentials: null
    };
  },  
  async mounted() {        
    this.credentials = await Auth.currentCredentials(); 
    this.initMap();    
  },
  methods: {
    transformRequest(url,resourceType){  
        if (resourceType === "Style" && !url.includes("://")) {
            // resolve to an AWS URL
            url = "https://maps.geo." + awsconfig.aws_project_region + ".amazonaws.com/maps/v0/maps/" + url +"/style-descriptor";            
        }
        if (url.includes("amazonaws.com")) {            
            // only sign AWS requests (with the signature as part of the query string)
            return {
                url: Signer.signUrl(url, {
                    access_key: this.credentials.accessKeyId,
                    secret_key: this.credentials.secretAccessKey,
                    session_token: this.credentials.sessionToken,
                }),
            };
        }
        // Don't sign
        return { url: url || "" };
    },

    async initMap() {
      var LngLat = new mapboxgl.LngLat(this.row.lastLocation.lng, this.row.lastLocation.lat);
      let map = new mapboxgl.Map({
            container: "markmap",
           //Specify the centre of the map when it gets rendered
            center: LngLat, 
            zoom: 15, //Adjust the zoom level
            style: process.env.VUE_APP_MAP_NAME,
            transformRequest: this.transformRequest
        });
        //Zoom in and out button
        map.addControl(new mapboxgl.NavigationControl(), "top-left"); 
        //A button that allows the map to fly to user’s current location when pressed
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
            })
        );
        //Backend of marker and draw tool can be done later when we add geocoding and drawing function!
        const marker = new mapboxgl.Marker()
          .setLngLat(LngLat)
          .addTo(map);
        console.log(marker);
    },
  },
};
</script>
