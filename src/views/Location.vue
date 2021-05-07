<template>
  <div class="q-pa-md">
    <q-table
      :visible-columns="visibleColumns"
      title="Location"
      :data="data"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
    >

      <template v-slot:body-cell-mapAction="props">
        <q-td :props="props">
          <q-btn dense round flat color="black" @click="toggleShowMap(props)" icon="map"></q-btn>
        </q-td>          
      </template>

      <template v-slot:top>
        <q-btn
          class="bg-primary text-white q-my-md"
          label="Add"
          @click="toggleAddRow"
        />
        <q-separator dark vertical />
        <q-btn
          class="bg-primary text-white q-my-md"
          label="Remove"
          @click="toggleRemoveRow"
        />
        <q-space />
      </template>
    </q-table>

    <q-dialog v-model="b_addrow" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add GeoFence</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label="Name"
            hint="Name"
            v-model="name"
            autofocus
            @keyup.enter="prompt = false"
          />

        </q-card-section>
        <q-card-actions v-if="tabledata === null" align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add Record" v-close-popup @click="saveRow" />
        </q-card-actions>
        <q-card-section>

          <q-select    
              outlined          
              v-model="country"
              :options="countriesList"
              label="Country"
              option-value="alpha-3"
              option-label="name"
              emit-value
              map-options
            />

          <q-select  v-if="tabledata === null"
            v-model="location" 
            :options="options" 
            label="City"
            outlined
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterFn"
            @input-value="setModel"
            @input="setPlaceOnMap"
            emit-value
            map-options
            >
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>

            <template v-slot:hint>
              City where the geofence will be placed
            </template>
        </q-select>

          <!-- <q-input color="orange" standout bottom-slots type="text" label="City" v-model="location" counter clearable>
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
          </q-input>
          <ul>
            <li v-for="(result, i) in searchResults" :key="i">
              {{ result }}
            </li>
          </ul> -->
        </q-card-section>

        <q-card-section>
          <GeoFence :row="tabledata"/>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { Auth } from "aws-amplify";
import awsconfig from '../aws-exports'
import Location from "aws-sdk/clients/location";

import GeoFence from '../components/GeoFence'
import iso3166 from '../assets/iso-3166.json'

export default {
  name: "Location",
  components: {
    GeoFence
  },
  data() {
    return {
      location: null,
      service: null,
      tabledata: null,
      searchResults: [],
      options: null,
      selected: [],
      b_addrow: false,
      b_removerow: false,
      result: null,
      name: null,
      country: null,
      countriesList: iso3166,
      visibleColumns: [ 'geoFenceName', 'mapAction' ],
      columns: [
        {
          name: "id",
          field: "id",
        },
        {
          name: "geoFenceName",
          label: "name",
          field: "geoFenceName",
          sortable: true,
          align:'left'
        },
        {
          name: "boundary",
          label: "Location",
          field: "boundary",
          sortable: false,
        },
        { name: 'mapAction', 
          label: 'Map', 
          field: '', 
          align:'center' 
        },
      ],
      data: [],
    };
  },  
  computed: {
    ...mapState({
      locationList: (state) => state.general.locationList
    }),
    ...mapGetters({
      isAuthenticated: "profile/isAuthenticated",
      polygonVertices: "general/polygonVertices"
    }),
  },
  watch: {
    location (newValue) {
      const countryArray = [];
      countryArray.push(this.country)
        if (newValue) {
          this.service.searchPlaceIndexForText({
            IndexName: process.env.VUE_APP_PLACE_INDEX_NAME,
            FilterCountries: countryArray,
            Text: this.location,
          }, this.displaySuggestions)
        }
    }
  },
  async mounted() {
    this.credentials = await Auth.currentCredentials();
    this.initLocationService();
    await this.loadTable();
  },
  methods: { 
    filterFn (val, update) {
      update(() => {
        this.options = this.searchResults
      })
    },

    setModel (val) {
      this.location = val
    },

    toggleAddRow() {
      this.resetVariables();
      this.b_addrow = !this.b_addrow;
    },
    toggleRemoveRow() {
      this.b_addrow = !this.b_addrow;
    },
    resetVariables() {
      this.name= ''
      this.tabledata = null;
      this.location = null;
    },

    toggleShowMap(param) {
      this.name = param.row.geoFenceName;
      this.tabledata = param.row;
      this.b_addrow = !this.b_addrow;
    },

    async loadTable() {
      await this.$store.dispatch("general/fetchGeoFenceItems", { credentials: this.credentials }); 
      this.data = this.locationList     
    },

    async saveRow() {

      if (this.name == null || this.polygonVertices == null) {
        this.$q.notify({
          color: "negative",
          position: "top",
          timeout: 5000,
          icon: "warning",
          message: "Warning: you have to add a name and define the geofence vertices",
        });

      }
      try {
        //console.log(this.polygonVertices)

        this.$store.dispatch("general/saveGeoFence", { 
            name: this.name, 
            polygonVertices: this.polygonVertices, 
            credentials: this.credentials 
        }); 

        await this.$store.dispatch("general/saveLocation", {
            name: this.name
        });

        this.resetVariables();
        this.loadTable();

      } catch (error) {
        console.error(error);
        this.$q.notify({
          color: "negative",
          position: "top",
          timeout: 5000,
          icon: "warning",
          message: "Error: " + error,
        });
      }

    },

    removeRow() {
      // this.loading = true
      // setTimeout(() => {
      //   const index = Math.floor(Math.random() * this.data.length)
      //   this.data = [ ...this.data.slice(0, index), ...this.data.slice(index + 1) ]
      //   this.loading = false
      // }, 500)
    },

    initLocationService() {
       this.service = new Location({
          credentials: this.credentials,
          region: awsconfig.aws_project_region,
     });
    },

    displaySuggestions (err, data) {
      this.searchResults = [];
      if (data !== null) {
        for (var i = 0; i < data.Results.length; i++) {       
          this.searchResults.push({
            label: data.Results[i].Place.Label,
            value: data.Results[i].Place.Geometry.Point
            })          
          }
      }  
    },

    setPlaceOnMap(payload) {
      this.$store.dispatch("general/setPlace", { place: payload });
    },


  }
};
</script>
