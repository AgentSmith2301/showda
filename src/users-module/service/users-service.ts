import {usersRepoMethods} from '../repositories/users-repositories';
import { UserInputModel, UserViewModel } from '../types/users-type';
import {CastomErrors} from '../../errors/castomErrorsObject'
import { InsertOneResult } from 'mongodb';

export const usersServiceMethods = {
    async deleteAllUsers() {
        await usersRepoMethods.deleteAll()
    },

    async createdUser(data: UserInputModel) {
        const createdAt = new Date().toISOString();
        // TODO на случай если нужна будет где то проверка есть ли такой пользователь то исползуй этот код
        // const check: boolean = await usersRepoMethods.checkData(data.login, data.email);
        // if(check === true) { 
        //     const dilterData = {...data, createdAt};
        //     result = await usersRepoMethods.createUser(dilterData);
        // }
        
        const newUserData = {
            login: data.login,
            password: data.password,
            email: data.email,
            createdAt
        };

        const result = await usersRepoMethods.createUser(newUserData);
        if(result.acknowledged === true) {
            return await usersRepoMethods.getUsersById(result.insertedId);
        } else {
            return new Error(`{errorsMessages: [{message: 'incorect login or email', field: 'login or email'}]}`)
        }
        

        // createUserOrNot = {errorsMessages: [{message: 'incorect login or email', field: 'login or email'}]}


    },

    // async getUsers
    

}



