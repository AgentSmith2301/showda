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
import { CreateUserData } from '../../users-module/types/users-type';
import { sendEmail } from '../adapters/nodemailer-adapter';
import { SETTINGS } from '../../settings';
import { usersServiceMethods } from '../../users-module/service/users-service';
import { queryUserRepositories } from '../../users-module/repositories/query-Repositories';
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

    async registrationUserService(login: string, password: string, email: string): Promise<Partial<Result>> { 
        // создать пользователя 
        const check = await usersServiceMethods.createdUser({login, password, email}, 1)
        // пользователь существует юзер , возвращаем ошибку если существует
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
        const result = await queryUserRepositories.checkUserById(check.id!);
        let userImformation: unknown ;
        if(!result) {
            return {
                status: ResultStatus.ServerError, 
                errorsMessages: 'failed to create a user, a database error', 
            }
        
        } else {
            userImformation = result.emailConfirmation
        }

        let textEmail: string;
        if(typeof userImformation === "object" && userImformation !== null && "confirmationCode" in userImformation) {
            let urlMap = `https://showda.vercel.app/check-email?code=${userImformation.confirmationCode}`
            textEmail = '<b style="font-size: 20px">для завершения регистрации</b> <a href= ' + urlMap + ' style="font-size: 20px">нажмите здесь</a>';

        } else {
            textEmail = `The confirmation code is not expelled, please try again.`;
        }
    
        //TODO для отправки писем нужно создать патерн adapters который будет отправлять письма и managers , папка с функциями конкретных
        // данных , например письмо с переотправкой кода или просто отправка кода
        //TODO так же отправку письма нужно поместить в try catch !!!!
        const information: MailInfo | APIErrorResult = await sendEmail(`${SETTINGS.EMAIL_SEND_FROM}`, 'Confirmation of the register', textEmail);
        
        if('response' in information) {
            return {
                status: ResultStatus.NoContent, 
                data: null, 
            }
        } else {
            // const message = 'errorsMessages' in information
            // if(message && information.errorsMessages)
            return {
                    status: ResultStatus.ServerError, 
                    errorsMessages: `${information.errorsMessages}` , // лучше передать строку 'failed to create a user, a database error'
                }
        }
        
        
    },

    //TODO если код подтверждения confirmationCode верный в базе данных меняем свойство isConfirmed с false на true
    // если не верный переотправляем код подтверждения на почту  


}

