import { Request, Response, NextFunction } from 'express';
import {rateLimiteRepositories} from '../repositories/rateLimiteRepositories' ;

export async function rateLimiteMiddleware(req: Request, res: Response, next: NextFunction) {
    let ip ;
    req.ip ? ip = req.ip : ip = 'ip not faund'
    let url = req.originalUrl;
    let date = new Date();
    let checkDate = new Date(date.valueOf() - 10000)
    const result = await rateLimiteRepositories.check_Request_Caunt(ip, url, checkDate);

    if(result < 5) {
        await rateLimiteRepositories.create_Url_Info(ip , url, date)
        next()
    } else {
        res.sendStatus(429)
    }


}





