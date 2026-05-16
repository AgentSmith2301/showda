import {WithId} from 'mongodb';
import { ConfirmationInfo, SearchTermUsers, User_info_From_Busines, UserViewModel, UserViewModelDB } from "../../types/users-type";
import {SearchObject} from '../../types/users-type';
import { injectable, inject } from 'inversify';
import { Users } from "../model/users-model";
import mongoose from "mongoose";
import { SETTINGS } from "../../../settings";

@injectable()
export class QueryUserRepositories {
    
    constructor(@inject(SETTINGS.TYPES.usersModel) private usersModel: typeof Users) {}

    async checkUserById(id: string) {
        return await this.usersModel.findById({_id: new mongoose.Types.ObjectId(id)});
    }
    
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
    }

    async countDocuments(searchLoginTerm: string | null, searchEmailTerm: string | null) {
        const result = this.searshFilter(searchLoginTerm, searchEmailTerm)
        return await this.usersModel.countDocuments(result)
    } 

    async getUsersById(id: string): Promise<UserViewModel> {
        const user = await this.usersModel.findById({_id: new mongoose.Types.ObjectId(id)});
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
    }

    async getUsersByTerm(filter: SearchTermUsers): Promise<UserViewModelDB []> {
        let sortBy = filter.sortBy;
        let sortUpOrDown = filter.sortDirection;
        let pageNumber = filter.pageNumber; 
        let pageSize = filter.pageSize;
        
        const searshFilter = this.searshFilter(filter.searchLoginTerm, filter.searchEmailTerm);

        return await this.usersModel.find(searshFilter!)
            .sort({[sortBy!]: sortUpOrDown}) 
            .limit(pageSize!)
            .skip(Math.ceil((pageNumber! -1) * pageSize!))
            .exec();
        
    }

    async confirm_Code(code: string): Promise<ConfirmationInfo | null> {
        const result = await this.usersModel.findOne({'emailConfirmation.confirmationCode': code});
        
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
    }

    // поиск по отдельному свойству (или группе свойств)
    async search_From_Field(searchOdject: SearchObject): Promise<User_info_From_Busines | null> {
        
        const result =  await this.usersModel.findOne(searchOdject);
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

    async find_By_ConfirmationCode(filter: {confirmationCode: string}): Promise<WithId<UserViewModelDB> | null> {
        const transformFilter = {'emailConfirmation.confirmationCode': filter.confirmationCode}
        return  await this.usersModel.findOne(transformFilter);
    }
};



