import { usersCollection } from "../../db/mongoDb";
import {ObjectId} from 'mongodb';
import { UserInputModel } from "../types/users-type";

export const usersRepoMethods = {
    async deleteAll() {
        await usersCollection.deleteMany({})
    },

    async createUser(data: UserInputModel & {createdAt: string}) {
        const result = await usersCollection.insertOne({...data})
        return result 
    },

    async deleteUserById(id: string) {
        const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
        return result ;
    }
}