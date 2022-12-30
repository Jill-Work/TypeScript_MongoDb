import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UsersService } from "./usersServices";
import { UserCacheRequest } from "../requests/indexOfRequest";
import { AddUserCommon, JwtCommon, Permission } from "../common/indexOfCommon";


export class UsersController {

  public usersService : UsersService;
  public cache : UserCacheRequest;
  public addUser : AddUserCommon;
  public jwt : JwtCommon;
  public permissions : Permission;

  constructor () {
    this.usersService = new UsersService();
    this.cache = new UserCacheRequest();
    this.addUser = new AddUserCommon();
    this.jwt = new JwtCommon();
    this.permissions = new Permission();
  }

  
  // get user
  userDetails = async (req: Request, res: Response) => {
    try {
      const userId:any = req.query.id;
      const userCacheData:any = await this.cache.getCacheData(userId);
      if (userCacheData != null) {
        return res.json(JSON.parse(userCacheData));
      } else {
        const existingUser = await this.usersService.getUsersList({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });
        await this.cache.setCacheData(userId, existingUser);
        return res.status(200).json(existingUser);
      }
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  // get users
  userList = async (req: Request, res: Response) => {
    try {
      const { emailSearch, numberSearch, size, page }:any = req.query;
      let condition = {};
      if (emailSearch || numberSearch) {
        condition = {
          where: {
            $or: [
              { email: { $regex: "%" + emailSearch + "%" } },
              { contactNumber: { $regex: "%" + numberSearch + "%" } },
            ],
          },
          attributes: { exclude: ["password"] },
        };
      } else if (size && page) {
        condition = {
          limit: parseInt(size),
          offset: parseInt(size) * (parseInt(page)-1),
        };
      } else if ((condition = {})) {
        condition = { attributes: { exclude: ["password"] } };
      }
      const users = await this.usersService.getUsersList(condition);
      for (var i = 0; i < users.length; i++) {
        delete users.password;
      }
      res.status(200).json(users);
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  //  Sign Up
  userSignUp = async (req: Request, res: Response) => {
    try {
      const values = ["BUYER", "SELLER"];
      await this.addUser.createNewUser(req, res, values);
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  // log in
  userLogIn = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      const users = await this.usersService.getUserData({ where: { email } });
      if (!users)
        return res.status(404).json({ error: "invalid details check again" });
      console.log(users);
      const userData = {
        firstName: users.firstName,
        lastName: users.lastName,
      };
      if (users) {
        const userPassword = users.password;
        const passwordCompare = await bcrypt.compare(password, userPassword);
        if (passwordCompare) {
          const token = this.jwt.tokenJwt(users);
          res.status(200).json({ ...userData, token });
        } else {
          res.status(404).json({ error: "invalid details" });
        }
      } else {
        res.status(404).json({ error: "invalid details" });
      }
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  // update users
  userUpdate = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const tokenId = res.locals.user.id;
      const existingUserData = await this.usersService.getUserData({
        where: { id: tokenId },
      });

      let update: any = {};
      if (body.firstName.length != 0) {
        update.firstName = body.firstName;
      }
      if (body.lastName.length != 0) {
        update.lastName = body.lastName;
      }
      if (existingUserData.email === body.email) {
        update.email = body.email;
      }
      if (existingUserData.contactNumber === parseInt(body.contactNumber)) {
        update.contactNumber = parseInt(body.contactNumber);
      }
      const existingContactNumberOrEmail = await this.usersService.getUsersList({
        where: {
          $or: [
            { contactNumber: body.contactNumber },
            { email: req.body.email },
          ],
        },
      });
      if (
        req.body.hasOwnProperty("contactNumber") ||
        req.body.hasOwnProperty("email")
      ) {
        if (
          existingContactNumberOrEmail.length == 0 ||
          existingContactNumberOrEmail[0].id === tokenId
        ) {
          update.contactNumber = parseInt(body.contactNumber);
          update.email = body.email;
        } else {
          for (let i = 0; i < existingContactNumberOrEmail.length; i++) {
            const element = existingContactNumberOrEmail[i];
            if (
              element.id != tokenId &&
              element.contactNumber === parseInt(body.contactNumber)
            ) {
              return res
                .status(400)
                .json({ message: "Contact Number Already Exits" });
            }
            if (element.id != tokenId && element.email === body.email) {
              return res
                .status(400)
                .json({ message: "Contact Email Already Exits" });
            }
          }
        }
      }
      update.updated_at = new Date();
      const updatedData = await this.usersService.updateUser(
        existingUserData.id,
        update
      );
      const token = this.jwt.tokenJwt(updatedData);
      res.status(200).json({ ...updatedData, token });
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  // change password
  userPasswordChange = async (req: Request, res: Response) => {
    try {
      const email = res.locals.user.email;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const update:any = {};
      if (newPassword === confirmPassword) {
        const user = await this.usersService.getUserData({ where: { email } });
        bcrypt.compare(oldPassword, user.password, async (err, data) => {
          if (err) throw err;

          if (data) {
            const salt = await bcrypt.genSalt(10);
            update.password = await bcrypt.hash(newPassword, salt);
            update.updated_at = new Date();
            await this.usersService.updateUser(user.id, update);
            res
              .status(200)
              .json({ Message: "Your password is updated successfully" });
          } else {
            res.status(400).json({ Message: "Your password is incorrect" });
          }
        });
      } else {
        res.status(400).json({ Message: "Password didn't match" });
      }
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  // delete users
  userDelete = async (req: Request, res: Response) => {
    try {
      const email: string = req.query.email as string;
      await this.usersService.deleteUser(email);
      await this.cache.deleteCacheData(res.locals.query.id);
      res.status(200).json({ "Deleted account was": email });
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  // add admin
  admin = async (req: Request, res: Response) => {
    try {
      const values = ["ADMIN"];
      await this.addUser.createNewUser(req, res, values);
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  //get route permission
  listOfRoute = async (req: Request, res: Response) => {
    try {
      const { operationsName, role }:any = req.query;
      const permissionList = await this.usersService.listOfRoute(operationsName,role);
      res.status(200).json(permissionList);
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  //add route permission
  addRoute = async (req: Request, res: Response) => {
    try {
      let { operationsName, role, routes }:any = req.body;
      const existingPermission = await this.usersService.findOnePermission({
        where: {
          operationsName: operationsName,
          role: role,
        },
      });
      if (!existingPermission) {
        role = role.toUpperCase();
        routes = this.permissions.permission[operationsName]
        const permissionAdded = await this.usersService.addPermission(operationsName,role,routes);
        res.status(200).json(permissionAdded);
      } else {
        res.status(403).json({ message: "Already Exist" });
      }
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  //delete route permission
  deleteRoute = async (req: Request, res: Response) => {
    try {
      const { operationsName, role }:any = req.query;
      await this.usersService.deletePermission(operationsName, role);
      res.status(200).json({ "Deleted id was": req.query.id });
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };
}
