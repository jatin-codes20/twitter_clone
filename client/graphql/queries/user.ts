import { graphql } from "../../gql/gql"; // path to your generated file

export const VerifyGoogleTokenQuery = graphql(`
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      firstName
      lastName
       recommendedUsers {
        id
        firstName
        lastName
        profileImage
      }
       followers {
        id
        firstName
        lastName
        profileImage
      }
      following {
        id
        firstName
        lastName
        profileImage
      }
      profileImage
       tweets {
        id
        content
        author {
          id
          firstName
          lastName
          profileImage
        }
      }
    }
  }
`);


export const getUserByIdQuery = graphql(`
  #graphql
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      id
      firstName
      lastName
      profileImage
         followers {
        id
        firstName
        lastName
        profileImage
      }
      following {
        id
        firstName
        lastName
        profileImage
      }
      

      tweets {
        content
        id
        author {
          id
          firstName
          lastName
          profileImage
        }
      }
    }
  }
`);