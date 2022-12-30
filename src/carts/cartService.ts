import CartModel from "../models/cartModel";
import { NullCheck } from "../common/indexOfCommon";

export class CartService {
  public null: NullCheck;
  public cartModel: InstanceType<typeof CartModel>;

  constructor() {
    this.null = new NullCheck();
    this.cartModel = new CartModel();
  }
  // get cart all product
  getCartAllProduct = async (buyer_id: string) => {
    try {
      const data = await this.cartModel.findAll({ where: { buyer_id } });
      return this.null.nullCheckWithOutDataValues(data);
    } catch (error) {
      return error;
    }
  };

  //sum of cart value
  sum = async (buyerId: any) => {
    try {
      const total = await this.cartModel.sum("total", { where: { buyerId }});
      return this.null.nullCheckWithOutDataValues(total);
    } catch (error) {
      return error;
    }
  };

  // add and update to cart
  addAndUpdateToCart = async (
    cartData: object,
    buyerId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      const foundItem = await this.cartModel.findOne({
        where: { buyerId, productId },
      });
      if (!foundItem) {
        const data = await this.cartModel.create(cartData);
        return this.null.nullCheckWithDataValues(data);
      } else {
        await this.cartModel.update(
          { quantity },
          { where: { buyerId, productId } }
        );
        return this.null.nullCheckWithOutDataValues(
          "quantity is updated successfully"
        );
      }
    } catch (error) {
      return error;
    }
  };

  // delete cart
  deleteFromCart = async (buyerId: string, productId: number) => {
    try {
      return await this.cartModel.destroy({
        where: {
          $and: [{ buyerId }, { productId }],
        },
      });
    } catch (error) {
      return error;
    }
  };
}
