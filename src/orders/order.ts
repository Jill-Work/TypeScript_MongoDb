import  express  from "express";
import OrderController from "./orderController";
import Auth from "../middleware/authMiddleware";

let authMiddleware = new Auth();
let orderController = new OrderController();

export class OrderRoutes {
  router = express.Router();

  orderRoute() {
    this.router.get("/getOrder", authMiddleware.authOfUsers, orderController.getOrder);

    this.router.post("/createOrder", authMiddleware.authOfUsers, orderController.createOrder);
  }
}
