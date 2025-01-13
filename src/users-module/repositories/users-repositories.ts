import { usersCollection } from "../../db/mongoDb";
import { UserInputModel, UserViewModel } from "../types/users-type";



export const usersRepoMethods = {
    async deleteAll() {
        await usersCollection.deleteMany({})
    },
    async getUsersById(id: string): Promise<UserViewModel> {
        const user = await usersCollection.findOne({_id: id})
        //TODO изменить объект заменив _id на id
        let mapUSer ;
        if(user) {
            mapUSer = {
                id: user._id as string,
                login: user.login as string,
                email: user.email as string,
                createdAt: user.createdAt as string
            }
        }

        return mapUSer!
    },


    // TODO оставить если будет нудна проверка на существование login и email
    // async checkData(login: string, email: string) {
    //     const result = await usersCollection.findOne({login, email});
    //     if(!result) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // },

    async createUser(data: UserInputModel & {createdAt: string}) { // : Promise<UserViewModel>
        const result = await usersCollection.insertOne({...data})
        return result 

        // if(result!.acknowledged === true) {
        //     // await usersCollection.findOne({_id: result!.insertedId})
        //     let dataForReturn: UserViewModel = {
        //         id: result.insertedId.toString(),
        //         login: data.login,
        //         email: data.email,
        //         createdAt:
    
        //     }

        // }

        // let dataForReturn: UserViewModel | null = {
        //     id: result.insertedId.toString(),
        //     login: 

        // }

    },

    
}