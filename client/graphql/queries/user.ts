import { graphql } from "../../gql/gql"; // path to your generated file

export const VerifyGoogleTokenQuery = graphql(`
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);