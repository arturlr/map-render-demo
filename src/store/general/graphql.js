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
          updatedAt
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
      nextToken
    }
  }
`;