import { Request, Response } from "express";
import {authServiceMethods} from '../service/auth-service';
import { APIErrorResult, LoginInputModel, LoginSuccessViewModel, MeViewModel } from "../types/auth-type";
import { validationResult } from "express-validator";
import {castomError} from '../../errors/castomErrorsFromValidate';
import {jwtService} from '../application/jwt-service'
import {HttpStatusCode} from '../../types/httpStatus-enum'
import {resultStatusToHttpCode} from '../../helpers/resultStatusToHttpCode'
import { ResultStatus } from "../../types/resultStatus-enum";
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
        
        res.status(HttpStatusCode.BadRequest_400).send(castomError);
        castomError.errorsMessages = []; // очистка ошибок
        return
    } 

    const reqFilter: LoginInputModel = {
        loginOrEmail: req.body.loginOrEmail,
        password: req.body.password
    }

    const response = await authServiceMethods.authentication(reqFilter)
    if(!response.data) res.status(resultStatusToHttpCode(response.status!)).json({errorsMessages: [response.extensions![0]]});
    if(response.data) {
        const token = await jwtService.createJwtTocen(response.data.id);
        res.status(resultStatusToHttpCode(response.status!)).send(token)
    }
}

export async function getDataById(req: Request, res: Response) { 
    const result = await authServiceMethods.getUserById(req.userId as string);
    if(!result.data) {
        res.status(resultStatusToHttpCode(result.status!)).send(ResultStatus.Unauthorized)
        return
    } 
    
    res.status(resultStatusToHttpCode(result.status!)).send(result.data)
}

export async function registrationUserController(req: Request, res: Response) {
    const result = await authServiceMethods.registrationUserService(req.body.login, req.body.password, req.body.email);
    // получаем ответ от сервиса , если отрицательное значение возвращаем статус 400 и ошибку
    // TODO check result and send response from user

    switch(result.status) {
        case ResultStatus.BadRequest : 
            res.status(400).send(result.extensions)
            break;
        
        case ResultStatus.ServerError : 
            res.status(500).send(result.extensions)
            break;

        case ResultStatus.NoContent :
            res.sendStatus(204)
            break;
    }

}