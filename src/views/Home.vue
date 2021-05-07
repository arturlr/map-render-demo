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
            v-model="fullName"
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
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add Record" v-close-popup @click="saveRow" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { Auth } from "aws-amplify";
import Map from '../components/Map'

export default {
  name: "UserDevices",
  components: {
    Map
  },
  data() {
    return {
      visibleColumns: [ 'fullname', 'email', 'deviceOS', 'deviceId', 'action', 'mapPosition' ],
      selected: [],
      b_addrow: false,
      b_removerow: false,
      b_map: false,
      tabledata: null,
      credentials: null,
      userID: "",
      fullName: "",
      email: "",
      location: "",
      isNewDevice: true,
      deviceOS: "",
      deviceId: "",
      deviceUpdatedAt: "",
      columns: [
        {
          name: "fullname",
          align: "left",
          label: "Full Name",
          field: "fullName",
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
      deviceRec: (state) => state.general.deviceRec
    }),
    ...mapGetters({
      isAuthenticated: "profile/isAuthenticated",
    }),
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
          message: "The user " + param.row.fullName + " does not have any last position to show.",
        });
      }
      else {
        this.deviceUpdatedAt = param.row.deviceUpdatedAt;
        this.tabledata = param.row;
        this.b_map = !this.b_map;
      }                  
    },

    resetVariables() {
      this.userID = "";
      this.fullName = "";
      this.location = "";
      this.deviceId = "";
    },

    async loadTable() {
      try {
        await this.$store.dispatch("general/fetchUsers", {});
        this.data = []
        if (this.userDeviceList && this.userDeviceList.length > 0) {          
          for (let i=0; i < this.userDeviceList.length; i++) { 
            this.data.push({
              fullName: this.userDeviceList[i].fullName,
              deviceId: this.userDeviceList[i].device.id,
              lastLocation: this.userDeviceList[i].device.lastLocation,        
              deviceOS: this.userDeviceList[i].device.deviceOS,
              deviceUpdatedAt: this.userDeviceList[i].device.updatedAt,
            })
          }        
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
          fullName: this.fullName,
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
