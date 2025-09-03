
import JWT from "jsonwebtoken";
import type { User } from "../generated/prisma/index.js";
import type { JWTUser } from "../interface.js";

const JWT_SECRET_KEY="jgfdgcvjhb"
class JWTService {

    public static  generateToken(user:User) {

       
        const payload : JWTUser={
            id: user?.id,
            email: user?.email
        };

       
     const token = JWT.sign(payload, JWT_SECRET_KEY, { algorithm: "HS256" });
        return token ;
    // JWT service implementation
}

public static decodeToken(token: string){


    
   try{
    console.log("Decoding token:", token);
    return JWT.verify(token,JWT_SECRET_KEY,{ algorithms: ["HS256"] }) as JWTUser;
}
   catch{ 
    console.log("Decoding token:");
    return null;
}

}

};
export default JWTService;