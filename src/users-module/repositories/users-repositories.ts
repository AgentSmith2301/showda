import { usersCollection } from "../../db/mongoDb";
import {ObjectId} from 'mongodb';
import { CreateUserData, UserInputModel } from "../types/users-type";
import { LoginInputModel } from '../types/users-type';


export const usersRepoMethods = {
    async deleteAll() {
        await usersCollection.deleteMany({})
    },

    async createUser(data: CreateUserData) {
        const result = await usersCollection.insertOne({...data})
        return result 
    },

    async deleteUserById(id: string) {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
        return result ;
    },

    async checkAuthentication(data: string): Promise<boolean> {
        const filter = {$or: [{login: data}, {email: data}]}
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
    }

}