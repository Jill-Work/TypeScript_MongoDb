import  bcrypt  from 'bcrypt';
import {Request, Response} from "express";
import {UsersService} from "../users/usersServices";
import JwtCommon from './jwtCommon';


export default class AddUserCommon {

    public usersService : UsersService;
    public jwt : JwtCommon;

    constructor () {
        this.usersService = new UsersService();
        this.jwt = new JwtCommon();
    }



    //  Add User or Admin Function 
     createNewUser = async (req:Request, res:Response, values:any) => {
        const bodyData = req.body;
        const matchRole = values.find((element:any) => element == bodyData.role);
        if (!matchRole) {
            return res.status(400).json({ Message: "You are not authorize to this page" });
        }
        const existingUser = await this.usersService.getUserData({
            where: {
                $or: [
                    { email: bodyData.email },
                    { contactNumber: bodyData.contactNumber }
                ]
            }
        });
        if (!existingUser) {
            if (bodyData.password === bodyData.confirmPassword) {
                const salt = await bcrypt.genSalt(10);
                bodyData.password = await bcrypt.hash(bodyData.password, salt);
                const newUser = await this.usersService.creteUser(bodyData);
                const token = this.jwt.tokenJwt(newUser);
                const newUserDetail = { ...newUser, token };
                res.status(200).json({data: newUserDetail});
            } else {
                res.status(401).json({ Message: "Invalid Confirm Password" });
            }
        } else {
            res.status(401).json({ Message: "users Already exits" });
        }
        return;
    };

}

