import mongoose, { Document, Schema } from "mongoose";

const productModel: Schema = new mongoose.Schema({
  id: String,
  // sellerId: { model: "user", key: "id" },
  sellerId:String,
  productName: String,
  image: Number,
  brand: Number,
  category: String,
  description: String,
  price: Number,
  stock: Number,
});

const ProductModel = mongoose.model("ProductModel", productModel);

export default ProductModel
