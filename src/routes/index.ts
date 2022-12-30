import express from "express";
import { UserRoutes } from "../users/users";
import {ProductRoute} from "../products/product";
import {CartRoutes} from "../carts/cart";
import {OrderRoutes} from "../orders/order";

export default class Routes {
  
  public router = express.Router();
  public users : UserRoutes;
  public products : ProductRoute;
  public cart : CartRoutes;
  public order : OrderRoutes;

  constructor () {
    this.users = new UserRoutes();
    this.products = new ProductRoute();
    this.cart = new CartRoutes();
    this.order = new OrderRoutes();
  }
 

   route() {
    this.router.use("/users", this.users.userRoute);

    this.router.use("/product", this.products.productRoute);

    this.router.use("/cart", this.cart.cartRoute);

    this.router.use("/order", this.order.orderRoute);
  }
}

module.exports = Routes