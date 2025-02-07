import {LoginInputModel} from '../types/auth-type'
import {authRepoMethods} from '../repositories/auth-repositories'
import bcrypt from 'bcrypt';


export const authServiceMethods = {
    async authentication(data: LoginInputModel) {
        // проверка на существование пользователя с логином или почтой
        const result = await authRepoMethods.checkAuthentication(data.loginOrEmail)
        if(!result) return false

        // для получения хеша из базы
        const credention = await authRepoMethods.credential(data.loginOrEmail)

        // сравнение хешей
        const compareHash = await bcrypt.compare(data.password, credention.hash)
        if(!compareHash) return false
        return true 
    },
}