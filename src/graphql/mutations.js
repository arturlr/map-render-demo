/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      createdAt
      updatedAt
      owner
      device {
        id
        userID
        deviceOS
        lastLocation {
          lat
          lng
        }
        createdAt
        updatedAt
        owner
        geofence {
          id
          geoFenceName
          createdAt
          updatedAt
          owner
        }
      }
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      createdAt
      updatedAt
      owner
      device {
        id
        userID
        deviceOS
        lastLocation {
          lat
          lng
        }
        createdAt
        updatedAt
        owner
        geofence {
          id
          geoFenceName
          createdAt
          updatedAt
          owner
        }
      }
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      createdAt
      updatedAt
      owner
      device {
        id
        userID
        deviceOS
        lastLocation {
          lat
          lng
        }
        createdAt
        updatedAt
        owner
        geofence {
          id
          geoFenceName
          createdAt
          updatedAt
          owner
        }
      }
    }
  }
`;
export const createDevice = /* GraphQL */ `
  mutation CreateDevice(
    $input: CreateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    createDevice(input: $input, condition: $condition) {
      id
      userID
      deviceOS
      lastLocation {
        lat
        lng
      }
      createdAt
      updatedAt
      owner
      geofence {
        id
        geoFenceName
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const updateDevice = /* GraphQL */ `
  mutation UpdateDevice(
    $input: UpdateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    updateDevice(input: $input, condition: $condition) {
      id
      userID
      deviceOS
      lastLocation {
        lat
        lng
      }
      createdAt
      updatedAt
      owner
      geofence {
        id
        geoFenceName
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice(
    $input: DeleteDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    deleteDevice(input: $input, condition: $condition) {
      id
      userID
      deviceOS
      lastLocation {
        lat
        lng
      }
      createdAt
      updatedAt
      owner
      geofence {
        id
        geoFenceName
        createdAt
        updatedAt
        owner
      }
    }
  }
`;
export const createGeoFence = /* GraphQL */ `
  mutation CreateGeoFence(
    $input: CreateGeoFenceInput!
    $condition: ModelGeoFenceConditionInput
  ) {
    createGeoFence(input: $input, condition: $condition) {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateGeoFence = /* GraphQL */ `
  mutation UpdateGeoFence(
    $input: UpdateGeoFenceInput!
    $condition: ModelGeoFenceConditionInput
  ) {
    updateGeoFence(input: $input, condition: $condition) {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteGeoFence = /* GraphQL */ `
  mutation DeleteGeoFence(
    $input: DeleteGeoFenceInput!
    $condition: ModelGeoFenceConditionInput
  ) {
    deleteGeoFence(input: $input, condition: $condition) {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createAlert = /* GraphQL */ `
  mutation CreateAlert(
    $input: CreateAlertInput!
    $condition: ModelAlertConditionInput
  ) {
    createAlert(input: $input, condition: $condition) {
      id
      userID
      type
      description
      location {
        lat
        lng
      }
      createdAt
      expirationTime
      updatedAt
      owner
    }
  }
`;
export const updateAlert = /* GraphQL */ `
  mutation UpdateAlert(
    $input: UpdateAlertInput!
    $condition: ModelAlertConditionInput
  ) {
    updateAlert(input: $input, condition: $condition) {
      id
      userID
      type
      description
      location {
        lat
        lng
      }
      createdAt
      expirationTime
      updatedAt
      owner
    }
  }
`;
export const deleteAlert = /* GraphQL */ `
  mutation DeleteAlert(
    $input: DeleteAlertInput!
    $condition: ModelAlertConditionInput
  ) {
    deleteAlert(input: $input, condition: $condition) {
      id
      userID
      type
      description
      location {
        lat
        lng
      }
      createdAt
      expirationTime
      updatedAt
      owner
    }
  }
`;
