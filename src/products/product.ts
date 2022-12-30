import  express  from "express";
import Auth from "../middleware/authMiddleware";
import {ProductController} from "./productController";
import ProductMiddleware from "../middleware/productMiddleware";

export class ProductRoute {

  public router = express.Router();
  public authMiddleware : Auth;
  public product : ProductController;
  public middleware : ProductMiddleware;

  constructor () {
    this.authMiddleware = new Auth();
    this.product = new ProductController();
    this.middleware = new ProductMiddleware();

  }

  productRoute():void {
    
    this.router.get("/product", this.product.getProduct);

    this.router.post("/addProduct",this.authMiddleware.authOfUsers,this.middleware.insertProduct,this.product.addProduct);

    this.router.put("/update/:id", this.product.updateProduct);

    this.router.delete("/delete", this.product.deleteProduct);

    this.router.get("/search", this.product.productHistory);
  }
}
