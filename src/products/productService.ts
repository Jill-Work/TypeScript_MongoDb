import {Request , Response} from 'express';
import ProductModel from "../models/productModel";
import {NullCheck } from "../common/indexOfCommon";
import UserCacheRequest from "../requests/usersCacheRequest";

export class ProductService {

  public null : NullCheck;
  public product : InstanceType<typeof ProductModel>;
  public cache : UserCacheRequest;
  
  constructor () {
    this.null = new NullCheck();
    this.product = new ProductModel();
    this.cache = new UserCacheRequest();
  }

  // get single product
  getProduct = async (condition:any) => {
    try {
      const data = await this.product.findOne(condition);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // list of product
  getProductList = async (condition:any) => {
    try {
      const data = await this.product.findAll(condition);
      return this.null.nullCheckWithOutDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // insert product
  addProduct = async (data:object) => {
    try {
      const newProduct = await this.product.create(data);
      await this.cache.setCacheData(newProduct.dataValues.id, data);
      return this.null.nullCheckWithOutDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // update stock ,  price
  updateProduct = async (id:string, update:object) => {
    try {
      await this.product.update(update, { where: { id } });
      const data = await this.product.findOne({ where: { id } });
      await this.cache.setCacheData(data.dataValues.id, data);
      return this.null.nullCheckWithDataValues(data);
    } catch (error) {
      return error;
    }
  };

  // delete product
  deleteProduct = async (id:string) => {
    try {
      return await this.product.destroy({ where: { id } });
    } catch (error) {
      return error;
    }
  };

  // Search Product
  getProductHistory = async (req: Request, res: Response) => {
  //   try {
  //     const { search, filters, limit, offset }: any  = req.query ;
  //     let where = {};
  //     if (search) {
  //       where = {
  //         $or: [{ productName: { $regex: "%" + search + "%" } }],
  //       };
  //     }

  //     if (filters) {
  //       if (filters.category) {
  //         where = {
  //           ...where,
  //           category: filters.category,
  //         };
  //       }
  //       if (filters.brand) {
  //         where = {
  //           ...where,
  //           brand: filters.brand,
  //         };
  //       }
  //       if (filters.price) {
  //         where = {
  //           ...where,
  //           price: filters.price,
  //         };
  //       }
  //     }
  //     let condition = {
  //       where,
  //       order: [["id", "DESC"]],
  //     };

  //     if (limit && offset) {
  //       condition = {
  //         ...condition,
  //         limit : parseInt(limit),
  //         offset : parseInt(offset),
  //       };
  //     }

  //     const productsHistory:any = await this.product.findAll(condition);
  //     const count = productsHistory ? productsHistory.length : 0;
  //     if (productsHistory) {
  //       return { productsHistory:Object, count:Number };
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  };
}
