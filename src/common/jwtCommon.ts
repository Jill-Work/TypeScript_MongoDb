import jwt from "jsonwebtoken";
import { env } from "../config/env";

export default class JwtCommon {
  // jwt token
  tokenJwt = (users: any) => {
    const tokenData = {
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    };
    const token = jwt.sign(tokenData, env.SECRET_KEY);
    return token;
  };
}
