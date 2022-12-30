import {Request,Response} from 'express';
import {CartService} from './cartService';
import {ProductService} from '../products/productService';

export class CartController {

    public cartService : CartService;
    public productService : ProductService;

    constructor () {
        this.cartService = new CartService();
        this.productService = new ProductService();
    }

    //  get cart
     getCartAllProduct = async (req:Request, res:Response) => {
        try {
            const cart = await this.cartService.getCartAllProduct(res.locals.user.id);
            res.status(200).json(cart);
        } catch (error) {
            res.status(403).json({ message: error + ' Server error occurred' });
        };
    };
    
    //  add to cart
     addAndUpdateToCart = async (req:Request, res:Response) => {
        try {
            const { productId, quantity }:any = req.query;
            const buyerId = res.locals.user.id;
            const getProduct = await this.productService.getProduct(productId);
            if (getProduct) {
                const cartData :object | any = {
                    buyerId: buyerId,
                    sellerId: getProduct.sellerId,
                    productId: getProduct.id,
                    price: getProduct.price,
                    quantity: quantity,
                    total: getProduct.price * quantity,
                    updated_at: new Date(),
                };
                const data = await this.cartService.addAndUpdateToCart(cartData, buyerId, productId, parseInt(quantity));
                res.status(200).json(data);
            } else {
                res.status(403).json({ message: "Product Not in List" });
            }
        } catch (error) {
            res.status(403).json({ message: error + ' Server error occurred' });
        };
    };
    
    //  delete to cart
     deleteFromCart = async (req:Request, res:Response,) => {
        try {
            const buyerId = res.locals.user.id;
            const productId:any | undefined = req.query.productId;
            await this.cartService.deleteFromCart(buyerId, parseInt(productId));
            res.status(403).json({ message: "Deleted Item was " + req.query.productId });
        } catch (error) {
            res.status(403).json({ message: error + ' Server error occurred' });
        };
    };

}

