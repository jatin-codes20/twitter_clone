import axios from "axios";
import { PrismaClient, User } from '@prisma/client';
import JWTService from "./jwt.js";




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
class UserService {

 public static async verifyGoogleAuthToken(token: string){
 
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

  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static followUser(from: string, to: string) {
    return prismaClient.follows.create({
      data: {
        follower: { connect: { id: from } },
        following: { connect: { id: to } },
      },
    });
  }

  public static unfollowUser(from: string, to: string) {
    return prismaClient.follows.delete({
      where: { followerId_followingId: { followerId: from, followingId: to } },
    });
  }

  
}
export default UserService;