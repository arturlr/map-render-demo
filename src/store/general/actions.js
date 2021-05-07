import { API, graphqlOperation } from "aws-amplify";
import { createUser, updateUser, createDevice, updateDevice, createGeoFence, updateGeoFence } from "../../graphql/mutations";
import { listGeoFences, getGeoFence } from "../../graphql/queries";
import { listUsers } from "./graphql";
import Location from "aws-sdk/clients/location";
import awsconfig from '../../aws-exports'

export function setPlace(
    { commit }, { place }) {
    console.group("store/general/actions/setPlace");
    commit("SET_PLACE", place);
    console.groupEnd();
}

export function setVertices(
    { commit }, { vertices }) {
    console.group("store/general/actions/setVertices");
    commit("SET_VERTICES", vertices);
    console.groupEnd();
}

export async function fetchUsers(
    { commit }) {
    try {
        let usersList = null;
        console.group("store/general/actions/listUsers");
        commit("SET_LOADER", true);
        commit("SET_DATA", []);

        const {
            // @ts-ignore
            data: { listUsers: { items: results } }
        } = await API.graphql(graphqlOperation(listUsers));

        usersList = results
        console.log(usersList)

        //console.log(usersList);
        commit("SET_DATA", usersList);
        commit("SET_LOADER", false);
        console.groupEnd();
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}


export async function saveUser({ commit },
    { id, firstName, lastName, email, userDeviceId }) {
    try {
        console.group("store/general/actions/saveUser");
        commit("SET_LOADER", true);
        let result = "";

        if (id != null && id.length > 2) {
            var curUserInput = {
                id: id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                userDeviceId: userDeviceId
            }
            const {
                // @ts-ignore
                data: { updateUser: userObj }
            } = await API.graphql(graphqlOperation(updateUser, {
                input: curUserInput
            }));
            result = userObj
        } else {
            var newUserInput = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                userDeviceId: userDeviceId
            }
            const {
                // @ts-ignore
                data: { createUser: userObj }
            } = await API.graphql(graphqlOperation(createUser, {
                input: newUserInput
            }));
            result = userObj
        }

        commit("SET_LOADER", false);
        commit("SET_USER", result)
        console.groupEnd();
        //console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}

export async function saveDevice({ commit },
    { id, userID, deviceOS, lastLocation, deviceGeoFenceId, isNewDevice }) {
    try {
        console.group("store/general/actions/saveDevice");
        commit("SET_LOADER", true);
        let result = "";
        var deviceInput = {
            id: id,
            userID: userID,
            deviceOS: deviceOS,
            lastLocation: lastLocation,
            deviceGeofenceId: deviceGeoFenceId
        }
        if (!isNewDevice) {
            const {
                // @ts-ignore
                data: { updateDevice: devId }
            } = await API.graphql(graphqlOperation(updateDevice, {
                input: deviceInput
            }));
            result = devId
        } else {
            const {
                // @ts-ignore
                data: { createDevice: devId }
            } = await API.graphql(graphqlOperation(createDevice, {
                input: deviceInput
            }));
            result = devId
        }
        commit("SET_LOADER", false);
        console.groupEnd();
        //console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}


export async function saveLocation({ commit },
    { id, name }) {
    try {
        console.group("store/general/actions/saveLocation");
        commit("SET_LOADER", true);
        let result = "";
        if (id != null && id.length > 2) {
            var curLocation = {
                id: id,
                geoFenceName: name
            }
            const {
                // @ts-ignore
                data: { updateGeoFence: locId }
            } = await API.graphql(graphqlOperation(updateGeoFence, {
                input: curLocation
            }));
            result = locId
        } else {
            var newLocation = {
                id: id,
                geoFenceName: name
            }
            console.log(newLocation)
            const {
                // @ts-ignore
                data: { createGeoFence: locId }
            } = await API.graphql(graphqlOperation(createGeoFence, {
                input: newLocation
            }));
            result = locId
        }
        commit("SET_LOADER", false);
        console.groupEnd();
        //console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}

export async function fetchLocations(
    { commit }) {
    try {
        let locationList = null;
        console.group("store/general/actions/listGeoFences");
        commit("SET_LOADER", true);
        commit("SET_LOCATION_LIST", []);

        const {
            // @ts-ignore
            data: { listGeoFences: { items: results } }
        } = await API.graphql(graphqlOperation(listGeoFences));

        locationList = results
        commit("SET_LOCATION_LIST", locationList);
        commit("SET_LOADER", false);
        console.groupEnd();
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}

export function saveGeoFence(
    { commit }, { name, polygonVertices, credentials }) {
        try {
            console.group("store/general/actions/saveGeoFence");
            commit("SET_LOADER", true);

            this.service = new Location({
                credentials: credentials,
                region: awsconfig.aws_project_region,
            });
            
            // var colParams = {
            //     CollectionName: 'col_' + this.name,
            //     PricingPlan: 'RequestBasedUsage',
            //     Description: 'GeoCare App' 
            // };
    
            // this.service.createGeofenceCollection(colParams, function(err, geodata) {
            //     if (err) console.log(err, err.stack); // an error occurred
            //     else { 
            //     console.log(geodata);
            //     const geoParams = {
            //         CollectionName: geodata.CollectionName,
            //         GeofenceId: vm.name,
            //         Geometry: {
            //         Polygon: [vm.polygonVertices]
            //         }
            //     }

            const geoParams = {
                CollectionName: process.env.VUE_APP_GEOFENCE_COLLECTION,
                GeofenceId: name,
                Geometry: {
                    Polygon: [polygonVertices]
                }
            }
    
            this.service.putGeofence(geoParams, function(err, data) {
                if (err) console.log(err, err.stack);
                else { 
                    console.log("Saved on Amazon Location Service: " + data.GeofenceId);                    
                }
            });

        } catch (error) {
            console.error(error);
            commit("SET_LOADER", false);
            console.groupEnd();
            throw error;

        }
    }

export function fetchGeoFenceItems(
    { commit }, { credentials }) {
    try {
        let locationList = [];
        console.group("store/general/actions/fetchGeoFenceItems");
        commit("SET_LOADER", true);
        commit("SET_LOCATION_LIST", []);

        this.service = new Location({
            credentials: credentials,
            region: awsconfig.aws_project_region,
        });

        this.service.listGeofences({ CollectionName: process.env.VUE_APP_GEOFENCE_COLLECTION }, function (err, response) {
            if (err) console.log(err, err.stack); // an error occurred
            else {                
                if (response && response.Entries.length > 0) {
                    for (let i = 0; i < response.Entries.length; i++) {
                        if (response.Entries[i].Status == "ACTIVE") {
                            locationList.push({
                                id: response.Entries[i].GeofenceId,
                                geoFenceName: response.Entries[i].GeofenceId,
                                boundary: response.Entries[i].Geometry.Polygon
                            })
                        }
                    }
                }
            }
        });        

        //console.log(usersList);
        commit("SET_LOCATION_LIST", locationList);
        commit("SET_LOADER", false);
        console.groupEnd();
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}

export function fetchGeoFenceCollectionsItems(
    { commit }, { credentials }) {
    try {
        let locationList = [];
        let collectionList = [];
        let nextToken = null
        console.group("store/general/actions/listGeoFences");
        commit("SET_LOADER", true);
        commit("SET_LOCATION_LIST", []);

        this.service = new Location({
            credentials: credentials,
            region: awsconfig.aws_project_region,
        });

        var vm = this;

        this.service.listGeofenceCollections(function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                for (let i = 0; i < data.Entries.length; i++) {
                    collectionList.push(data.Entries[i].CollectionName);
                }
                if (data.NextToken) {
                    nextToken = data.NextToken;
                    do {
                        vm.service.listGeofenceCollections({ NextToken: nextToken }, function (err, gdata) {
                            if (err) console.log(err, err.stack);
                            else {
                                if (gdata.NextToken) nextToken = gdata.NextToken;
                                else nextToken = null;

                                for (let i = 0; i < gdata.Entries.length; i++) {
                                    collectionList.push(gdata.Entries[i].CollectionName);
                                }
                            }
                        })
                    } while (nextToken != null)
                }

                for (let i = 0; i < collectionList.length; i++ ) {
                    vm.service.listGeofences({
                        CollectionName: collectionList[i]
                    },
                        (err, response) => {
                            if (err) {
                                console.error(err);
                            }
                            if (response && response.Entries.length > 0) {

                                for (let i = 0; i < response.Entries.length; i++) {
                                    if (response.Entries[i].Status == "ACTIVE") {
                                        locationList.push({
                                            id: response.Entries[i].GeofenceId,
                                            geoFenceName: response.Entries[i].GeofenceId,
                                            boundary: response.Entries[i].Geometry.Polygon
                                        })
                                    }
                                }
                            }
                        })
                }
            }
        });

        

        //console.log(usersList);
        commit("SET_LOCATION_LIST", locationList);
        commit("SET_LOADER", false);
        console.groupEnd();
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}

export async function fetchGeofenceDetail(
    { commit }, { id, credentials }) {
    try {
        console.group("store/general/actions/getGeoFenceDetail");
        commit("SET_LOADER", true);
        commit("SET_GEOFENCE", null);

        const {
            // @ts-ignore
            data: { getGeoFence: geoRec }
        } = await API.graphql(graphqlOperation(getGeoFence, { id: id }));

        this.service = new Location({
            credentials: credentials,
            region: awsconfig.aws_project_region,
        });

        var params = {
            CollectionName: process.env.VUE_APP_GEOFENCE_COLLECTION,
            GeofenceId: geoRec.geoFenceName
          };
        
        this.service.getGeofence(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred            
            else  {
                console.log(data)
                commit("SET_GEOFENCE", data);
                commit("SET_LOADER", false);
            }
          });
        console.groupEnd();
    } catch (error) {
        console.error(error);
        commit("SET_LOADER", false);
        console.groupEnd();
        throw error;
    }
}