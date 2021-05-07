<template>
  <div class="q-pa-md">
    <q-table
      :visible-columns="visibleColumns"
      title="User/Devices"
      :data="data"
      :columns="columns"
      row-key="id"
      selection="single"
      :selected.sync="selected"
    >
    
      <template v-slot:body-cell-mapPosition="props">
        <q-td :props="props">
          <q-btn dense round flat color="black" @click="toggleShowMap(props)" icon="map"></q-btn>
        </q-td>          
      </template>

      <template v-slot:body-cell-mapGeoFence="props">
        <q-td :props="props">
          <q-btn dense round flat :label="props.row.geoFenceName " color="black" @click="toggleShowGeoFence(props)" icon="map"></q-btn>
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

    <q-dialog v-model="b_map" persistent>
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Last Position</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle2">Updated at: {{ deviceUpdatedAt }}</div>
        </q-card-section>
        <q-card-section>
          <Map :row="tabledata"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="b_addrow" persistent>
      <q-card style="min-width: 450px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">New/User Device</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label="First Name"
            hint="Name"
            v-model="firstName"
            autofocus
            @keyup.enter="prompt = false"
          />

          <q-input
            label="Last Name"
            hint="Surname"
            v-model="lastName"
            autofocus
            @keyup.enter="prompt = false"
          />

          <q-input
            label="Email"
            hint="email"
            v-model="email"
            autofocus
            @keyup.enter="prompt = false"
          />

          <q-input
            label="Device Type"
            hint="Vendor and Model"
            v-model="deviceOS"
            autofocus
            @keyup.enter="prompt = false"
          />

          <q-input
            label="Device Id"
            hint="The Device Id"
            v-model="deviceId"
            autofocus
            @keyup.enter="prompt = false"
          />

          <q-select
            dense
            v-model="location"
            :options="geoFenceOptions"
            label="Perimeters"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add Record" v-close-popup @click="saveRow" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="b_viewGeofence" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">GeoFence</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <GeoFence :row="geofenceData"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { Auth } from "aws-amplify";
import Map from '../components/Map'
import GeoFence from '../components/GeoFence'

export default {
  name: "UserDevices",
  components: {
    Map,
    GeoFence
  },
  data() {
    return {
      visibleColumns: [ 'fullname', 'email', 'deviceOS', 'deviceId', 'action', 'mapGeoFence', 'mapPosition' ],
      selected: [],
      b_addrow: false,
      b_removerow: false,
      b_viewGeofence: false,
      b_map: false,
      tabledata: null,
      credentials: null,
      userID: "",
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      isNewDevice: true,
      deviceOS: "",
      deviceId: "",
      deviceUpdatedAt: "",
      geoFenceOptions: [],
      geofenceData: null,
      columns: [
        {
          name: "fullname",
          align: "left",
          label: "Full Name",
          field: (row) => row.firstName + " " + row.lastName,
          sortable: true,
        },
        {
          name: "email",
          label: "Email",
          field: "email",
          sortable: true,
        },
        {
          name: "deviceOS",
          label: "deviceOS",
          field: "deviceOS",
          sortable: true,
        },
        {
          name: "deviceId",
          label: "deviceId",
          field: "deviceId",
          sortable: true,
        },        
        { name: 'mapPosition', 
          label: 'LastPosition', 
          field: '', 
          align:'center' 
        },
        { name: 'mapGeoFence', 
          label: 'mapGeoFence', 
          field: '', 
          align:'center' 
        },
        { name: "geoFence", 
          label: "GeoFence", 
          field: "geoFenceName" 
        },
        { name: "geoFenceId", 
          label: "GeoFenceId", 
          field: "geoFenceId" 
        },
        {
          name: "lastLocation",
          label: "lastLocation",
          field: "lastLocation",
        },
        {
          name: "deviceUpdatedAt",
          label: "deviceUpdatedAt",
          field: "deviceUpdatedAt",
        }
      ],
      data: [],
    };
  },  
  async beforeMount() {
    this.credentials = await Auth.currentCredentials();
    await this.loadTable();    
  },
  computed: {
    ...mapState({
      userDeviceList: (state) => state.general.userDeviceList,
      locationList: (state) => state.general.locationList,
      paginationToken: (state) => state.general.paginationToken,
      userRec: (state) => state.general.userRec,
      deviceRec: (state) => state.general.deviceRec,
      geoFenceRec: (state) => state.general.geoFenceRec,
    }),
    ...mapGetters({
      isAuthenticated: "profile/isAuthenticated",
    }),
  },
  watch: {
    geoFenceRec (newValue) {
      if (newValue) {
        this.geofenceData = this.geoFenceRec
        console.log(this.geoFenceRec)
        this.b_viewGeofence = true;
      }
    }
  },
  methods: {
    // emulate fetching data from server

    toggleAddRow() {
      this.b_addrow = !this.b_addrow;
    },
    toggleRemoveRow() {
      this.b_addrow = !this.b_addrow;
    },

    toggleShowMap(param) {
      if (param.row.lastLocation == null) {
        this.tabledata = null;
        this.$q.notify({
          color: "negative",
          position: "top",
          timeout: 5000,
          icon: "warning",
          message: "The user " + param.row.firstName + " " + param.row.lastName + " does not have any last position to show.",
        });
      }
      else {
        this.deviceUpdatedAt = param.row.deviceUpdatedAt;
        this.tabledata = param.row;
        this.b_map = !this.b_map;
      }                  
    },

    async toggleShowGeoFence(param) {
      if (param.row.geoFenceId == null) {
        this.$q.notify({
          color: "negative",
          position: "top",
          timeout: 5000,
          icon: "warning",
          message: "Something went wrong.",
        });
      }
      else {
        await this.$store.dispatch("general/fetchGeofenceDetail", { id: param.row.geoFenceId, credentials: this.credentials });        
      }         

    },

    resetVariables() {
      this.userID = "";
      this.firstName = "";
      this.lastName = "";
      this.location = "";
      this.email = "";
      this.deviceId = "";
    },

    async loadTable() {
      try {
        await this.$store.dispatch("general/fetchUsers", {});
        this.data = []
        if (this.userDeviceList && this.userDeviceList.length > 0) {          
          for (let i=0; i < this.userDeviceList.length; i++) { 
            this.data.push({
              firstName: this.userDeviceList[i].firstName,
              lastName: this.userDeviceList[i].lastName,
              email: this.userDeviceList[i].email,
              deviceId: this.userDeviceList[i].device.id,
              lastLocation: this.userDeviceList[i].device.lastLocation,        
              deviceOS: this.userDeviceList[i].device.deviceOS,
              deviceUpdatedAt: this.userDeviceList[i].device.updatedAt,
              geoFenceName: this.userDeviceList[i].device.geofence.geoFenceName,
              geoFenceId: this.userDeviceList[i].device.geofence.id 
            })
          }        
        }
        await this.$store.dispatch("general/fetchLocations", { credentials: this.credentials });  
        this.geoFenceOptions = []      
        for (let i=0; i < this.locationList.length; i++) {  
          this.geoFenceOptions.push({
            label: this.locationList[i].geoFenceName,
            value: this.locationList[i].id
            })
        }                
      } catch (error) {
        console.error(error);
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "warning",
          message: "Somethine went wrong!"
        });
      }
    },

    async saveRow() {
      // Check for deviceId

      try {
        await this.$store.dispatch("general/saveUser", {
          id: this.userID,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          userDeviceId: this.deviceId,
        });
        console.log("User Saved " + this.userRec.id);        

        await this.$store.dispatch("general/saveDevice", {
          isNewDevice: this.isNewDevice,
          id: this.deviceId,
          deviceOS: this.deviceOS,
          userID: this.userRec.id,
          deviceGeoFenceId: this.location //from select
        });

        this.resetVariables();
        this.loadTable();
        
        console.log("Device Saved");
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
  },
};

</script>
