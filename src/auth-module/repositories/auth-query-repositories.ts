import { MeViewModel } from "../types/auth-type";
import mongoose from 'mongoose';
import {Users} from "../../users-module/infrastructure/model/users-model";
import { injectable, inject } from "inversify";
import {SETTINGS} from "../../settings";

@injectable()
export class Auth_Query_RepoMethods {

    constructor(@inject(SETTINGS.TYPES.usersModel) public usersModel: typeof Users) {}

    async getUserById(id: string): Promise<MeViewModel | undefined> {
        // const objectId = new mongoose.Types.ObjectId(id);
        // TODO плохая практика делать прямой запрос в другую коллекцию
        // сделай запрос из сервиса в юзер сервис на получение данных
        // TODO заменить коллекцию на монгус 
        const user = await this.usersModel.findOne({_id: new mongoose.Types.ObjectId(id)})  
        if(!user) return undefined
        return {email: user.email!, login: user.login!, userId: id}
    }
    
}
