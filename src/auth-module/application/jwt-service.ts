import jwt from 'jsonwebtoken'
import {SETTINGS} from '../../settings'
import {LoginSuccessViewModel}from '../types/auth-type'

export const jwtService = {
    async createJwtTocen(id: string): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({id}, SETTINGS.JWT_SECRET, {expiresIn: '5h'})
        return {accessToken: token}
    },

    async getIdByToken(id: string) {
        try {
            const result: any = jwt.verify(id, SETTINGS.JWT_SECRET)
            const token: string = result.id;
            return  token 
        } catch (err) {
            return null
        }
    }

}