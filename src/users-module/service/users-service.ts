import {usersRepoMethods} from '../repositories/users-repositories';
import { Paginator, UserInputModel, UserViewModel } from '../types/users-type';
import {CastomErrors} from '../../errors/castomErrorsObject'
import { InsertOneResult } from 'mongodb';
import {queryRepositories} from '../repositories/query-Repositories'

export const usersServiceMethods = {
    async deleteAllUsers() {
        await usersRepoMethods.deleteAll()
    },

    async createdUser(data: UserInputModel) {
        const createdAt = new Date().toISOString();

        const newUserData = {
            login: data.login,
            password: data.password,
            email: data.email,
            createdAt
        };
        const result = await usersRepoMethods.createUser(newUserData);
        if(result.acknowledged === true) {
            return await queryRepositories.getUsersById(result.insertedId.toString());
        } else {
            // return new Error(`{errorsMessages: [{message: 'incorect login or email', field: 'login or email'}]}`)
            return new Error(`{errorsMessages: [{message: 'something went wrong , this is a program error', field: '😡'}]}`)

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



