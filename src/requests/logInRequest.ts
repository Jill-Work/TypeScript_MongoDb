import  Joi  from "joi";
import { Request , Response , NextFunction} from "express";


export default class LogInRequest {
  checkLoginParameter = (req:Request, res:Response, next:NextFunction) => {
    const validation = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).unknown(false); //.unknown(true)
    const { error } = validation.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    } else {
      console.log("LogIn Validation Check Successfully");
      next();
    }
  };
}
