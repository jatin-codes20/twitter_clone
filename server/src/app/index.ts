import express from 'express';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { User } from './user/index.js';
import cors from 'cors'; 


export async function initServer() {

    const app = express();

    const server = new ApolloServer({
        typeDefs: 
              `
              ${User.types}
                type Query { ${User.queries} }
            `,
        resolvers: {
            Query: {
               ...User.resolvers.queries,
            },
        },
    });


    await server.start();


    app.use(
    '/graphql',
    cors({
      origin: 'http://localhost:3001', // your frontend
      credentials: true,               // if you need cookies
    }),
    express.json(),
    expressMiddleware(server)
  );

return app;

}