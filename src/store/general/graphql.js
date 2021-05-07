export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fullName
        createdAt
        updatedAt
        owner
        device {
          id
          userID
          deviceType
          updatedAt
        }
      }
      nextToken
    }
  }
`;