import { Request, Response, NextFunction } from 'express';
import {jwtService} from '../auth-module/application/jwt-service'


export async function checkRefreshToken(req:Request, res:Response, next:NextFunction) {
    // определить тип
    type Refresh = {refreshToken: string;}
    function guardToken(token: any): token is Refresh {
        return typeof token.refreshToken === 'string'
    }

    if(!req.cookies || !req.cookies.refreshToken) res.sendStatus(401)
    
    if(guardToken(req.cookies)) {

        const payloadFromToken = await jwtService.getPayloadByToken(req.cookies.refreshToken);
        if(!payloadFromToken) { 
            res.status(401).send('user is not unauthorized')
            return 
        }

        req.tokenPayload = payloadFromToken;
        next()
    }

}