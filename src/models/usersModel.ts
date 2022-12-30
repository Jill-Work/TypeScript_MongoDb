import mongoose, { Document, Schema } from "mongoose";

const usersModel: Schema = new mongoose.Schema({
    id: String,
    role:String,
    firstName:Number,
    lastName: Number,
    contactNumber:String,
    email:String,
    password: Number
  });
  
  const UsersModel = mongoose.model("users",usersModel);
  
  export default UsersModel

