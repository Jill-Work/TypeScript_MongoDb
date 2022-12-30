import {ProductService} from './productService';
import cacheData from '../requests/usersCacheRequest';
import { Request, Response } from 'express';

interface result {
    main: any;
}

export class ProductController {

    public productService : ProductService;
    public cache : cacheData;

    constructor () {
        this.productService = new ProductService();
        this.cache = new cacheData();
    }


// get Product
 getProduct = async (req:Request, res:Response) => {
    try {
        const { id }:any = req.query ;
        const productCache:any = await this.cache.getCacheData(id);
        if (productCache != null) {
            return res.json(JSON.parse(productCache));
        } else {
            const product = await this.productService.getProduct({ where: { id } });
            await this.cache.setCacheData(id, product);
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(403).json({ message: error + ' Product Not Found!' });
    }
};

// list of product
 productList = async (req:Request, res:Response) => {
    try {
        const { productId, sellerId, productName, size, page }:any = req.query;
        let condition = {};
        if ((productId || sellerId) || (productId ? sellerId : productName) || (sellerId && productName) || (productName)) {
            condition = {
                where: {
                    $or: [
                        { id: { $regex: '%' + productId + '%' } },
                        { sellerId: { $regex: '%' + sellerId + '%' } },
                        { productName: { $regex: '%' + productName + '%' } },
                    ],
                },
            };
        } else if (size && page) {
            condition = {
                limit: parseInt(size),
                offset: parseInt(size) * (parseInt(page) - 1),
                attributes: { exclude: ['password'] },
            };
        } else if (condition = {}) {
            condition = { attributes: { exclude: ['password'] } };
        }
        const users = await this.productService.getProductList(condition);
        res.status(200).json(users);
    } catch (error) {
        res.status(403).json({ message: error + ' Server error occurred' });
    }
};

// add product
 addProduct = async (req:Request, res:Response) => {
    try {
        const data = req.body;
        data.sellerId = res.locals.user.id;
        let condition = {
            where: {
                $and:
                    [
                        { sellerId: res.locals.user.id },
                        { productName: data.productName },
                        { brand: data.brand },
                        { category: data.category },
                        { price: data.price }
                    ]
            }
        };
        const isProductExist = await this.productService.getProduct(condition);
        if (isProductExist == null) {
            const product = await this.productService.addProduct(data);
            res.status(403).json(product);
        } else {
            res.status(403).json({ message: ' Product Already Exits' });
        }
    } catch (error) {
        res.status(403).json({ message: error + ' Server error occurRed' });
    }
};

// update Product
 updateProduct = async (req:Request, res:Response) => {
    try {
        const { id, description, price, stock }:any = req.query;
        const isProductExist = await this.productService.getProduct({ where: { id } });
        if (isProductExist) {
            const update = {
                description: description,
                price: price,
                stock: stock,
                updated_at: new Date(),
            };
            const updatedProduct = await this.productService.updateProduct(id, update);
            res.status(200).json(updatedProduct);
        } else {
            res.status(403).json({ message: ' Product Not Found!' });
        }
    } catch (error) {
        res.status(403).json({
            message: error + `You can't update the product because Product not exist in the product list`
        });
    }
};

// delete Product
 deleteProduct = async (req:Request, res:Response) => {
    try {
        const { productId }:any = req.query;
        const isProductExist = await this.productService.getProduct({ where: { id: productId } });
        if (isProductExist) {
            await this.productService.deleteProduct(productId);
            await this.cache.deleteCacheData(productId);
            res.status(200).json({ "Deleted account was = ": productId });
        } else {
            res.status(403).json({ message: 'Product Not in List or Deleted!' });
        }
    } catch (error) {
        res.status(403).json({ message: error + 'Product Not Found!' });
    }
};




// filter Product
 productHistory = async (req:Request, res:Response) => {
    try {
        const result:any = await this.productService.getProductHistory(req, res);
        if (result) {
            res.status(200).json({
                message: result.productsHistory,
                count: result.count
            });
        }
    } catch (error) {
        res.status(403).json({ message: error + ' Server error occurred' });
    }
};

}

