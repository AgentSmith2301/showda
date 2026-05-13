import {usersCollection} from "../../../db/mongoDb";
import {ObjectId, WithId} from 'mongodb';
import { CreateUserData, UserInputModel, UserViewModel, UserViewModelDB } from "../../types/users-type";
import {SETTINGS} from '../../../settings'
import { injectable, inject } from 'inversify';
import { Users } from "../model/users-model";
import mongoose from "mongoose";


@injectable()
export class UsersRepoMethods {

    constructor(@inject(SETTINGS.TYPES.usersModel) public userModel: typeof Users) {}
    
    async deleteAll(): Promise<void> {
        await this.userModel.deleteMany({})
    }

    async createUser(data: CreateUserData): Promise<false| UserViewModel> {
        let anser_DB // : HydratedDocument<UserViewModelDB>;
        let result //: UserViewModelDB;
        try{
            anser_DB = await this.userModel.create(data);
            result = anser_DB.toObject();
        } catch {
            console.log('error when creating user', anser_DB);
        }
        
        if(!result) {
            console.log('error when creating user');
            return false
        } else {
            return {
                id: result._id?.toString(),
                login: result.login,
                email: result.email,
                createdAt: result.createdAt
            }
        }
    }

    async change_Confirm_Code_Repo(newCode: string, oldCode: string, data: Date): Promise<string | undefined> {

        const chengeDTO = {'emailConfirmation.confirmationCode': newCode, 'emailConfirmation.expirationDate': data}

        const result: UserViewModelDB | null =  await this.userModel.findOneAndUpdate({'emailConfirmation.confirmationCode': oldCode}, chengeDTO, {new: true, upsert: false, projection: {_id: 0}});
        if(!result) {
            return undefined;
        } else {
            return result.emailConfirmation!.confirmationCode;
        }
    }

    async deleteUserById(id: string): Promise<{acknowledged: boolean; deletedCount: number;}> {
        // return await this.userModel.deleteOne({_id: new ObjectId(id)})
        return await this.userModel.deleteOne({_id: new mongoose.Types.ObjectId(id)})

    }

    async checkUserById(id: string) {
        // const result = await this.userModel.findOne({_id: new ObjectId(id)})
        const result = await this.userModel.findById({_id: new mongoose.Types.ObjectId(id)})
        return result
    }

    async checkAuthentication(data: string): Promise<boolean> {
        const filter = {$or: [{login: data}, {email: data}]};
        const result = await this.userModel.find(filter);


        if(result.length) {
            return true
        } else {
            return false
        }
    }

    async credential(data: string): Promise<{hash: string, salt: string}>  {
        const filter = {$or: [{login: data}, {email: data}]}
        const result: UserViewModelDB | null = await this.userModel.findOne(filter).select({hash: 1, salt: 1, _id: 0});
        if(!result) {
            // throw new Error(`{errorsMessages: [{message: 'user not found', field: '😡'}]}`)
            console.log('user not found');
        }

        return {
            hash: result!.hash,
            salt: result!.salt
        }
    }

    async confirm(code: string): Promise<boolean> {
        const result = await this.userModel.updateOne({'emailConfirmation.confirmationCode': code}, {$set:{'emailConfirmation.isConfirmed': true}});
        if(result.modifiedCount === 0) return false
        return true
    }

    async new_Password_With_Code(hash: string, code: string): Promise<boolean> {
        const result = await this.userModel.updateOne({'emailConfirmation.confirmationCode': code}, {$set: {hash: hash}});
        if(result.modifiedCount === 0) return false
        return true
    }

}