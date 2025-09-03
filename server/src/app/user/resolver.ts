import axios from "axios";
import { PrismaClient, User } from '@prisma/client';
import JWTService from "../../services/jwt.js";
import type { GraphqlContext } from "../../interface.js";

interface GoogleTokenInfo {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  nbf?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

const prismaClient = new PrismaClient();
const queries={
    verifyGoogleToken: async (parent: any, {token} : {token: string} ) => {
        const googleToken=token;
        const googleOauthUrl=new URL('https://oauth2.googleapis.com/tokeninfo');
        googleOauthUrl.searchParams.append('id_token',googleToken);
        const {data}=await axios.get(googleOauthUrl.toString(),{
            responseType:'json'
        });
        const user= await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });

        if(!user){ 
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImage: data.picture
                }
            });
        }

        const userinDB=await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });
        if(!userinDB){
            throw new Error("User not found");
        }
      
        const userToken=JWTService.generateToken(userinDB!);
      
        return userToken;
},
getCurrentUser : async (parent:any,args:any,ctx:GraphqlContext)=>{

    
   const id= ctx.user?.id;
   if(!id) return null;
   const user= await prismaClient.user.findUnique({
    where: {
        id: id
    }
   });
 
   if(!user) return null; 
     console.log(user);
    return user;
},
getUserById: async (
  parent: any,
  { userId }: { userId: string },
  ctx: GraphqlContext
) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId }
  });

  if (!user) return null;
  console.log(user);
  return user;
}};




const extraResolvers = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({ where: { author: { id: parent.id } } }),
  },
};

export const resolvers={ queries, extraResolvers };