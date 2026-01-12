import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDb";
import { MeViewModel } from "../types/auth-type";

export const auth_Query_RepoMethods = {

    async getUserById(id: string): Promise<MeViewModel | undefined> {
        const objectId = new ObjectId(id);
        // TODO плохая практика делать прямой запрос в другую коллекцию
        // сделай запрос из сервиса в юзер сервис на получение данных
        const user = await usersCollection.findOne({_id: objectId})  
        if(!user) return undefined
        return {email: user.email!, login: user.login!, userId: id}
    },
    
}
