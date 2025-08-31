import { usersCollection } from "../../db/mongoDb";
import {ObjectId, WithId} from 'mongodb';
import { CreateUserData, UserInputModel, UserViewModelDB } from "../types/users-type";
// import { LoginInputModel } from '../types/users-type';


export const usersRepoMethods = {
    async deleteAll(): Promise<void> {
        await usersCollection.deleteMany({})
    },

    async createUser(data: CreateUserData) {
        return await usersCollection.insertOne(data)
    },

    async change_Confirm_Code_Repo(newCode: string, oldCode: string): Promise<string | undefined> {
        const result =  await usersCollection.findOneAndUpdate({'emailConfirmation.confirmationCode': oldCode}, {$set: {'emailConfirmation.confirmationCode': newCode}});
        if(!result) {
            return undefined;
        } else {
            return result.emailConfirmation!.confirmationCode
        }
    },

    async deleteUserById(id: string): Promise<{acknowledged: boolean; deletedCount: number;}> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    },

    async checkUserById(id: string) {
        const result = await usersCollection.findOne({_id: new ObjectId(id)})
        return result
    },

    async checkAuthentication(data: string): Promise<boolean> {
        const filter = {$or: [{login: data}, {email: data}]};
        const result = await usersCollection.find(filter).toArray();


        if(result.length) {
            return true
        } else {
            return false
        }
    }, 

    async credential(data: string): Promise<{hash: string, salt: string}>  {
        const filter = {$or: [{login: data}, {email: data}]}
        const result = await usersCollection.findOne(filter, {projection: {_id:0, hash:1, salt: 1}});
        return result!
    },

    async confirm(code: string): Promise<boolean> {
        const result = await usersCollection.updateOne({'emailConfirmation.confirmationCode': code}, {$set:{'emailConfirmation.isConfirmed': true}});
        if(result.modifiedCount === 0) return false
        return true
    },



}