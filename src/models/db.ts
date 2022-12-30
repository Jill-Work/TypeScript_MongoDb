import { env } from "../config/env";
import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const router = express();
const client = new MongoClient(env.MONGO_URL);

mongoose.set("strictQuery", false);
mongoose.connect(env.MONGO_URL)
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((error: any) => {
    console.error("connection error  ", error);
  });

async function DataBaseConnect() {
  let result = await client.connect(); //connect database
  let db = result.db("mini-amazon"); //  pass database
  // return db.collection("users"); //  pass collection or table
}
