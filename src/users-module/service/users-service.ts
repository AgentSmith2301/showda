import {usersRepoMethods} from '../repositories/users-repositories';
import { Paginator, UserInputModel, UserViewModel } from '../types/users-type';
import {CastomErrors} from '../../errors/castomErrorsObject';
import { InsertOneResult } from 'mongodb';
import {queryRepositories} from '../repositories/query-Repositories';
import bcrypt from 'bcrypt';
import { LoginInputModel } from '../types/users-type';



export const usersServiceMethods = {
    async deleteAllUsers() {
        await usersRepoMethods.deleteAll()
    },

    async _generateHash(pass: string, salt: string) {
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

    async createdUser(data: UserInputModel) {
        const checkLogin = await usersRepoMethods.checkAuthentication(data.login)
        const checkMail = await usersRepoMethods.checkAuthentication(data.email);
        if(checkLogin || checkMail) return false;

        const createdAt = new Date().toISOString();
        let salt;
        let hash;
        try {
        // генерация соли
        salt = await bcrypt.genSalt(10);
        // генерация хеша из соли и пароля
        hash = await this._generateHash(data.password, salt)
        } catch {
            throw new Error(`{errorsMessages: [{message: 'error when generating hash or salt', field: '😡'}]}`)
        }

        const newUserData = {
            login: data.login,
            email: data.email,
            hash,
            salt,
            createdAt
        };
        const result = await usersRepoMethods.createUser(newUserData);
        if(result.acknowledged === true) {
            return await queryRepositories.getUsersById(result.insertedId.toString());
        } else {
            throw new Error(`{errorsMessages: [{message: 'something went wrong , this is a program error', field: '😡'}]}`)
        }
    },

    async deleteUserById(id: string) {
        const result =  await usersRepoMethods.deleteUserById(id);
        if(result.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    },
    
    async getUsersByTerm(filter: any) {  // : Promise<Paginator<UserViewModel []>>
        const cauntDocument = await queryRepositories.countDocuments(filter.searshLoginTerm, filter.searchEmailTerm)
        const result = await queryRepositories.getUsersByTerm(filter)
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



