// insert user
import  Joi  from "joi";
import  string  from "string-sanitizer";
import { Request , Response , NextFunction} from "express";

export default class InsertUserRequest {

userSignUpValidation = (req:Request, res:Response, next:NextFunction) => {
        const validation = Joi.object({
            role: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            contactNumber: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required(),
        })
            .unknown(false);//.unknown(true)
        const { error } = validation.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ "error": error.message });
        } else {
            const bodyData = req.body;
            bodyData.role = string.sanitize.removeNumber(bodyData.role);
            bodyData.firstName = string.sanitize.removeNumber(bodyData.firstName);
            bodyData.lastName = string.sanitize.removeNumber(bodyData.lastName);
            // bodyData.email = string.validate.isEmail(bodyData.email)     //email validation
            bodyData.role = bodyData.role.toUpperCase();
            bodyData.firstName = bodyData.firstName.charAt(0).toUpperCase() + bodyData.firstName.slice(1);
            bodyData.lastName = bodyData.lastName.charAt(0).toUpperCase() + bodyData.lastName.slice(1);
            console.log("Insert User Data Validation Check Successfully");
            next();
        }
    };

}
