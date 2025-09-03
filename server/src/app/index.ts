import express from 'express';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { User } from './user/index.js';
import { Tweet } from './tweet/index.js';
import cors from 'cors'; 
import type{ GraphqlContext } from '../interface.js';
import JWTService from '../services/jwt.js';


export async function initServer() {

    const app = express();

    const server = new ApolloServer<GraphqlContext>({
        typeDefs: 
              `
              ${User.types}
              ${Tweet.types}
               
               type Query { ${User.queries}  ${Tweet.queries}  }
                type Mutation { ${Tweet.mutations} }
            `,
        resolvers: {
            Query: {
               ...User.resolvers.queries,
               ...Tweet.resolvers.queries,
            },
            Mutation: {
                ...Tweet.resolvers.mutations,
            },
              ...Tweet.resolvers.extraResolvers,
              ...User.resolvers.extraResolvers,
          },
           introspection: true,
    });


    await server.start();


    app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:3001', // your frontend
      credentials: true,               // if you need cookies
    }),
    express.json(),
    expressMiddleware(server,{
        context:async ({req,res})=>{
            var authHeader = req.headers.authorization;
            authHeader=authHeader?.startsWith("Bearer ")? authHeader.split("Bearer ")[1]:authHeader;
            return{
                user:req.headers.authorization ? JWTService.decodeToken(authHeader as string)
                : undefined
            }

    }})
  );

return app;

}