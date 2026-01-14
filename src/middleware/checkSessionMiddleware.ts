import {Request, Response, NextFunction} from 'express'
import {authRepoMethods} from '../auth-module/repositories/auth-repositories'


export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const info = await authRepoMethods.getSessionsInfo(req.tokenPayload.userId, req.tokenPayload.deviceId);
    const vercionToken = new Date(req.tokenPayload.iat * 1000); 
    // сравнение работает но лучше делать через info!.iat.getTime() !== req.tokenPayload.iat * 1000
    // в таком случае сравниваются числа
    // и это быстрее 
    // или даже через +info!.iat !== vercionToken.valueOf()
    if(info!.iat.toISOString() !== vercionToken.toISOString()) {
        res.sendStatus(401)
        return
    }
    next()
}













