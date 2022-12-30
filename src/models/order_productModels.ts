import mongoose, { Document, Schema } from "mongoose";

const orderProduct: Schema = new mongoose.Schema({
  orderId: String,
  // productId: { model: "products", key: "id" },
  productId:String,
  quantity: Number,
  price: Number,
  total: Number,
});

const OrderProduct = mongoose.model("OrderProduct", orderProduct);

export default OrderProduct
