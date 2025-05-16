import {SETTINGS} from '../settings';
import { Request, Response, NextFunction } from 'express';
import {jwtService} from '../auth-module/application/jwt-service'
// import {CastomRequest} from '../auth-module/types/auth-type'

export const checkAuthorization = (req: Request, res: Response, next: NextFunction) => {
    if(Buffer.from(SETTINGS.ADMIN_AUTH).toString('base64') === req.headers.authorization?.substring(6)) {
        next();
    } else {
        res.sendStatus(401)
        return
    }
}

export const  bearerAuthorization = async(req: Request, res: Response, next: NextFunction) => { 
    if(!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization?.split(' ')
    const authToken = await jwtService.getIdByToken(token![1]) 
    if(!authToken) {
        res.sendStatus(401)
        return
    } 



    req.userId = authToken;
    next(); 
}


