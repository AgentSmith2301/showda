import {usersRepoMethods} from '../repositories/users-repositories';
import { ConfirmationInfo, CreateUserData, Paginator, SearchTermUsers, UserByTerm, UserInputModel, UserViewModel, UserViewModelDB, SearchObject, User_info_From_Busines } from '../types/users-type';
import {CastomErrors} from '../../errors/castomErrorsObject';
import { InsertOneResult, WithId } from 'mongodb';
import {queryUserRepositories} from '../repositories/query-Repositories';
import bcrypt from 'bcrypt';
// import { LoginInputModel } from '../types/users-type';
import { LoginInputModel } from '../../auth-module/types/auth-type';
import {v4} from 'uuid';
import {addHours} from 'date-fns'


export const usersServiceMethods = {
    
    async userSessionFromId() {
        
    },
    
    async deleteAllUsers(): Promise<void> {
        await usersRepoMethods.deleteAll()
    },

    async _generateHash(pass: string, salt: string): Promise<string> {
        // генерация хеша из пароля и соли 
        return await bcrypt.hash(pass, salt)
    },

    async authentication(data: LoginInputModel): Promise<boolean> {
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
    async createdUser(data: UserInputModel, shem = 0): Promise<false | UserViewModel> {
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
            const userById = await queryUserRepositories.getUsersById(result.insertedId.toString());
            return userById
        } else {
            throw new Error(`{errorsMessages: [{message: 'something went wrong , this is a program error', field: '😡'}]}`)
        }
    },

    async deleteUserById(id: string): Promise<boolean> {

        const findId = await queryUserRepositories.checkUserById(id);

        if(!findId) return false
        const result =  await usersRepoMethods.deleteUserById(id);
        if(result.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    },
    
    async getUsersByTerm(filter: SearchTermUsers): Promise<UserByTerm> {
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
    },

    async trustedCode(code: string):Promise<ConfirmationInfo | null> {
        return await queryUserRepositories.confirm_Code(code);
    },

    async confirmedDane(code: string): Promise<boolean> {
        return await usersRepoMethods.confirm(code);
    },

    async chenge_Conferm_Code(oldCode: string): Promise<string | undefined> {
        const new_Code = v4();
        return await usersRepoMethods.change_Confirm_Code_Repo(new_Code, oldCode);
    },

    async getUserById(id: string): Promise<{confirmationCode: string; email: string} | null> {
        const anser: WithId<UserViewModelDB> | null = await queryUserRepositories.checkUserById(id);
        
        if(!anser) {
            return null
        }
        
        return {
            confirmationCode: anser.emailConfirmation!.confirmationCode,
            email: anser.email!
        }
    },

    async terminate_User_If_Not_Email(id: string): Promise<boolean> {
        const result = await usersRepoMethods.deleteUserById(id);

        if(result.deletedCount >= 1) {
            return true
        } else {
            return false
        }
    },

    async get_User_By_Field(field: SearchObject): Promise<User_info_From_Busines | null> {
        return await queryUserRepositories.search_From_Field(field);
    }
}





