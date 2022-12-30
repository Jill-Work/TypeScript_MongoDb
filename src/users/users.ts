import express from "express";
import { UsersController } from "./usersController";
import  Auth  from "../middleware/authMiddleware";
import { UpdateRequest, InsertUserRequest, LogInRequest } from "../requests/indexOfRequest";


export class UserRoutes {

  public router = express.Router();
  public usersController : UsersController;
  public authMiddleware : Auth;
  public insertUserRequest : InsertUserRequest;
  public logInRequest : LogInRequest;
  public updateRequest : UpdateRequest;

  constructor () { 
    this.usersController = new UsersController();
    this.authMiddleware = new Auth();
    this.insertUserRequest = new InsertUserRequest();
    this.logInRequest = new LogInRequest();
    this.updateRequest = new UpdateRequest();
  }

  userRoute():void {
    
    this.router.get("/user/:id",this.authMiddleware.authOfUsers,this.usersController.userDetails);

    this.router.get("/list",this.authMiddleware.authOfUsers,this.usersController.userDetails);

    this.router.post("/signup",this.insertUserRequest.userSignUpValidation,this.usersController.userSignUp);

    this.router.get("/login",this.logInRequest.checkLoginParameter,this.usersController.userLogIn);

    this.router.put("/update",this.updateRequest.updateUserValidation,this.authMiddleware.authOfUsers,this.usersController.userUpdate);

    this.router.put("/changePassword",this.authMiddleware.authOfUsers,this.usersController.userPasswordChange);

    this.router.delete("/:id",this.authMiddleware.authOfUsers,this.usersController.userDelete);

    this.router.post("/adminSignup",this.insertUserRequest.userSignUpValidation,this.usersController.admin);

    this.router.get("/listOfPermission",this.authMiddleware.authOfUsers,this.usersController.listOfRoute);

    this.router.post("/addPermission",this.authMiddleware.authOfUsers,this.usersController.addRoute);

    this.router.delete("/deletePermission",this.authMiddleware.authOfUsers,this.usersController.deleteRoute);
  }
}
