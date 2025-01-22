import { Request, Response } from "express";
import {usersServiceMethods} from '../service/users-service';
import { LoginInputModel } from "../types/users-type";
import { validationResult } from "express-validator";
import {castomError} from '../../errors/castomErrorsFromValidate';


export async function authorization(req: Request, res: Response) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const filterErrors = errors.array({onlyFirstError: true}).map((error: any) => ({ 
                message: error.msg.message || error.msg,
                field: error.path
            }))
            filterErrors.map((value) => {
                castomError.errorsMessages.push(value);
            })
            
            res.status(400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
            return
        } 
    
    const reqFilter: LoginInputModel = {
        loginOrEmail: req.body.loginOrEmail,
        password: req.body.password
    }

    const result = await usersServiceMethods.authentication(reqFilter)

    if(!result) res.status(401).json({errorsMessages: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}]});
    if(result) res.sendStatus(204)
    

}





