import { Request, Response } from "express";
import {AuthServiceMethods} from '../service/auth-service';
import { APIErrorResult, LoginInputModel, LoginSuccessViewModel, MeViewModel, CookieWithRefreshToken } from "../types/auth-type";
import { validationResult } from "express-validator";
import {castomError} from '../../errors/castomErrorsFromValidate';
import {jwtService} from '../application/jwt-service'
import {HttpStatusCode} from '../../types/httpStatus-enum'
import {resultStatusToHttpCode} from '../../helpers/resultStatusToHttpCode'
import { ResultStatus } from "../../types/resultStatus-enum";
import {CastomErrors} from '../../errors/castomErrorsObject';
import { cookiesGuard } from "../helpers/refreshTokenTypeGuard";
import { Refresh_Session_Token } from "../../types/refreshTokenType";
// import {CastomRequest} from '../types/auth-type'
import {injectable, inject} from "inversify";

@injectable()
export class AuthController {

    constructor(@inject(AuthServiceMethods) public authServiceMethods: AuthServiceMethods) {}

    async authorization(req: Request, res: Response) { 
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

        const userAgent = req.get('User-agent') ?? 'not faund' ;
        const refreshTokenJwt: string | undefined = req.cookies.refreshtoken;
        const ip = req.ip ?? 'not info';

        const response = await this.authServiceMethods.authentication(reqFilter, ip, userAgent, refreshTokenJwt) 
        if(!response.data) res.status(resultStatusToHttpCode(response.status!)).json({errorsMessages: [response.extensions![0]]});
        if(response.data) {
            res.cookie('refreshToken', response.data.refresh, {httpOnly: true, secure: true})
            res.status(resultStatusToHttpCode(response.status!)).send(response.data.access)
            
        }
    }

    async getDataById(req: Request, res: Response) { 
        const result = await this.authServiceMethods.getUserById(req.userId as string);
        if(!result.data) {
            res.status(resultStatusToHttpCode(result.status!)).send(ResultStatus.Unauthorized)
            return
        } 
        
        res.status(resultStatusToHttpCode(result.status!)).send(result.data)
    }

    async registrationUserController(req: Request, res: Response) {
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
        
        const result = await this.authServiceMethods.registrationUserService(req.body.login, req.body.password, req.body.email, req.headers.host!);

        switch(result.status) {
            case ResultStatus.BadRequest : 
                res.status(HttpStatusCode.BadRequest_400).send({errorsMessages: result.extensions})
                break;
            
            case ResultStatus.ServerError : 
                res.status(HttpStatusCode.ServerError_500).send(result.extensions) 
                break;

            case ResultStatus.NoContent :
                res.sendStatus(HttpStatusCode.NoContent_204)
                break;
        }
    }

    async confirmation_User_Fron_Code(req: Request, res: Response) {
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

        const isConfirmed = await this.authServiceMethods.code_Is_Confirmed(req.body.code);
        if(isConfirmed) {
            res.sendStatus(HttpStatusCode.NoContent_204);
        } else {
            // TODO можно изменить возвращаемую ошибку , сейчас возвращается только массив.
            // если пропишем так то ошибка будет возвращаться правильно
            // но тогда надо проверить все остальные пути написанные рание
            // castomError.errorsMessages = [{message: 'something wrong', field:'code'}]
            // res.status(400).send(castomError)

            castomError.errorsMessages = [{message: 'not correct code', field:'code'}]

            res.status(HttpStatusCode.BadRequest_400).send(castomError);
            castomError.errorsMessages = []; // очистка ошибок
            
        }

    }

    async resendEmail(req: Request, res: Response) {
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
        
        const data = await this.authServiceMethods.resendMail(req.body.email, req.headers.host!);
        switch (data.status) {
            
            case ResultStatus.NoContent :
                res.sendStatus(HttpStatusCode.NoContent_204);
                break;

            case ResultStatus.ServerError :
                res.status(HttpStatusCode.BadRequest_400).json({errorsMessages: data.extensions});
                break;

            case ResultStatus.BadRequest :
                res.status(HttpStatusCode.BadRequest_400).json({errorsMessages: data.extensions});
                break;
        
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        const tokenPayload: Refresh_Session_Token = req.tokenPayload;
        const ip = req.ip === undefined ? 'not info' : req.ip
        // if cookie empty
        if(!tokenPayload) res.sendStatus(HttpStatusCode.Unauthorized_401);

        const userAgent = req.get('User-agent') ?? 'not faund';
        const info = await this.authServiceMethods.refreshToken(tokenPayload, ip, userAgent)
        if(info.status === ResultStatus.BadRequest) res.status(HttpStatusCode.BadRequest_400).send(info.errorsMessages);
        if(info.status === ResultStatus.Unauthorized) res.status(HttpStatusCode.Unauthorized_401).send(info.errorsMessages);
        if(info.status === ResultStatus.ServerError) res.status(HttpStatusCode.ServerError_500).send(info.errorsMessages);
        if(info.status === ResultStatus.Success) {
            res.cookie('refreshToken',info.data?.refreshToken, {httpOnly: true, secure: true} )
            res.status(HttpStatusCode.Success_200).send({accessToken: info.data?.accessToken})
            return
        }
    }

    async logout(req: Request, res: Response) {
        const token = req.cookies ;
        const ip = req.ip === undefined ? 'not info' : req.ip
        // if cookie empty
        if(!token) res.sendStatus(HttpStatusCode.Unauthorized_401);
        // привидение к типу
        if(cookiesGuard(token)) {
            const responseFromService = await this.authServiceMethods.logoutWithToken(token.refreshToken);
            if(responseFromService.status === "Unauthorized") res.sendStatus(HttpStatusCode.Unauthorized_401);
            if(responseFromService.status === "NoContent") res.sendStatus(HttpStatusCode.NoContent_204);

        } else {
            res.sendStatus(HttpStatusCode.Unauthorized_401)
        }

    }

    async passwordRecovery(req: Request, res: Response) {
        const errors = validationResult(req)
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

        const result = await this.authServiceMethods.passwordRecovery(req.body.email, req.headers.host!)
        switch(result.status) {
            case ResultStatus.NoContent :
                // res.sendStatus(HttpStatusCode.NoContent_204)
                res.status(204).send('no content')
                break
            
            case ResultStatus.ServerError :
                res.status(HttpStatusCode.BadRequest_400).json({errorsMessages: result.extensions});
                break;

            case ResultStatus.BadRequest :
                res.status(HttpStatusCode.BadRequest_400).json({errorsMessages: result.extensions});
                break;

            case ResultStatus.TooManyRequests :
                res.status(HttpStatusCode.TooManyRequests_429).json({errorsMessages: result.extensions});
                break;
        }
        

    }

    async newPassword(req: Request, res: Response) {
        const errors = validationResult(req)
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

        const password: string = req.body.newPassword;
        const recoveryCode: string = req.body.recoveryCode;

        const result = await this.authServiceMethods.new_Password_New_Code(password, recoveryCode)
        switch(result.status) {
            case ResultStatus.NoContent :
                res.sendStatus(HttpStatusCode.NoContent_204)
                break

            case ResultStatus.BadRequest :
                res.status(HttpStatusCode.BadRequest_400).json({errorsMessages: result.extensions});
                break
        }


    }

    // =========================== FRONT ============================

    async frontend_Side_Registration(req: Request, res: Response) {
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
        
        // наш url строго захардкоржен но можно было бы сделать просто /auth/registration-confirmation , а fetch сам допишет хост и порт
        const responseFetch = await fetch(`http://${hostName}/auth/registration-confirmation`, {
            method: 'post',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({code: samCode}),
        });

        if(!responseFetch.ok) {
            console.error(`WARNING , ${responseFetch.statusText}`); 
            res.set('Content-Type', 'text/html');
            res.status(400).send(pageFailed);
        } else {
            res.set('Content-Type', 'text/html');
            res.status(200).send(page);
        }
    }

    // для получения нового пароля 
    async frontend_Side_Get_Password(req: Request, res: Response) {
        
        const recoveryCode: string = req.query.recoveryCode as string;

        const page = `<body style="width:100%; height:100%; background-color:green; color:white; border:0; margin:50px 0; text-align:center;">
        <h1 style='font-size: 60px;'>INPUT NEW PASSWORD</h1>
        <input id="newPassword" type="password" placeholder="Enter new password">
        <button onclick = "callFetch()" style='font-size: 30px; margin-left: 20px;'>send</button>

        <script>

        function callFetch() {
            const newPassword = document.querySelector('#newPassword')?.value;

            fetch('/auth/new-password', {
                method: 'post',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({newPassword, recoveryCode: "${recoveryCode}"}), 
            })
            
        }
        </script>
        </body>`

        res.set('Content-Type', 'text/html');
        res.status(200).send(page);

    }

}