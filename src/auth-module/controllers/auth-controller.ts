import { Request, Response } from "express";
import {authServiceMethods} from '../service/auth-service';
import { LoginInputModel, MeViewModel } from "../types/auth-type";
import { validationResult } from "express-validator";
import {castomError} from '../../errors/castomErrorsFromValidate';
import {jwtService} from '../application/jwt-service'
// import {CastomRequest} from '../types/auth-type'


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

    const response = await authServiceMethods.authentication(reqFilter)
    if(!response.result) res.status(401).json({errorsMessages: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}]});
    if(response.result) {
        const token = await jwtService.createJwtTocen(response.id!);
        res.status(200).send(token)
    }

}

export async function getDataById(req: Request, res: Response) { // CastomRequest
    const result = await authServiceMethods.getUserById(req.userId as string);
    res.status(200).send(result)
}