import {Request, Response, NextFunction} from 'express'
import {authRepoMethods} from '../auth-module/repositories/auth-repositories'


export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const info = await authRepoMethods.getSessionsInfo(req.tokenPayload.userId, req.tokenPayload.deviceId);
    const vercionToken = new Date(req.tokenPayload.iat * 1000).toISOString();
    if(info!.iat != new Date(vercionToken)) {
        res.sendStatus(401)
        return
    }
    next()
}













