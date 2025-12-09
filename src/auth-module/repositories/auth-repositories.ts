import { ObjectId, WithId } from "mongodb";
import { usersCollection, sessionsCollection } from "../../db/mongoDb";
import { MeViewModel, Sessions_Info } from "../types/auth-type";

export const authRepoMethods = {
    
    async createSession(sessions: Sessions_Info): Promise<boolean> {
        const anser = await sessionsCollection.insertOne(sessions);
        return anser.acknowledged
    },

    async checkBlackList(id: string, token: string): Promise<Sessions_Info[] | []> {
        return await sessionsCollection.find({$and: [{userId: {$eq: id}}, {refreshToken: {$eq: token}}]}).toArray();

    },
    
    async checkAuthentication(data: string): Promise<boolean> {
        const filter = {$or: [{login: data}, {email: data}]}
        // TODO authRepo не должен знать о usersCollection
        const result = await usersCollection.find(filter).toArray();
        if(result.length) {
            return true
        } else {
            return false
        }
    },

    async credential(data: string): Promise<{id: string, hash: string, salt: string}>  {
        const filter = {$or: [{login: data}, {email: data}]}
        // TODO authRepo не должен знать о usersCollection
        const result = await usersCollection.findOne(filter, {projection: {_id:1, hash:1, salt: 1}});
        return {id: result!._id.toString() , hash: result!.hash, salt: result!.salt}
    } ,

    async getUserById(id: string): Promise<MeViewModel | undefined> {
        const objectId = new ObjectId(id);
        // TODO authRepo не должен знать о usersCollection
        const user = await usersCollection.findOne({_id: objectId})
        if(!user) return undefined
        return {email: user.email!, login: user.login!, userId: id}
    },

    // async сheckingForUniqueness(login: string, email: string) {
    //     const checkLogin = await usersCollection.find({login}).toArray();
    //     const checkEmail = await usersCollection.find({email}).toArray();
    //     if(checkLogin.length > 0 || checkEmail.length > 0) {
    //         return true
    //     } else {
    //         return false
    //     }
    // },
    
}