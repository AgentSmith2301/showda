import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDb";
import { MeViewModel } from "../types/auth-type";

export const authRepoMethods = {
    
    async checkAuthentication(data: string): Promise<boolean> {
        const filter = {$or: [{login: data}, {email: data}]}
        const result = await usersCollection.find(filter).toArray();
        if(result.length) {
            return true
        } else {
            return false
        }
    },

    async credential(data: string): Promise<{id: string, hash: string, salt: string}>  {
        const filter = {$or: [{login: data}, {email: data}]}
        const result = await usersCollection.findOne(filter, {projection: {_id:1, hash:1, salt: 1}});
        return {id: result!._id.toString() , hash: result!.hash, salt: result!.salt}
        // return result!
    } ,

    async getUserById(id: string): Promise<MeViewModel> {
        const objectId = new ObjectId(id);
        const user = await usersCollection.findOne({_id: objectId})
        return {email: user!.email!, login: user!.login!, userId: id}
    }
    
}