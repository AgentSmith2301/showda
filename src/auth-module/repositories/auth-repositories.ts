import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDb";
import { MeViewModel } from "../types/auth-type";

export const authRepoMethods = {
    
    // async сheckingForUniqueness(login: string, email: string) {
    //     const checkLogin = await usersCollection.find({login}).toArray();
    //     const checkEmail = await usersCollection.find({email}).toArray();
    //     if(checkLogin.length > 0 || checkEmail.length > 0) {
    //         return true
    //     } else {
    //         return false
    //     }
    // },
    
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
    } ,

    async getUserById(id: string): Promise<MeViewModel | undefined> {
        const objectId = new ObjectId(id);
        const user = await usersCollection.findOne({_id: objectId})
        if(!user) return undefined
        return {email: user.email!, login: user.login!, userId: id}
    },
    
}