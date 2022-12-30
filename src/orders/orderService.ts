import OrderModel from "../models/orderModel";
import OrderProduct from "../models/productModel"
import { NullCheck } from "../common/indexOfCommon";

export class OrderService {

  public null : NullCheck;
  public order : InstanceType<typeof OrderModel> ;
  public orderProduct : InstanceType<typeof OrderProduct>;

  constructor() {
    this.null = new NullCheck();
    this.order = new OrderModel();
    this.orderProduct = new OrderProduct();
  }


  // get order details
  getOrderDetails = async (buyer_id:string) => {
    try {
      return await this.orderProduct.findAll({ where: { buyer_id } });
    } catch (error) {
      return error;
    }
  };

  //  create order
  createOrder = async (orderData:object) => {
    try {
      return await this.order.create(orderData);
    } catch (error) {
      return error;
    }
  };

  //   create order product
  createOrderProduct = async (orderProduct:object) => {
    try {
      const data = await this.orderProduct.create(orderProduct);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };
}
