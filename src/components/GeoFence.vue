<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import maplibre from "maplibre-gl";
// import MapboxDraw from "@mapbox/mapbox-gl-draw/index";
import { Auth } from "aws-amplify";
import aws_exports from "../aws-exports";
import { Signer } from "@aws-amplify/core";
import { mapState } from "vuex";
import areaPolygon from "area-polygon";

export default {
  name: "GeoFence",
  props: ["row"],
  data() {
    return {
      map: null,
      geocoder: null,
      draw: null
    };
  },
  computed: {
    ...mapState({
      place: (state) => state.general.place,
    }),
  },
  watch: {
    place: function() {
      this.map.jumpTo({ center: [this.place[0], this.place[1]], zoom: 15 });
    },
  },
  async mounted() {
    this.credentials = await Auth.currentCredentials();
    this.initMap();   
    if (this.row && this.row.GeofenceId != null) {
      this.renderGeofence(this.row.Geometry.Polygon[0], this.row.GeofenceId)
    }
    else if (this.row && this.row.geoFenceName != null) {
      this.renderGeofence(this.row.boundary[0], this.row.geoFenceName)
    }
    else {
      this.enablePolygon()
    }
  },
  methods: {
    transformRequest(url, resourceType) {
      if (resourceType === "Style" && !url.includes("://")) {
        // resolve to an AWS URL
        url =
          "https://maps.geo." +
          aws_exports.aws_project_region +
          ".amazonaws.com/maps/v0/maps/" +
          url +
          "/style-descriptor";
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
      var zoom = 2;
      var lat = 0;
      var lng = 0;

      this.map = new maplibre.Map({
        container: "map",
        //Specify the centre of the map when it gets rendered
        center: [lat, lng],
        zoom: zoom, //Adjust the zoom level
        style: process.env.VUE_APP_MAP_NAME,
        transformRequest: this.transformRequest,
      });
      //Zoom in and out button
      this.map.addControl(new maplibre.NavigationControl(), "top-left");
      //A button that allows the map to fly to user’s current location when pressed
      this.map.addControl(
        new maplibre.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
    },

    enablePolygon() {
      // this.draw = new MapboxDraw({
      //   displayControlsDefault: false,
      //   controls: {
      //     polygon: true,
      //     trash: true,
      //   },
      // });
      this.map.addControl(this.draw);

      this.map.on("draw.create", this.updateArea);
      this.map.on("draw.delete", this.updateArea);
      this.map.on("draw.update", this.updateArea);
    },

    updateArea() {
      var data = this.draw.getAll();
      if (data !== null && data.features.length > 0) {        
        let geometry = data.features[0].geometry.coordinates[0];
        let area = areaPolygon(geometry,true)
        if (area < 0) {
          // reversing counter-clockwise coordinates will make them clockwise
          console.log("reversing");
          geometry = geometry.slice().reverse();
        }
        this.$store.dispatch("general/setVertices", { vertices: geometry });
      }
    },

    renderGeofence(coordinates, id) {
       var vmap = this.map 
       var param = { 'type': 'geojson',
                'data': {'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [coordinates]                                  
                    }
                }
       }   
       console.log(param)

        vmap.on('load',function(){
            if(vmap.getLayer(id)) vmap.removeLayer(id)
            if(vmap.getSource(id)) vmap.removeSource(id)
        })
        vmap.on('load', function () {
            vmap.addSource(id, param);
            vmap.addLayer({
                'id': id,
                'type': 'fill',
                'source': id,
                'layout': {},
                'paint': {
                    'fill-color': '#4db2fa',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.4
                    ]
                }
            });
        });

        vmap.jumpTo({ center: [coordinates[0][0],coordinates[0][1]], zoom: 15 }); 

    }
  },
};
</script>

<style>
#map {
  width: 33vw;
  height: 45vw;
}
</style>
