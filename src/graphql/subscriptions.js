/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlert = /* GraphQL */ `
  subscription OnCreateAlert {
    onCreateAlert {
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
export const onUpdateAlert = /* GraphQL */ `
  subscription OnUpdateAlert {
    onUpdateAlert {
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
export const onDeleteAlert = /* GraphQL */ `
  subscription OnDeleteAlert {
    onDeleteAlert {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice {
    onCreateDevice {
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
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
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
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
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
export const onCreateGeoFence = /* GraphQL */ `
  subscription OnCreateGeoFence {
    onCreateGeoFence {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateGeoFence = /* GraphQL */ `
  subscription OnUpdateGeoFence {
    onUpdateGeoFence {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteGeoFence = /* GraphQL */ `
  subscription OnDeleteGeoFence {
    onDeleteGeoFence {
      id
      geoFenceName
      createdAt
      updatedAt
      owner
    }
  }
`;
