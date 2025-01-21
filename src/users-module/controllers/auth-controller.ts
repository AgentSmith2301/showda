import { Request, Response } from "express";
import {usersServiceMethods} from '../service/users-service';
import { LoginInputModel } from "../types/users-type";


export async function authorization(req: Request, res: Response) {
    const reqFilter: LoginInputModel = {
        loginOrEmail: req.body.loginOrEmail,
        password: req.body.password
    }

    const result = await usersServiceMethods.authentication(reqFilter)

    if(!result) res.status(400).json({errorsMessages: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}]});
    if(result) res.sendStatus(204)
    

}




