/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          createdAt
          updatedAt
          owner
        }
      }
      nextToken
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices(
    $filter: ModelDeviceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!) {
    getDevice(id: $id) {
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
export const listGeoFences = /* GraphQL */ `
  query ListGeoFences(
    $filter: ModelGeoFenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGeoFences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        geoFenceName
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getGeoFence = /* GraphQL */ `
  query GetGeoFence($id: ID!) {
    getGeoFence(id: $id) {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
export const getAlert = /* GraphQL */ `
  query GetAlert($id: ID!) {
    getAlert(id: $id) {
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
export const listAlerts = /* GraphQL */ `
  query ListAlerts(
    $filter: ModelAlertFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlerts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
