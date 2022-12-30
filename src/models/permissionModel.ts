import mongoose, { Document, Schema } from "mongoose";

const permission: Schema = new mongoose.Schema({
  id: String,
  operationsName: String,
  role: String,
  routes: String,
});

const Permission = mongoose.model("Permission", permission);

export default Permission
