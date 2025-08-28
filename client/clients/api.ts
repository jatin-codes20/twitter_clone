import { GraphQLClient } from 'graphql-request'

export const graphqlClient=new GraphQLClient('http://localhost:8000/graphql',{

    headers:()=>({
        authorization: `Bearer ${typeof window !== 'undefined' ? window.localStorage.getItem("__twitter_token") : ""}`
    })
});