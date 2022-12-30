import  Joi  from "joi";
import {Request, Response ,NextFunction} from "express";


export default class ProductMiddleware {

    insertProduct = (req:Request, res:Response, next:NextFunction) => {
       const validation = Joi.object({
           productName: Joi.string().required(),
           seller: Joi.string(),
           image: Joi.string(),
           brand: Joi.string().required(),
           category: Joi.string().valid('Clothes', 'Laptops', 'Mobiles'),
           price: Joi.number().required(),
           description: Joi.string(),
           stock: Joi.string().required()
    
       }).unknown(false);//.unknown(true)
       const { error } = validation.validate(req.body, { abortEarly: false });
       if (error) {
           return res.status(400).json({ error: error.message });
       } else {
           console.log("Product Validation Successfully");
           next();
       }
    };
}



