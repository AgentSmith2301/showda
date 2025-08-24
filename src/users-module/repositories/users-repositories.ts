import { usersCollection } from "../../db/mongoDb";
import {ObjectId, WithId} from 'mongodb';
import { CreateUserData, UserInputModel, UserViewModelDB } from "../types/users-type";
// import { LoginInputModel } from '../types/users-type';


export const usersRepoMethods = {
    async deleteAll(): Promise<void> {
        await usersCollection.deleteMany({})
    },

    // TODO поставить возвращаемый объект ответа базы при создании данных (Promise<????>)
    async createUser(data: CreateUserData) {
        return await usersCollection.insertOne(data)
    },

    // async userRegistration(user: CreateUserData) {
    //     return await usersCollection.insertOne(user);
    // },

    async deleteUserById(id: string): Promise<{acknowledged: boolean; deletedCount: number;}> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    },

    // async getUserById(id: string): Promise<WithId<UserViewModelDB> | null> {
    //     return await usersCollection.findOne({_id: new ObjectId(id)});
    // },

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