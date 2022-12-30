import UsersModel from "../models/usersModel";
import Permission from "../models/permissionModel"
import {NullCheck } from "../common/indexOfCommon";
import UserCacheRequest from "../requests/usersCacheRequest";


export class UsersService {
  
  public null : NullCheck;
  public userModel: InstanceType<typeof UsersModel>;
  public permission: InstanceType<typeof Permission>;
  public cache : UserCacheRequest;

  constructor(){
    this.null = new NullCheck();
    this.userModel = new UsersModel();
    this.permission = new Permission();
    this.cache = new UserCacheRequest();
  };

  
  //get user
  getUserData = async (condition:any) => {
    try {
      const data = await this.userModel.findOne(condition);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // get users
  getUsersList = async (condition:any) => {
    try {
      const data = await this.userModel.findAll(condition);
      return this.null.nullCheckWithOutDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // sign up users
  creteUser = async (data:object) => {
    try {
      const newUserData = await this.userModel.create(data);
      delete newUserData.dataValues.password;
      await this.cache.setCacheData(newUserData.dataValues.id,newUserData.dataValues);
      return this.null.nullCheckWithDataValues(newUserData);
    } catch (error) {
      return error;
    }
  };

  // update users
  updateUser = async (id:string, update:object) => {
    try {
      await this.userModel.update(update, { where: { id } });
      const data = await this.userModel.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });
      await this.cache.setCacheData(data.dataValues.id, data.dataValues);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // delete users
  deleteUser = async (email:string) => {
    try {
      return await this.userModel.destroy({ where: { email } });
    } catch (error) {
      return error;
    }
  };

  // list of permission route
  listOfRoute = async (operationsName:string, role:string) => {
    try {
      let condition = {};
      if (operationsName) {
        condition = { where: { operationsName } };
      }
      if (role) {
        condition = { where: { role } };
      }
      const listOfPermission = await this.permission.findAll(condition);
      return this.null.nullCheckWithOutDataValues(listOfPermission);
    } catch (error) {
      return error;
    }
  };

  //find one route or permission name
  findOnePermission = async (condition:any) => {
    try {
      const data = await this.permission.findOne(condition);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // add permission route
  addPermission = async ( operationsName:string, role:string, routes:string ) => {
    try {
      const bodyData = { operationsName, role, routes };
      const data = await this.permission.create(bodyData);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };

  //delete permission route
  deletePermission = async (operationsName:string, role:string) => {
    try {
      return await this.userModel.destroy({ where: { operationsName, role } });
    } catch (error) {
      return error;
    }
  };
}
