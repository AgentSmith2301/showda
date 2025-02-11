import {LoginInputModel, MeViewModel} from '../types/auth-type'
import {authRepoMethods} from '../repositories/auth-repositories'
import bcrypt from 'bcrypt';


export const authServiceMethods = {
    async authentication(data: LoginInputModel): Promise<{result: boolean, id: string | null}> {
        // проверка на существование пользователя с логином или почтой
        const result = await authRepoMethods.checkAuthentication(data.loginOrEmail)
        if(!result) return  {result: false, id: null}

        // получить хеш , соль и id
        const credention = await authRepoMethods.credential(data.loginOrEmail)

        // сравнение хешей
        const compareHash = await bcrypt.compare(data.password, credention.hash)
        if(!compareHash) return {result: false, id: null}
        return {result: true, id: credention.id}
    
    },

    async getUserById(id: string): Promise<MeViewModel> {
        return await authRepoMethods.getUserById(id)
    }


}