import {APIErrorResult, CookieWithRefreshToken, LoginInputModel, MailInfo, MeViewModel, Sessions_Info, PayloadFromToken} from '../types/auth-type'
import {authRepoMethods} from '../repositories/auth-repositories'
import bcrypt from 'bcrypt';
import {Result} from '../../types/resultObject-type'
import { ResultStatus } from '../../types/resultStatus-enum';
import { auth_Query_RepoMethods } from '../repositories/auth-query-repositories';
// import { randomUUID } from 'crypto';
// import {v4} from 'uuid'
// import {addHours} from 'date-fns'
import { usersRepoMethods } from '../../users-module/repositories/users-repositories';
import { CreateUserData, User_info_From_Busines } from '../../users-module/types/users-type';
import { sendEmail } from '../adapters/nodemailer-adapter';
import { SETTINGS } from '../../settings';
import { usersServiceMethods } from '../../users-module/service/users-service';
import { queryUserRepositories } from '../../users-module/repositories/query-Repositories';
import { nodemailer_Managers } from '../managers/nodemailer-managers';
import {jwtService} from '../application/jwt-service'
import { ObjectId } from 'mongodb';
// import { UserDB } from '../../users-module/types/users-type';


export const authServiceMethods = {
    
    async authentication(data: LoginInputModel, ip: string | undefined): Promise<Partial<Result<{access: {accessToken: string}; refresh: string} | null>>> { 
        // проверка на существование пользователя с логином или почтой
        const result = await authRepoMethods.checkAuthentication(data.loginOrEmail)
        if(!result) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'not found login or email', 
                extensions: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}], 
                data: null 
            }
        }
        // получить хеш , соль и id
        const credention = await authRepoMethods.credential(data.loginOrEmail);

        // сравнение хешей
        const compareHash = await bcrypt.compare(data.password, credention.hash);
        if(!compareHash) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'password incorrect', 
                extensions: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}], 
                data: null 
            }
        }

        const accessToken = await jwtService.createJwtToken(credention.id);
        const refreshToken: string = await jwtService.createRefreshToken(credention.id);


        return {
            status: ResultStatus.Success , 
            extensions: [], 
            data: {access: accessToken, refresh: refreshToken} 
        }
    },

    async getUserById(id: string): Promise<Partial<Result<MeViewModel>>> {
        const result = await authRepoMethods.getUserById(id);
        if(!result) return {status: ResultStatus.Unauthorized , errorsMessages: 'id not found', data: undefined} 
        return {status: ResultStatus.Success , data: result}

    },

    async registrationUserService(login: string, password: string, email: string, hostName: string): Promise<Partial<Result>> { 
        // проверка на существование
        // TODO запрос должен идти из authService --> userService --> usersRepoMethods
        const checkLogin = await usersRepoMethods.checkAuthentication(login)
        const checkMail = await usersRepoMethods.checkAuthentication(email);
        let field_Name: string = '' ;
        if(checkLogin) {
            field_Name = 'login';
        } 

        if(checkMail) {
            field_Name = 'email';
        }
        
        // создать пользователя 
        const check = await usersServiceMethods.createdUser({login, password, email}, 1)
        // пользователь существует , возвращаем ошибку если существует
        if(!check) { 
            return {
                status: ResultStatus.BadRequest, 
                errorsMessages: 'Login or mail exist', 
                extensions: 
                    [
                        {
                            message: 'incorect login or email', 
                            field: field_Name,
                        }
                    ], 
            }
        }
        // проверяем создался ли пользователь
        const result = await usersServiceMethods.getUserById(check.id!)
        if(!result) {
            return {
                status: ResultStatus.ServerError, 
                errorsMessages: 'failed to create a user, a database error', 
            }
        
        } 

        let resultDTO: {confirmationCode: string; email: string, host: string} = {
            confirmationCode: result.confirmationCode,
            email: result.email!,
            host: hostName
        };
        // отправка письма в менеджер
        const information: MailInfo | APIErrorResult = await nodemailer_Managers.confirmation_Mail(resultDTO);
        
        if('response' in information) {
            return {
                status: ResultStatus.NoContent, 
                data: null, 
            }
        } else {
            //TODO сделать счетчик запросов после чего определенного кол-во запросов удалить пользователя
            // или после устарения expirationDate в базе.

            return {
                    status: ResultStatus.ServerError, 
                    errorsMessages: `${information.errorsMessages[0].message}` , 
            }
        }
    },

    // если код подтверждения confirmationCode верный в базе данных меняем свойство isConfirmed с false на true
    async code_Is_Confirmed(code: string): Promise<boolean> {
        const isTrusted = await usersServiceMethods.trustedCode(code);
        if(!isTrusted) return false
        if(isTrusted.isConfirmed) return false
        if(new Date() > isTrusted.expirationDate) return false
        return await usersServiceMethods.confirmedDane(code);
    },
    
    // переотправка письма 
    async resendMail(email: string, host: string): Promise<Partial<Result>> {
        // найти пользователя по почте 
        const user_Exist: User_info_From_Busines | null = await usersServiceMethods.get_User_By_Field({email});
        if(!user_Exist) {
            return {
                status: ResultStatus.BadRequest,
                // errorsMessages: '{errorsMessages: [{ message: "email not faund" , field: "email" }]}',
                extensions: [{ message: "email not faund" , field: "email" }],
            }
        }

        // если пользователь подтвержден возвращаем ошибку
        if(user_Exist.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                // errorsMessages: 
                extensions: [{ message: "The mail has already been confirmed" , field: "email" }],
            }
        }

        // замена кода подтверждения 
        const newCode: string | undefined = await usersServiceMethods.chenge_Conferm_Code(user_Exist.emailConfirmation.confirmationCode);
        // если код не заменен
        if(!newCode) {
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: `error in database` , 
                extensions: [{ message: "something went wrong in the database" , field: "email" }]
            }
        }

        // формируем объект для отправки письма 
        const emailDTO = {confirmationCode: newCode, email, host}
        // если пользователь с такой почтой есть то отправляем ему письмо 
        const information = await nodemailer_Managers.confirmation_Mail(emailDTO);

        if('response' in information) {
            return {
                status: ResultStatus.NoContent, 
                data: null, 
            }
        } else {
            return {
                status: ResultStatus.ServerError, 
                errorsMessages: `${information.errorsMessages}` , 
            }
        }
        
    },
    
    async refreshToken(token: CookieWithRefreshToken, ip: string): Promise<Result<{accessToken: string; refreshToken: string}| null>> { 
        // проверика токена
        const payloadFromToken = await jwtService.getPayloadByToken(token.refreshToken);
        if(!payloadFromToken) { 
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'user is not unauthorized', 
                extensions: [{message: 'not valid refresh token', field: 'refresh token'}], 
                data: null 
            }
        }

        // запрос в базу для проверки сессии в блек лист 
        const blackList = await authRepoMethods.checkBlackList(payloadFromToken.id, token.refreshToken);
        if(blackList.length !== 0) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'bad request', 
                extensions: [{message: 'token has in black list', field: 'refresh token'}], 
                data: null 
            }
        }

        // время плюс один час
        let timeNow = new Date();
        const timePlusOneHour = new Date(timeNow.setHours(timeNow.getHours() + 1))

        const sessionDTO: Sessions_Info = {
            userId: payloadFromToken.id,
            ip,
            refreshToken: token.refreshToken,
            createdAt: payloadFromToken.iat,
            expiresAt: payloadFromToken.exp,
            revokedAt: timePlusOneHour,
        }

        const sessionInfo = await authRepoMethods.createSession(sessionDTO);
        if(!sessionInfo) {
            return {
                status: ResultStatus.ServerError , 
                errorsMessages: 'something went wrong, please try again', 
                extensions: [{message: 'the database is not responding', field: 'DB'}], 
                data: null 
            }

        } else {

            const accessToken = await jwtService.createJwtToken(payloadFromToken.id);
            const refreshToken: string = await jwtService.createRefreshToken(payloadFromToken.id);
            return {
                status: ResultStatus.Success,
                errorsMessages: '', 
                extensions: [],
                data: {
                    accessToken: accessToken.accessToken,
                    refreshToken
                }
            }
        }
    
    },

    async logoutWithToken(token: string, ip: string): Promise<Result<PayloadFromToken | null>> {
        const validTokenOrNot = await jwtService.getPayloadByToken(token);
        if(!validTokenOrNot) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'user is not unauthorized', 
                extensions: [{message: 'not valid refresh token', field: 'refresh token'}], 
                data: null 
            }

        } else {
            // время плюс один час
            let timeNow = new Date();
            const timePlusOneHour = new Date(timeNow.setHours(timeNow.getHours() + 1))

            const sessionDTO: Sessions_Info = {
                userId: validTokenOrNot.id,
                ip,
                refreshToken: token,
                createdAt: validTokenOrNot.iat,
                expiresAt: validTokenOrNot.exp,
                revokedAt: timePlusOneHour,
            }

            const sessionInfo = await authRepoMethods.createSession(sessionDTO);
            if(!sessionInfo) {
                return {
                    status: ResultStatus.ServerError , 
                    errorsMessages: 'something went wrong, please try again', 
                    extensions: [{message: 'the database is not responding', field: 'DB'}], 
                    data: null 
                }

            } else {

                return {
                    status: ResultStatus.NoContent,
                    errorsMessages: '', 
                    extensions: [],
                    data: validTokenOrNot
                }
            }
        
        }
    },


}









