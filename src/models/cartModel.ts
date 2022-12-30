import mongoose, { Document, Schema } from "mongoose";

const cartModule: Schema = new mongoose.Schema({
  id: String,
  // buyerId: { model: "users", key: "id" },
  // productId: { model: "products", key: "id" },
  buyerId:String,
  productId:String,
  price: { type: Number },
  quantity: { type: Number },
  total: { type: Number },
});
const CartModel:any =  mongoose.model("carts", cartModule);

export default CartModel
