import mongoose, { Document, Schema } from "mongoose";

const orderModel: Schema = new mongoose.Schema({
  id: String,
  // buyerId: { model: "user", key: "id" },
  buyerId:String,
  address: String,
  contactNumber: Number,
  total: Number,
});

const OrderModel = mongoose.model("OrderModel", orderModel);

export default OrderModel
