import { ObjectId, WithId } from "mongodb";
import { usersCollection, sessionsCollection } from "../../db/mongoDb";
import { MeViewModel, Refresh_Session_Token, Sessions_Info } from "../types/auth-type";

export const authRepoMethods = {
    async getSessionsInfo(userId: string, deviceId: string): Promise<Sessions_Info | null> {
        return await sessionsCollection.findOne({userId, deviceId}, {projection: {_id: 0}})
    },

    async deleteToken(userId: string, deviceId: string): Promise<void> {
        await sessionsCollection.deleteOne({userId, deviceId});
    },

    async createSession(sessions: Sessions_Info): Promise<boolean> {
        const anser = await sessionsCollection.insertOne(sessions);
        return anser.acknowledged
    },

    // TODO удалить функцию 
    async checkBlackList(id: string, token: string): Promise<Sessions_Info[] | []> {
        return await sessionsCollection.find({$and: [{userId: {$eq: id}}, {refreshToken: {$eq: token}}]}).toArray();
    },

    async updateSession(token: Sessions_Info): Promise<boolean> {
        const anser = await sessionsCollection.updateOne({userId: token.userId, diviceId: token.deviceId}, {$set: {iat: token.iat, exp: token.exp}});
        return anser.modifiedCount > 0 ? true : false
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
    
}