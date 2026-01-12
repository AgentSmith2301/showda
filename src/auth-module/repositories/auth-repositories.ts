import { ObjectId, WithId } from "mongodb";
import { usersCollection, sessionsCollection } from "../../db/mongoDb"; //TODO доступ к коллекции usersCollection должн происходить через userService
import {Refresh_Session_Token} from '../../types/refreshTokenType'
import {MeViewModel, Sessions_Info} from '../types/auth-type'


export const authRepoMethods = {
    async getSessionsInfo(userId: string, deviceId: string): Promise<Sessions_Info | null> {
        return await sessionsCollection.findOne({userId, deviceId}, {projection: {_id: 0}})
    },

    async deleteToken(userId: string, deviceId: string): Promise<boolean> {
        const anser = await sessionsCollection.deleteOne({userId, deviceId});
        return anser.acknowledged
    },

    async createSession(sessions: Sessions_Info): Promise<boolean> {
        const anser = await sessionsCollection.insertOne(sessions);
        return anser.acknowledged
    },

    async updateSession(token: Sessions_Info): Promise<boolean> {
        const anser = await sessionsCollection.updateOne({userId: token.userId, deviceId: token.deviceId}, {$set: {iat: token.iat, exp: token.exp}});
        // TODO уточни какой вариант нужно использовать
        // использовать если один и тот же токен не может быть актуальным 
        // то есть пользователь сделал запрос получил новый токен но присылает опять старый (нужно ли ему выдавать еще токен?)
        return anser.modifiedCount > 0 ? true : false 
        // если ответ на вопрос выше "нет" то используй эту проверку
        // return anser.matchedCount > 0 ? true : false
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
    
    async getAllSessionsForUser(userId: string): Promise<Sessions_Info []> {
        return await sessionsCollection.find({userId}).toArray()
    },

    async deleteAllOtherSessions(userId: string, deviceId: string): Promise<boolean> {
        const anser = await sessionsCollection.deleteMany({$and:[{userId}, {deviceId: {$ne: deviceId}}]});
        return anser.acknowledged
    }, 
    
    async closeSession(userId: string, deviceId: string): Promise<boolean> {
        const anser = await sessionsCollection.deleteOne({userId, deviceId});
        return anser.acknowledged
    },

    async getInfoByDeviceId(deviceId: string): Promise<Sessions_Info []> {
        return await sessionsCollection.find({deviceId}).toArray();
    }

}