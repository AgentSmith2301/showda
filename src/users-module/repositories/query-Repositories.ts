import { usersCollection } from "../../db/mongoDb";
import {ObjectId, WithId} from 'mongodb';
import { ConfirmationInfo, SearchTermUsers, User_info_From_Busines, UserViewModel, UserViewModelDB } from "../types/users-type";
import {SearchObject} from '../types/users-type'

export const queryUserRepositories = {
    async checkUserById(id: string) {
        return await usersCollection.findOne({_id: new ObjectId(id)})
    },
    
    searshFilter(searchLoginTerm: string | null, searchEmailTerm: string | null) {
        type sortTerm = {login?: {$regex: string, $options: 'i'}, email?: {$regex: string, $options: 'i'}} |
        {$or: [{login: {$regex: string, $options: 'i'}}, {email: {$regex: string, $options: 'i'}}]}
        let sortedFilter: sortTerm = {} ; 
        
        if(searchLoginTerm && searchEmailTerm) {
            sortedFilter = {$or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {email: {$regex: searchEmailTerm, $options: 'i'}}]}
            return sortedFilter

        } else if(searchLoginTerm) {
            sortedFilter.login = {$regex: searchLoginTerm, $options: 'i'}
        } else if(searchEmailTerm) {
            sortedFilter.email = {$regex: searchEmailTerm, $options: 'i'}
        } 
        return sortedFilter
    },
    
    async countDocuments(searchLoginTerm: string | null, searchEmailTerm: string | null) {
        const result = queryUserRepositories.searshFilter(searchLoginTerm, searchEmailTerm)
        return await usersCollection.countDocuments(result);
    } ,

    async getUsersById(id: string): Promise<UserViewModel> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        let mapUSer ;
        if(user) {
            mapUSer = {
                id: user._id.toString(),
                login: user.login as string,
                email: user.email as string,
                createdAt: user.createdAt as string
            }
        }
        return mapUSer!
    },

    async getUsersByTerm(filter: SearchTermUsers): Promise<UserViewModelDB []> {
        let sortBy = filter.sortBy;
        let sortUpOrDown = filter.sortDirection;
        let pageNumber = filter.pageNumber; 
        let pageSize = filter.pageSize;
        
        const searshFilter = queryUserRepositories.searshFilter(filter.searchLoginTerm, filter.searchEmailTerm);
        
        return await usersCollection
            .find(searshFilter!)
            .sort({[sortBy]: sortUpOrDown}) 
            .limit(pageSize)
            .skip(Math.ceil((pageNumber -1) * pageSize))
            .toArray();
    },

    async confirm_Code(code: string): Promise<ConfirmationInfo | null> {
        const result = await usersCollection.findOne({'emailConfirmation.confirmationCode': code});
        
        if(!result) {
            console.error('WARNING --> confirmationCode empty');
            return null;
        }
        
        const info_DTO_confirmation = {
            confirmationCode: result!.emailConfirmation!.confirmationCode,
            expirationDate: result!.emailConfirmation!.expirationDate,
            isConfirmed: result!.emailConfirmation!.isConfirmed
        };
        
        return info_DTO_confirmation;
    },

    // поиск по отдельному свойству (или группе свойств)
    async search_From_Field(searchOdject: SearchObject): Promise<User_info_From_Busines | null> {
        const result =  await usersCollection.findOne(searchOdject);
        if(!result) return null
        const User_Busines_DTO: User_info_From_Busines = {
            id: result!._id.toString(),
            login: result!.login!,
            email: result!.email!,
            hash: result!.hash,
            salt: result!.salt,
            createdAt: result!.createdAt!,
            emailConfirmation: result!.emailConfirmation!
        };
        
        return User_Busines_DTO
        
    }

};


    
    
