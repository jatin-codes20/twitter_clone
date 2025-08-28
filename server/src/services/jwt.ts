
import jwt from "jsonwebtoken";
import type { User } from "../generated/prisma/index.js";

const JWT_SECRET_KEY="jgfdgcvjhb"
class JWTService {

    public static  generateToken(user:User) {

       
        const payload={
            id: user?.id,
            email: user?.email
        };

       
        const token=jwt.sign(payload,JWT_SECRET_KEY);
        return token;
    // JWT service implementation
}

};
export default JWTService;