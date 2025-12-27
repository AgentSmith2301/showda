import jwt, { JwtPayload } from 'jsonwebtoken'
import {SETTINGS} from '../../settings'
import {LoginSuccessViewModel, PayloadFromToken, Refresh_Session_Token}from '../types/auth-type'
import { refreshTokenGuard } from '../helpers/refreshTokenTypeGuard'

export const jwtService = {
    async createJwtToken(id: string): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({id}, SETTINGS.JWT_SECRET, {expiresIn: '1000s'}) //TODO 10 
        return {accessToken: token}
    },

    async getIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            const id: string = result.id;
            return id
        } catch (err) {
            return null
        }
    },

    async getPayloadByToken(token: string): Promise<PayloadFromToken | null> {
        try {
            const payload = jwt.verify(token, SETTINGS.JWT_SECRET);
            // функция гуард (приведение к типу)
            function checkPayload(obj: any): obj is PayloadFromToken {
                return typeof obj.id === 'string'
            }

            if(checkPayload(payload)) {
                return payload
            } else {
                return null
            }
            
        } catch (err) {
            if(err instanceof jwt.TokenExpiredError) {
                console.warn('не верный токен')
            } else {
                console.warn(`не известная ошибка ${err}`)
            }
            return null
        }
        
    },

    async check_Refresh_Token_And_Return_Payload(token: string): Promise<Refresh_Session_Token | undefined> {
        try {
            const payload = jwt.verify(token, SETTINGS.JWT_SECRET);   
            if(refreshTokenGuard(payload)) {
                return payload
            } else {
                return undefined
            }
        } catch(err) {
            if(err instanceof jwt.JsonWebTokenError) {
                console.log('токен не валидный')
            } else if(err instanceof jwt.TokenExpiredError) {
                console.log('токен протух')
            }
            return undefined
        }
    },

    async createRefreshToken(id: string, device: string): Promise<string> {
        return jwt.sign({userId: id, deviceId: device},SETTINGS.JWT_SECRET, {expiresIn: '20000s'}) //TODO 20
    },
    
    async getInfoFromToken(token: string): Promise<{userId:string; diviceId: string; iat: number; exp: number}> {
        // payload можно было получить и с помощью метода jwt.decode()
        const partOfTheToken = token.split('.');
        const lifeTime = Buffer.from(partOfTheToken[1], 'base64').toString('utf-8');
        return JSON.parse(lifeTime)
    },

    // async getNewTokens(oldToken: string) {
    //     // const userId = await this.getIdByToken(oldToken);

    // },

}