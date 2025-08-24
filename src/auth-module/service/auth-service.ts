import {APIErrorResult, LoginInputModel, MailInfo, MeViewModel} from '../types/auth-type'
import {APIErrorResult, LoginInputModel, MailInfo, MeViewModel} from '../types/auth-type'
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
// import { UserDB } from '../../users-module/types/users-type';


export const authServiceMethods = {
    
    async authentication(data: LoginInputModel): Promise<Partial<Result<{id: string} | null>>> { 
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

        return {
            status: ResultStatus.Success , 
            extensions: [], 
            data: {id: credention.id} 
        }
        const compareHash = await bcrypt.compare(data.password, credention.hash);
        if(!compareHash) {
            return {
                status: ResultStatus.Unauthorized , 
                errorsMessages: 'password incorrect', 
                extensions: [{message: 'incorect login, email or password', field: 'loginOrEmail or password'}], 
                data: null 
            }
        }

        return {
            status: ResultStatus.Success , 
            extensions: [], 
            data: {id: credention.id} 
        }
    },

    async getUserById(id: string): Promise<Partial<Result<MeViewModel>>> {
        const result = await authRepoMethods.getUserById(id);
        if(!result) return {status: ResultStatus.Unauthorized , errorsMessages: 'id not found', data: undefined} 
        return {status: ResultStatus.Success , data: result}

    },

    async registrationUserService(login: string, password: string, email: string, hostName: string): Promise<Partial<Result>> { 
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
                            field: 'Login or email'
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
        const information: MailInfo | APIErrorResult = await nodemailer_Managers.confirmation_Mail(resultDTO);
        
        if('response' in information) {
            return {
                status: ResultStatus.NoContent, 
                data: null, 
            }
        } else {
            //TODO сделать счетчик запросов после чего определенного кол-во запросов удалить пользователя
            // или после уустарения expirationDate в базе.
            // удалить пользователя , не смог отправить письмо
            // const terminateUser: boolean = await usersServiceMethods.terminate_User_If_Not_Email(check.id!)
            // const apruve: string = terminateUser? 'terminate': 'live';
            // console.log(`user is ${apruve}`);

            return {
                    status: ResultStatus.ServerError, 
                    errorsMessages: `${information.errorsMessages}` , 
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
        if(!user_Exist) return {
            status: ResultStatus.NotFound,
            errorsMessages: 'user not faund',
        }

        // формируем объект для отправки письма 
        const emailDTO = {confirmationCode: user_Exist!.emailConfirmation.confirmationCode, email, host}
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

}









