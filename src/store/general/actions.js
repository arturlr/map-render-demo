import { API, graphqlOperation } from "aws-amplify";
import { createUser, updateUser, createDevice, updateDevice } from "../../graphql/mutations";
import { listUsers } from "./graphql";

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
    { id, fullName, userDeviceId }) {
    try {
        console.group("store/general/actions/saveUser");
        commit("SET_LOADER", true);
        let result = "";

        if (id != null && id.length > 2) {
            var curUserInput = {
                id: id,
                fullName: fullName,
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
                fullName: fullName,
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
    { id, userID, deviceType, isNewDevice }) {
    try {
        console.group("store/general/actions/saveDevice");
        commit("SET_LOADER", true);
        let result = "";
        var deviceInput = {
            id: id,
            userID: userID,
            deviceType: deviceType,
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