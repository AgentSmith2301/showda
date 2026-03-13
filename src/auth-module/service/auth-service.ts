import {APIErrorResult, CookieWithRefreshToken, LoginInputModel, MailInfo, MeViewModel, Sessions_Info, PayloadFromToken, LoginSuccessViewModel} from '../types/auth-type'
import {Refresh_Session_Token} from '../../types/refreshTokenType'
import {AuthRepoMethods} from '../repositories/auth-repositories'
import bcrypt from 'bcrypt';
import {Result} from '../../types/resultObject-type'
import { ResultStatus } from '../../types/resultStatus-enum';
import { auth_Query_RepoMethods } from '../repositories/auth-query-repositories';
// import { randomUUID } from 'crypto';
import {v4} from 'uuid'
// import {addHours} from 'date-fns'
import { UsersRepoMethods } from '../../users-module/repositories/users-repositories';
import { CreateUserData, User_info_From_Busines } from '../../users-module/types/users-type';
import { sendEmail } from '../adapters/nodemailer-adapter';
import { SETTINGS } from '../../settings';
import { UsersServiceMethods } from '../../users-module/service/users-service';
import { queryUserRepositories } from '../../users-module/repositories/query-Repositories';
import { nodemailer_Managers } from '../managers/nodemailer-managers';
import {jwtService} from '../application/jwt-service'
import { ObjectId } from 'mongodb';
// import { UserDB } from '../../users-module/types/users-type';
// import {addSeconds} from 'date-fns'
import { injectable, inject } from "inversify";


// const usersServiceMethods = new UsersServiceMethods();
// const usersRepoMethods = new UsersRepoMethods();

@injectable()
export class AuthServiceMethods {
    
    constructor(
        @inject(AuthRepoMethods) public authRepoMethods: AuthRepoMethods,
        @inject(UsersServiceMethods) public usersServiceMethods: UsersServiceMethods,
        @inject(UsersRepoMethods) public usersRepoMethods: UsersRepoMethods

    ) {}

    async authentication(data: LoginInputModel, ip: string, userAgent: string , refreshTokenJwt: string | undefined): Promise<Partial<Result<{access: {accessToken: string}; refresh: string} | null>>> { 
        // Checking the existence of a user with a login or email
        const result = await this.authRepoMethods.checkAuthentication(data.loginOrEmail)
        if(!result) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'not found login or email', 
                extensions: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}], 
                data: null 
            }
        }
        // get hash, salt, and id
        const credention = await this.authRepoMethods.credential(data.loginOrEmail);

        // hash comparison
        const compareHash = await bcrypt.compare(data.password, credention.hash);
        if(!compareHash) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'password incorrect', 
                extensions: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}], 
                data: null 
            }
        } 
        
        const deviceId = v4();
        const accessToken = await jwtService.createJwtToken(credention.id);
        const refreshToken: string = await jwtService.createRefreshToken(credention.id, deviceId);
        const decodeRefreshPayload: {userId: string; diviceId: string; iat: number; exp: number;} = await jwtService.getInfoFromToken(refreshToken);
        const objectDTOsession: Sessions_Info = {
            userId: decodeRefreshPayload.userId, 
            deviceId,
            iat: new Date(decodeRefreshPayload.iat * 1000), 
            exp: new Date(decodeRefreshPayload.exp * 1000), 
            deviceName: userAgent,
            ip: ip
        }

        // if there was a token in the request
        if(refreshTokenJwt) {
            // checking the validity of the token in jwtService 
            let payload: Refresh_Session_Token | undefined = await jwtService.check_Refresh_Token_And_Return_Payload(refreshTokenJwt);
            if(!payload) { 
                return {
                    status: ResultStatus.BadRequest , 
                    errorsMessages: 'not valide token', 
                    extensions: [{message: 'not valide token', field: 'error in jwtService'}], 
                    data: null 
                }
            } else {
                // Checking if a session exists in the database
                const session = await this.authRepoMethods.getSessionsInfo(payload.userId, payload.deviceId);
                // We check the token and session in the database for compliance
                if(session?.iat.getTime() !== payload.iat * 1000) {
                    // If there is no session in the database, an error occurs.
                    return {
                        status: ResultStatus.BadRequest , 
                        errorsMessages: 'session not find', 
                        extensions: [{message: 'session not find in DB', field: 'DB'}], 
                        data: null 
                    }

                } else {
                    // If the data matches, we delete the session.
                    await this.authRepoMethods.deleteToken(payload.userId, payload.deviceId)
                }
            }
            
        }
        
        const isCreated = await this.authRepoMethods.createSession(objectDTOsession);
        if(isCreated) {
            return {
                status: ResultStatus.Success , 
                extensions: [], 
                data: {access: accessToken, refresh: refreshToken} 
            }
        } else {
            return {
                status: ResultStatus.ServerError , 
                extensions: [{message: 'DB not create session', field: 'this is MongoDB errors'}], 
                data: null 
            }
        }  

    }

    async getUserById(id: string): Promise<Partial<Result<MeViewModel>>> {
        const result = await this.authRepoMethods.getUserById(id);
        if(!result) return {status: ResultStatus.Unauthorized , errorsMessages: 'id not found', data: undefined} 
        return {status: ResultStatus.Success , data: result}

    }

    async registrationUserService(login: string, password: string, email: string, hostName: string): Promise<Partial<Result>> { 
        // проверка на существование
        // TODO запрос должен идти из authService --> userService --> usersRepoMethods
        const checkLogin = await this.usersRepoMethods.checkAuthentication(login)
        const checkMail = await this.usersRepoMethods.checkAuthentication(email);
        let field_Name: string = '' ;
        if(checkLogin) {
            field_Name = 'login';
        } 

        if(checkMail) {
            field_Name = 'email';
        }
        
        // создать пользователя 
        const check = await this.usersServiceMethods.createdUser({login, password, email}, 1)
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
        const result = await this.usersServiceMethods.getUserById(check.id!)
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
            return {
                    status: ResultStatus.ServerError, 
                    errorsMessages: `${information.errorsMessages[0].message}` , 
            }
        }

    }

    // если код подтверждения confirmationCode верный в базе данных меняем свойство isConfirmed с false на true
    async code_Is_Confirmed(code: string): Promise<boolean> {
        const isTrusted = await this.usersServiceMethods.trustedCode(code);
        if(!isTrusted) return false
        if(isTrusted.isConfirmed) return false
        if(new Date() > isTrusted.expirationDate) return false
        return await this.usersServiceMethods.confirmedDane(code);
    }
    
    // переотправка письма 
    async resendMail(email: string, host: string): Promise<Partial<Result>> {
        // найти пользователя по почте 
        const user_Exist: User_info_From_Busines | null = await this.usersServiceMethods.get_User_By_Field({email});
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
        const newCode: string | undefined = await this.usersServiceMethods.chenge_Conferm_Code(user_Exist.emailConfirmation.confirmationCode);
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
        
    }
    
    async refreshToken(token: Refresh_Session_Token, ip: string, userAgent: string): Promise<Result<{accessToken: string; refreshToken: string}| null>> { 

        const accessToken = await jwtService.createJwtToken(token.userId);
        const refreshToken: string = await jwtService.createRefreshToken(token.userId, token.deviceId);
        const refreshPayload = await jwtService.check_Refresh_Token_And_Return_Payload(refreshToken);

        const sessionDTO: Sessions_Info = {
            userId: token.userId, 
            deviceId: token.deviceId,  
            iat: new Date(refreshPayload!.iat * 1000),
            exp: new Date(refreshPayload!.exp * 1000),
            deviceName: userAgent,
            ip,
        }

        const sessionInfo = await this.authRepoMethods.updateSession(sessionDTO);
        if(!sessionInfo) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'something went wrong, please try again', 
                extensions: [{message: 'the database is not responding', field: 'DB'}], 
                data: null 
            }
        } else {
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
    }

    async logoutWithToken(token: string): Promise<Result<boolean>> {
        const validTokenOrNot = await jwtService.getPayloadByToken(token);
        if(!validTokenOrNot) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'user is not unauthorized', 
                extensions: [{message: 'not valid refresh token', field: 'refresh token'}], 
                data: false 
            }
        } 

        const result = await this.authRepoMethods.deleteToken(validTokenOrNot.userId, validTokenOrNot.deviceId);
        if(!result) console.log('something went wrong, the database is not responding')
        return {
            status: ResultStatus.NoContent , 
            errorsMessages: '', 
            extensions: [], 
            data: true 
        }
    }

    async getAllSessionsForUser(userId: string): Promise<Result<Sessions_Info[]>> {
        const data = await this.authRepoMethods.getAllSessionsForUser(userId);
        return {
            status: ResultStatus.Success , 
            errorsMessages: '', 
            extensions: [], 
            data: data 
        }
    }

    async deleteAllOtherSessions(userId: string, deviceId: string): Promise<Result<boolean>> {
        const data = await this.authRepoMethods.deleteAllOtherSessions(userId, deviceId)
        if(data) {
            return {
                status: ResultStatus.NoContent , 
                errorsMessages: '', 
                extensions: [], 
                data: true 
            }
        } else {
            return {
                status: ResultStatus.ServerError , 
                errorsMessages: 'Something went wrong, please try again.', 
                extensions: [{field: 'check conect with DB', message: 'the database did not confirm the request'}], 
                data: false 
            }
        }
    }

    async closeSession(userId: string, deviceId: string): Promise<Result<boolean>> {
        const data = await this.authRepoMethods.closeSession(userId, deviceId);
        if(data) {
            return {
                status: ResultStatus.NoContent , 
                errorsMessages: '', 
                extensions: [], 
                data: true 
            }
        } else {
            return {
                status: ResultStatus.ServerError , 
                errorsMessages: 'Something went wrong, please try again.', 
                extensions: [{field: 'check conect with DB', message: 'the database did not confirm the request'}],
                data: false 
            }
        }
    }


    async getInfoByDeviceId(deviceId: string): Promise<Result<Sessions_Info[]>> {
        const data = await this.authRepoMethods.getInfoByDeviceId(deviceId);
        return {
            status: ResultStatus.NoContent , 
            errorsMessages: '', 
            extensions: [], 
            data     
        }
    }

    async passwordRecovery(email: string, host: string): Promise<Partial<Result>> {
        const user = await this.usersServiceMethods.get_User_By_Field({email});
        if(!user) {
            return {
                // положительный ответ , даже кога пользователь не найден , 
                // что бы не давать информацию о том есть ли пользователь с таким email или нет
                status: ResultStatus.NoContent,
                
            }
        }

        const newCode: string | undefined = await this.usersServiceMethods.chenge_Conferm_Code(user.emailConfirmation.confirmationCode);
        if(!newCode) {
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: `error in database` , 
                extensions: [{ message: "something went wrong in the database" , field: "email" }]
            }
        }

        const emailDTO = {confirmationCode: newCode, email, host}
        const information = await nodemailer_Managers.recoveryPassword(emailDTO);

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


    }    

    async new_Password_New_Code(newPassword: string, code: string): Promise<Partial<Result>> {
        // проверяем есть ли пользователь с таким кодом для востановления пароля
        const user = await this.usersServiceMethods.get_User_By_confirmationCode({confirmationCode: code});
        if(!user) {
            return {
                status: ResultStatus.BadRequest,
                errorsMessages: 'code is not valid', 
                extensions: [{message: 'code is not valid or expired', field: 'recoveryCode'}], 
            }
        }

        // если код совпадает то меняем пароль
        const result = await this.usersServiceMethods.new_Password_From_Code(newPassword, code);

        if(result) {
            return {
                status: ResultStatus.NoContent, 
                data: null, 
            }
        } else {
            return {
                status: ResultStatus.BadRequest, 
                errorsMessages: 'something went wrong, please try again', 
                extensions: [{message: 'not found code or expired', field: 'DB'}], 
            }
        }

    }

}









