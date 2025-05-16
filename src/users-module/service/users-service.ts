import {usersRepoMethods} from '../repositories/users-repositories';
import { CreateUserData, Paginator, SearchTermUsers, UserInputModel, UserViewModel } from '../types/users-type';
import {CastomErrors} from '../../errors/castomErrorsObject';
import { InsertOneResult } from 'mongodb';
import {queryUserRepositories} from '../repositories/query-Repositories';
import bcrypt from 'bcrypt';
// import { LoginInputModel } from '../types/users-type';
import { LoginInputModel } from '../../auth-module/types/auth-type';
import {v4} from 'uuid';
import {addHours} from 'date-fns'




export const usersServiceMethods = {
    async deleteAllUsers() {
        await usersRepoMethods.deleteAll()
    },

    async _generateHash(pass: string, salt: string) {
        // генерация хеша из пароля и соли 
        return await bcrypt.hash(pass, salt)
    },

    async authentication(data: LoginInputModel) {
        // проверка на существование пользователя с логином или почтой
        const result = await usersRepoMethods.checkAuthentication(data.loginOrEmail)
        if(!result) return false

        // для получения хеша из базы
        const credention = await usersRepoMethods.credential(data.loginOrEmail)

        // сравнение хешей
        const compareHash = await bcrypt.compare(data.password, credention.hash)
        if(!compareHash) return false
        return true 
    },

    // добавить аргумент shem для реализации одного из 2 сценариев 
    async createdUser(data: UserInputModel, shem = 0) {
        const checkLogin = await usersRepoMethods.checkAuthentication(data.login)
        const checkMail = await usersRepoMethods.checkAuthentication(data.email);
        if(checkLogin || checkMail) return false;

        const createdAt = new Date().toISOString();
        let salt;
        let hash;
        try {
            salt = await bcrypt.genSalt(10);
            hash = await this._generateHash(data.password, salt)
        } catch {
            throw new Error(`{errorsMessages: [{message: 'error when generating hash or salt', field: '😡'}]}`)
        }

        let newUserData: CreateUserData;
        if(shem === 1) {
            newUserData = {
                login: data.login,
                email: data.email,
                hash,
                salt ,
                createdAt,
                emailConfirmation: {   
                    confirmationCode: v4(), 
                    expirationDate: addHours(new Date(), 1), 
                    isConfirmed: false
                }
            }
        } else {
            newUserData = {
                login: data.login,
                email: data.email,
                hash,
                salt,
                createdAt
            }
        }

        const result = await usersRepoMethods.createUser(newUserData);
        if(result.acknowledged === true) {
            return await queryUserRepositories.getUsersById(result.insertedId.toString());
        } else {
            throw new Error(`{errorsMessages: [{message: 'something went wrong , this is a program error', field: '😡'}]}`)
        }
    },

    async deleteUserById(id: string) {

        const findId = await queryUserRepositories.checkUserById(id);

        if(!findId) return false
        const result =  await usersRepoMethods.deleteUserById(id);
        if(result.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    },
    
    async getUsersByTerm(filter: SearchTermUsers) {  // : Promise<Paginator<UserViewModel []>>
        const cauntDocument = await queryUserRepositories.countDocuments(filter.searchLoginTerm, filter.searchEmailTerm)
        const result = await queryUserRepositories.getUsersByTerm(filter)
        let mapingData: UserViewModel[] = [];

        
        for(let i of result) {
            mapingData.push({
                id: i._id!.toString(),
                login:i.login,
                email: i.email,
                createdAt: i.createdAt
            })
        }

        let answer = {
            pagesCount: Math.ceil(cauntDocument/filter.pageSize),
            page: filter.pageNumber,
            pageSize: filter.pageSize,
            totalCount:  cauntDocument,
            items: mapingData
        };

        return answer
    }
}





