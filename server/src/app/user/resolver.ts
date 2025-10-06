import axios from "axios";
import { PrismaClient, User } from '@prisma/client';
import JWTService from "../../services/jwt.js";
import type { GraphqlContext } from "../../interface.js";
import UserService from "../../services/user.js";
import { redisClient } from "../../client/redis/index.js";

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
          const resultToken = await UserService.verifyGoogleAuthToken(token);
    return resultToken;
},
getCurrentUser : async (parent:any,args:any,ctx:GraphqlContext)=>{

    
   const id= ctx.user?.id;
   console.log("Current user id:", ctx.user);
   if(!id) return null;
   const user= UserService.getUserById(id);
 
   if(!user) return null; 
     console.log(user);
    return user;
},

getUserById: async (
  parent: any,
  { userId }: { userId: string },
  ctx: GraphqlContext
) => {
  const user = UserService.getUserById(userId);

  if (!user) return null;
  console.log(user);
  return user;
},
   
}


const extraResolvers = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({ where: { author: { id: parent.id } } }),
    followers: async (parent: User, _: any, ctx: GraphqlContext) => {
      
      const result = await prismaClient.follows.findMany({
        where: { following: { id: parent.id } },
        include: {
          follower: true,
        },
      });
      return result.map((el) => el.follower);
    },
    following: async (parent: User) => {
      const result = await prismaClient.follows.findMany({
        where: { follower: { id: parent.id } },
        include: {
          following: true,
        },
      });
      return result.map((el) => el.following);
    },
    recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
      if (!ctx.user) return [];
       const cachedValue = await redisClient.get(
        `RECOMMENDED_USERS:${ctx.user.id}`
      );

     

      const myFollowings = await prismaClient.follows.findMany({
        where: {
          follower: { id: ctx.user.id },
        },
        include: {
          following: {
            include: { followers: { include: { following: true } } },
          },
        },
      });

      const users: User[] = [];

      for (const followings of myFollowings) {
        for (const followingOfFollowedUser of followings.following.followers) {
          if (
            followingOfFollowedUser.following.id !== ctx.user.id &&
            myFollowings.findIndex(
              (e) => e?.followingId === followingOfFollowedUser.following.id
            ) < 0
          ) {
            users.push(followingOfFollowedUser.following);
          }
        }
      }
       await redisClient.set(
        `RECOMMENDED_USERS:${ctx.user.id}`,
        JSON.stringify(users)
      );
     

      return users;
    },
  },
   
}


const mutations = {
  followUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");
   

    await UserService.followUser(ctx.user.id, to);
    await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
    return true;
  },
   unfollowUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("unauthenticated");
   
    await UserService.unfollowUser(ctx.user.id, to);
     await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`);
    return true;
  }
}


export const resolvers={ queries, extraResolvers,mutations };