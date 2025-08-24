import { Request, Response } from "express";
import {authServiceMethods} from '../service/auth-service';
import { APIErrorResult, LoginInputModel, LoginSuccessViewModel, MeViewModel } from "../types/auth-type";
import { validationResult } from "express-validator";
import {castomError} from '../../errors/castomErrorsFromValidate';
import {jwtService} from '../application/jwt-service'
import {HttpStatusCode} from '../../types/httpStatus-enum'
import {resultStatusToHttpCode} from '../../helpers/resultStatusToHttpCode'
import { ResultStatus } from "../../types/resultStatus-enum";
import {CastomErrors} from '../../errors/castomErrorsObject';
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
    
    const result = await authServiceMethods.registrationUserService(req.body.login, req.body.password, req.body.email, req.headers.host!);

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

export async function confirmation_User_Fron_Code(req: Request, res: Response) {
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

    const isConfirmed = await authServiceMethods.code_Is_Confirmed(req.body.code);
    if(isConfirmed) {
        res.sendStatus(204);
    } else {
        // TODO можно изменить возвращаемую ошибку , сейчас возвращается только массив.
        // если пропишем так то ошибка будет возвращаться правильно
        // но тогда надо проверить все остальные пути написанные рание
        // castomError.errorsMessages = [{message: 'something wrong', field:'code'}]
        // res.status(400).send(castomError)

        res.status(400).send(castomError.errorsMessages = [{message: 'not correct code', field:'code'}]);
        castomError.errorsMessages = []; // очистка ошибок
        
    }

}

export async function resendEmail(req: Request, res: Response) {
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
    
    const data = await authServiceMethods.resendMail(req.body.email, req.headers.host!);
    switch (data.status) {
        case ResultStatus.NotFound :
            res.sendStatus(404).end(data.errorsMessages);
            break;
        
        case ResultStatus.NoContent :
            res.sendStatus(204);
            break;

        case ResultStatus.ServerError :
            res.sendStatus(400).end(data.errorsMessages)
        
    }
}

// =========================== FRONT ============================

export async function frontend_Side_Registration(req: Request, res: Response) {
    // это часть фронтенда и не относится к бэкенду поэтому роут не передет в бизнесс слой 
    // (этот маршрут нужен только для того что бы мы могли проверить наше приложение)
    // здесь мы выводим положительный или отрицательный исход на фронтенд 
    
    const page = `<body style="width:100%; height:100%; background-color:black; color:white; border:0; margin:50px 0; text-align:center;">
    <h1 style='font-size: 60px;'>Confirmation Page</h1>
    <p style='font-size: 40px'>confirmed</p>
    </body>`;

    const pageFailed = `<body style="width:100%; height:100%; background-color:red; color:black; border:0; margin:50px 0; text-align:center;">
    <h1 style='font-size: 60px;'>Confirmation Page</h1>
    <p style='font-size: 40px'>not confirmed, try again</p>
    </body>`;

    const samCode: string = req.query.code as string;
    const hostName = req.headers.host;

    const responseFetch = await fetch(`http://${hostName}/auth/registration-confirmation`, {
        method: 'post',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({code: samCode}),
    });

    if(!responseFetch.ok) {
        console.error('WARNING , request fetch not worked');
        res.set('Content-Type', 'text/html');
        res.status(400).send(pageFailed);
    } else {
        res.set('Content-Type', 'text/html');
        res.status(200).send(page);
    }
}




