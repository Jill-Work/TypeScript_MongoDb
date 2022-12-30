import Permission from "../models/permissionModel";
import {Request, Response ,NextFunction} from "express";
import  jwt  from "jsonwebtoken";
import { env } from "../config/env";

export default class Auth {

  public permission : InstanceType<typeof Permission>;

  constructor(){
    this.permission = new Permission();
  }


  authOfUsers = (req:Request, res:Response, next:NextFunction) => {
    const authorization = req.headers["authorization"];
    const tokenId:any = authorization && authorization.split(" ")[1];

    if (authorization == null)
      return res.status(404).json({ error: "Token is Null" });
    jwt.verify(tokenId, env.SECRET_KEY, async (err:any, user:any) => {
      if (err) {
        res.status(404).json({ error: err.message });
      } else {
        const routes = req.baseUrl + req.route.path;
        const roleFromToken = user.role;
        if (roleFromToken == "ADMIN") {
          console.log("admin Middleware Check is Successfully");
          res.locals.user = user;
          next();
        } else {
          const authFromDatabase = await this.permission.findOne({
            where: { role: roleFromToken, routes },
          });
          if (authFromDatabase) {
            const roleFromDatabase = authFromDatabase.dataValues.role;
            if (roleFromDatabase == roleFromToken) {
              console.log("Auth Middleware Check is Successfully");
              res.locals.user = user;
              next();
            }
          } else {
            res
              .status(403)
              .json({ error: "you are not authorize to this page" });
            return;
          }
        }
      }
    });
  };
}
