import {MeViewModel, Sessions_Info} from '../../types/auth-type'
import { injectable, inject } from "inversify";
import { SETTINGS } from "../../../settings";
import { Users } from "../../../users-module/infrastructure/model/users-model";
import mongoose from 'mongoose';
import { Sessions_Model } from "../model/authModel";



@injectable()
export class AuthRepoMethods {
    // TODO репозиторий не должен знать о usersModel, он должен работать только с коллекцией сессий, 
    // а данные юзера получать из юзер сервиса
    constructor(
        @inject(SETTINGS.TYPES.usersModel) public usersModel: typeof Users,
        @inject(SETTINGS.TYPES.sessionsModel) public sessionsModel: typeof Sessions_Model
    ) {}
    // TODO этот путь должен быть в query репозитории 
    async getSessionsInfo(userId: string, deviceId: string): Promise<Sessions_Info | null> {
        // TODO заменить коллекцию на монгус
        return await this.sessionsModel.findOne({userId, deviceId}, {projection: {_id: 0}})
    }

    async deleteToken(userId: string, deviceId: string): Promise<boolean> {
        // TODO заменить коллекцию на монгус
        const anser = await this.sessionsModel.deleteOne({userId, deviceId});
        return anser.acknowledged
    }

    async createSession(sessions: Sessions_Info): Promise<boolean> {
        // TODO заменить коллекцию на монгус
        const anser = await this.sessionsModel.create(sessions);
        if(anser) {
            return true
        } else {
            return false
        }
    }

    async updateSession(token: Sessions_Info): Promise<boolean> {
        // TODO заменить коллекцию на монгус
        const anser = await this.sessionsModel.updateOne({userId: token.userId, deviceId: token.deviceId}, {$set: {iat: token.iat, exp: token.exp}});
        // TODO уточни какой вариант нужно использовать
        // использовать если один и тот же токен не может быть актуальным 
        // то есть пользователь сделал запрос получил новый токен но присылает опять старый (нужно ли ему выдавать еще токен?)
        return anser.modifiedCount > 0 ? true : false 
        // если ответ на вопрос выше "нет" то используй эту проверку
        // return anser.matchedCount > 0 ? true : false
    }
     // TODO этот путь должен быть в query репозитории 
    async checkAuthentication(data: string): Promise<boolean> {        
        const filter = {$or: [{login: data}, {email: data}]}

        // TODO authRepo не должен знать о usersCollection
        // const result = await usersCollection.find(filter).toArray(); 
        const result = await this.usersModel.find(filter)
        if(result.length) {
            return true
        } else {
            return false
        }
    }


    async credential(data: string): Promise<{id: string, hash: string, salt: string}>  {
        const filter = {$or: [{login: data}, {email: data}]}
        // TODO authRepo не должен знать о usersCollection
        // const result = await usersCollection.findOne(filter, {projection: {_id:1, hash:1, salt: 1}});
        const result = await this.usersModel.findOne(filter).select({_id: 1, hash: 1, salt: 1});
        return {id: result!._id.toString() , hash: result!.hash, salt: result!.salt}
    } 

    async getUserById(id: string): Promise<MeViewModel | undefined> {
        // TODO authRepo не должен знать о usersCollection
        const user = await this.usersModel.findById({_id: new mongoose.Types.ObjectId(id)}).select({email: 1, login: 1});
        if(!user) return undefined
        return {email: user.email!, login: user.login!, userId: id}
    }
    
    async getAllSessionsForUser(userId: string): Promise<Sessions_Info []> {
        // TODO заменить коллекцию на монгус
        return await this.sessionsModel.find({userId});
    }

    async deleteAllOtherSessions(userId: string, deviceId: string): Promise<boolean> {
        // TODO заменить коллекцию на монгус
        const anser = await this.sessionsModel.deleteMany({$and:[{userId}, {deviceId: {$ne: deviceId}}]});
        return anser.acknowledged
    }
    
    async closeSession(userId: string, deviceId: string): Promise<boolean> {
        // TODO заменить коллекцию на монгус
        const anser = await this.sessionsModel.deleteOne({userId, deviceId});
        return anser.acknowledged
    }

    async getInfoByDeviceId(deviceId: string): Promise<Sessions_Info []> {
        // TODO заменить коллекцию на монгус
        return await this.sessionsModel.find({deviceId});
    }

    async deleteAll(): Promise<void> {
        // TODO заменить коллекцию на монгус
        await this.sessionsModel.deleteMany({})
    }

}



