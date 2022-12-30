import { OrderService } from "./orderService";
import { Request, Response } from "express";
import { CartService } from "../carts/cartService";
import { ProductService } from "../products/productService";
import { string } from "joi";

export default class OrderController {
  public orderService: OrderService;
  public cartService: CartService;
  public productService: ProductService;

  constructor() {
    this.orderService = new OrderService();
    this.cartService = new CartService();
    this.productService = new ProductService();
  }
  //  get order
  getOrder = async (req: Request, res: Response) => {
    try {
      const orderId = res.locals.user.id;
      const getOrderDetails = await this.orderService.getOrderDetails(orderId);
      res.status(200).json(getOrderDetails);
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };

  //  create order
  createOrder = async (req: Request, res: Response) => {
    try {
      const buyerId: any = res.locals.user.id;
      const sumOfCartValue = await this.cartService.sum(buyerId);
      const orderData = {
        buyerId: buyerId,
        address: req.body.address,
        contactNumber: parseInt(req.body.contactNumber),
        total: sumOfCartValue,
      };
      const finalOrder = await this.orderService.createOrder(orderData);
      const cartItems = await this.cartService.getCartAllProduct(
        res.locals.user.id
      );
      for (let i = 0; i < cartItems.length; i++) {
        const element = cartItems[i];
        const productDetails = await this.productService.getProduct(
          element.productId
        );
        const orderProduct = {
          orderId: finalOrder.id,
          sellerId: cartItems[i].sellerId,
          productId: cartItems[i].productId,
          quantity: cartItems[i].quantity,
          price: productDetails.price,
          total: cartItems[i].quantity * productDetails.price,
        };
        const stockUpdate: any = productDetails.stock - cartItems[i].quantity;
        await this.productService.updateProduct(productDetails.id, stockUpdate);
        await this.orderService.createOrderProduct(orderProduct);
        await this.cartService.deleteFromCart(
          res.locals.user.id,
          cartItems[i].productId
        );
      }
      res.status(200).json({
        message:
          "Your order placed successfully, Thankyou for shopping visit again.",
      });
    } catch (error) {
      res.status(403).json({ message: error + " Server error occurred" });
    }
  };
}
