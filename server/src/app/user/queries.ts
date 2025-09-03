export const queries = `#graphql
    verifyGoogleToken(token: String!): String
    getCurrentUser: User
    getUserById(userId: ID!): User
`;

