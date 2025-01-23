import { usersCollection } from "../../db/mongoDb";
import {ObjectId} from 'mongodb';
import { SearchTermUsers, UserViewModel, UserViewModelDB } from "../types/users-type";

export const queryRepositories = {
    searshFilter(searshLoginTerm: string | null, searchEmailTerm: string | null) {
        let sortedFilter: {login?: {$regex: string, $options: 'imsx'}, email?: {$regex: string, $options: 'imsx'}} = {} ;
        if(searshLoginTerm) {
            sortedFilter.login = {$regex: searshLoginTerm, $options: 'imsx'}
        } 
        if(searchEmailTerm) {
            sortedFilter.email = {$regex: searchEmailTerm, $options: 'imsx'}
        } 
        return sortedFilter
    },
    
    async countDocuments(searshLoginTerm: string | null, searchEmailTerm: string | null) {
        const result = queryRepositories.searshFilter(searshLoginTerm, searchEmailTerm)
        return await usersCollection.countDocuments(result);
    } ,

    async getUsersById(id: string): Promise<UserViewModel> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
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
        
        const searshFilter = queryRepositories.searshFilter(filter.searchLoginTerm, filter.searchEmailTerm);
        
        return await usersCollection
            .find(searshFilter)
            .sort({[sortBy]: sortUpOrDown}) 
            .limit(pageSize)
            .skip(Math.ceil((pageNumber -1) * pageSize))
            .toArray();
    },

};