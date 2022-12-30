import  express  from "express";
import {CartController} from './cartController';
import Auth from '../middleware/authMiddleware';

export class CartRoutes {

    public router = express.Router();
    public cartController : CartController;
    public authMiddleware : Auth;

    constructor () {
        this.cartController = new CartController();
        this.authMiddleware = new Auth();
    }

    
 cartRoute ():void {
     this.router.get("/getCart", this.authMiddleware.authOfUsers, this.cartController.getCartAllProduct);
     
     this.router.put("/addAndUpdateToCart", this.authMiddleware.authOfUsers, this.cartController.addAndUpdateToCart);
     
     this.router.delete("/deleteFromCart", this.authMiddleware.authOfUsers, this.cartController.deleteFromCart);

 }
    
}
